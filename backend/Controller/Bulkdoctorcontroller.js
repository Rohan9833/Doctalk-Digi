const xlsx = require("xlsx");
const mongoose = require("mongoose");
const Doctor = require("../Model/DoctorModel");
const Campaign = require("../Model/CampaignModel");
const Mr = require("../Model/MrModel");

// ── helpers ───────────────────────────────────────────────
const generateDoctorId = () =>
  "DOC-" + Date.now().toString(36).toUpperCase() +
  Math.random().toString(36).substring(2, 5).toUpperCase();

const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

const uniqueSlug = async (base) => {
  let slug = base, counter = 1;
  while (await Doctor.findOne({ pageSlug: slug })) slug = `${base}-${counter++}`;
  return slug;
};

// ── Flexible campaign finder ──────────────────────────────
const findCampaign = async (value) => {
  if (!value) return null;
  const str = value.toString().trim();

  if (mongoose.Types.ObjectId.isValid(str)) {
    const c = await Campaign.findById(str);
    if (c) return c;
  }
  const byField = await Campaign.findOne({ campaignId: str });
  if (byField) return byField;

  const byName = await Campaign.findOne({ name: { $regex: `^${str}$`, $options: "i" } });
  return byName || null;
};

// ── Flexible MR finder ────────────────────────────────────
const findMr = async (value) => {
  if (!value) return null;
  const str = value.toString().trim();

  if (mongoose.Types.ObjectId.isValid(str)) {
    const m = await Mr.findById(str);
    if (m) return m;
  }
  const byField = await Mr.findOne({ mrId: str });
  if (byField) return byField;

  const byName = await Mr.findOne({ mrName: { $regex: `^${str}$`, $options: "i" } });
  return byName || null;
};

// ════════════════════════════════════════════════
// POST /api/upload/doctors
// ════════════════════════════════════════════════
const bulkUploadDoctors = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Excel file is required" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!rows || rows.length === 0) {
      return res.status(400).json({ success: false, error: "Excel sheet is empty" });
    }

    const results = { created: 0, updated: 0, skipped: 0, errors: [] };
    const campaignCache = {};
    const mrCache = {};

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      try {
        const name = row.DOCTORNAME?.toString().trim();
        if (!name) {
          results.errors.push(`Row ${rowNumber}: DOCTORNAME is required - skipping`);
          results.skipped++;
          continue;
        }

        // ── Resolve Campaign (Required) ──────────────────────
        const campValue = row.CAMPAIGN?.toString().trim() || row.CAMPAIGNID?.toString().trim();
        let campaignRef = null;

        if (!campValue) {
          results.errors.push(`Row ${rowNumber}: CAMPAIGN is required - skipping doctor "${name}"`);
          results.skipped++;
          continue;
        }

        if (!campaignCache[campValue]) {
          campaignCache[campValue] = await findCampaign(campValue);
        }
        campaignRef = campaignCache[campValue];

        if (!campaignRef) {
          results.errors.push(
            `Row ${rowNumber}: Campaign "${campValue}" not found - skipping doctor "${name}"`
          );
          results.skipped++;
          continue;
        }

        // ── Resolve MR (Required - skip if missing) ──────────
        const mrValue = row.MRID?.toString().trim();
        
        if (!mrValue) {
          results.errors.push(`Row ${rowNumber}: MRID is required - skipping doctor "${name}"`);
          results.skipped++;
          continue;
        }

        if (!mrCache[mrValue]) {
          mrCache[mrValue] = await findMr(mrValue);
        }
        const mrRef = mrCache[mrValue];

        if (!mrRef) {
          results.errors.push(
            `Row ${rowNumber}: MR "${mrValue}" not found in database - skipping doctor "${name}"`
          );
          results.skipped++;
          continue;
        }

        // ── Check if doctor already exists (by name + campaign) ─
        const existing = await Doctor.findOne({
          name: { $regex: `^${name}$`, $options: "i" },
          campaign: campaignRef._id,
        });

        if (existing) {
          // ── Update existing doctor ──────────────────────
          if (row.SPECIALTY) existing.specialty = row.SPECIALTY.toString().trim();
          if (row.QUALIFICATION) existing.qualification = row.QUALIFICATION.toString().trim();
          if (row.REGISTRATIONNO) existing.registrationNo = row.REGISTRATIONNO.toString().trim();
          if (row.EMAIL) existing.email = row.EMAIL.toString().trim().toLowerCase();
          if (row.MOBILE) existing.mobile = row.MOBILE.toString().trim();
          if (row.ADDRESS) existing.address = row.ADDRESS.toString().trim();
          if (row.CLINIC) existing.clinic = row.CLINIC.toString().trim();
          if (row.CITY) existing.city = row.CITY.toString().trim();
          if (row.STATE) existing.state = row.STATE.toString().trim();
          
          // Only update MR if provided (but we already validated it exists)
          if (mrRef) existing.mr = mrRef._id;

          await existing.save();
          results.updated++;
        } else {
          // ── Create new doctor ───────────────────────────
          const slug = await uniqueSlug(toSlug(name));
          const doctor = new Doctor({
            doctorId: generateDoctorId(),
            name,
            specialty: row.SPECIALTY?.toString().trim() || null,
            qualification: row.QUALIFICATION?.toString().trim() || null,
            registrationNo: row.REGISTRATIONNO?.toString().trim() || null,
            email: row.EMAIL?.toString().trim().toLowerCase() || null,
            mobile: row.MOBILE?.toString().trim() || null,
            address: row.ADDRESS?.toString().trim() || null,
            clinic: row.CLINIC?.toString().trim() || null,
            city: row.CITY?.toString().trim() || null,
            state: row.STATE?.toString().trim() || null,
            pageSlug: slug,
            campaign: campaignRef._id,
            mr: mrRef._id,
          });

          await doctor.save();

          // Link doctor to campaign
          await Campaign.findByIdAndUpdate(campaignRef._id, {
            $addToSet: { doctors: doctor._id },
          });

          // Link doctor to MR
          await Mr.findByIdAndUpdate(mrRef._id, {
            $addToSet: { doctors: doctor._id },
          });

          results.created++;
        }
      } catch (rowErr) {
        console.error(`Row ${rowNumber} error:`, rowErr);
        results.errors.push(`Row ${rowNumber}: ${rowErr.message} - skipping`);
        results.skipped++;
      }
    }

    res.status(200).json({
      success: true,
      message: "Bulk doctor import complete",
      summary: {
        total: rows.length,
        created: results.created,
        updated: results.updated,
        skipped: results.skipped,
      },
      errors: results.errors.length > 0 ? results.errors : null,
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { bulkUploadDoctors };