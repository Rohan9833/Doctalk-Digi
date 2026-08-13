const AdminModel = require("../Model/AdminModel");
const Tlm = require("../Model/TlmModel");
const Slm = require("../Model/SlmModel");
const Flm = require("../Model/FlmModel");
const Mr = require("../Model/MrModel");
const xlsx = require("xlsx");


const handleExcelsheetUpload = async (req, res) => {
  try {
    const AdminId = req.params.id;

    const admin = await AdminModel.findById(req.admin._id);
    if (!admin) {
      return res.status(400).json({ msg: "Admin Not Found" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Excel sheet missing" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData || sheetData.length === 0) {
      return res.status(400).json({ success: false, error: "Data Missing" });
    }

    const successCount = { tlm: 0, slm: 0, flm: 0, mr: 0 };
    const errorMessages = [];

    for (let i = 0; i < sheetData.length; i++) {
      const row = sheetData[i];
      const rowNumber = i + 2;

      try {
        // ✅ 1. TLM PROCESSING
        const tlmId = row.TLMID?.toString().trim();
        let currentTlmRef = null;

        if (tlmId) {
          let existTlm = await Tlm.findOne({ tlmId });

          if (existTlm) {
            if (row.TLMNAME)        existTlm.tlmName      = row.TLMNAME.toString().trim();
            if (row.TLMREGION)      existTlm.region       = row.TLMREGION.toString().trim();
            if (row.TLMZONE)        existTlm.zone         = row.TLMZONE.toString().trim();
            if (row.TLMBUSINESSUNIT) existTlm.BUSINESSUNIT = row.TLMBUSINESSUNIT.toString().trim();
            existTlm.password = row.TLMPASSWORD?.toString().trim() || existTlm.password || tlmId;
            await existTlm.save();
            currentTlmRef = existTlm;
          } else {
            existTlm = new Tlm({
              tlmId,
              password:     row.TLMPASSWORD?.toString().trim() || tlmId,
              tlmName:      row.TLMNAME?.toString().trim(),
              region:       row.TLMREGION?.toString().trim(),
              zone:         row.TLMZONE?.toString().trim(),
              BUSINESSUNIT: row.TLMBUSINESSUNIT?.toString().trim(),
            });
            await existTlm.save();
            currentTlmRef = existTlm;

            if (!admin.Tlm) admin.Tlm = [];
            if (!admin.Tlm.includes(existTlm._id)) {
              admin.Tlm.push(existTlm._id);
              await admin.save();
            }
            successCount.tlm++;
          }
        }

        // ✅ 2. SLM PROCESSING
        const slmId = row.SLMID?.toString().trim();
        let currentSlmRef = null;

        if (slmId) {
          let existSlm = await Slm.findOne({ slmId });

          if (existSlm) {
            if (row.SLMNAME)        existSlm.slmName      = row.SLMNAME.toString().trim();
            if (row.SLMREGION)      existSlm.region       = row.SLMREGION.toString().trim();
            if (row.SLMZONE)        existSlm.zone         = row.SLMZONE.toString().trim();
            if (row.SLMBUSINESSUNIT) existSlm.BUSINESSUNIT = row.SLMBUSINESSUNIT.toString().trim();
            existSlm.password = row.SLMPASSWORD?.toString().trim() || existSlm.password || slmId;
            await existSlm.save();
            currentSlmRef = existSlm;
          } else {
            existSlm = new Slm({
              slmId,
              password:     row.SLMPASSWORD?.toString().trim() || slmId,
              slmName:      row.SLMNAME?.toString().trim(),
              region:       row.SLMREGION?.toString().trim(),
              zone:         row.SLMZONE?.toString().trim(),
              BUSINESSUNIT: row.SLMBUSINESSUNIT?.toString().trim(),
            });
            await existSlm.save();
            currentSlmRef = existSlm;
            successCount.slm++;
          }

          // Link SLM → TLM
          if (currentTlmRef && currentSlmRef) {
            if (!currentTlmRef.Slm) currentTlmRef.Slm = [];
            if (!currentTlmRef.Slm.map((id) => id.toString()).includes(currentSlmRef._id.toString())) {
              currentTlmRef.Slm.push(currentSlmRef._id);
              await currentTlmRef.save();
            }
          }
        }

        // ✅ 3. FLM PROCESSING
        const flmId = row.FLMID?.toString().trim();
        let currentFlmRef = null;

        if (flmId) {
          let existFlm = await Flm.findOne({ flmId });

          if (existFlm) {
            if (row.FLMNAME)        existFlm.flmName      = row.FLMNAME.toString().trim();
            if (row.FLMREGION)      existFlm.region       = row.FLMREGION.toString().trim();
            if (row.FLMZONE)        existFlm.zone         = row.FLMZONE.toString().trim();
            if (row.FLMBUSINESSUNIT) existFlm.BUSINESSUNIT = row.FLMBUSINESSUNIT.toString().trim();
            existFlm.password = row.FLMPASSWORD?.toString().trim() || existFlm.password || flmId;
            await existFlm.save();
            currentFlmRef = existFlm;
          } else {
            existFlm = new Flm({
              flmId,
              password:     row.FLMPASSWORD?.toString().trim() || flmId,
              flmName:      row.FLMNAME?.toString().trim(),
              region:       row.FLMREGION?.toString().trim(),
              zone:         row.FLMZONE?.toString().trim(),
              BUSINESSUNIT: row.FLMBUSINESSUNIT?.toString().trim(),
            });
            await existFlm.save();
            currentFlmRef = existFlm;
            successCount.flm++;
          }

          // Link FLM → SLM
          if (currentSlmRef && currentFlmRef) {
            if (!currentSlmRef.Flm) currentSlmRef.Flm = [];
            if (!currentSlmRef.Flm.map((id) => id.toString()).includes(currentFlmRef._id.toString())) {
              currentSlmRef.Flm.push(currentFlmRef._id);
              await currentSlmRef.save();
            }
          }
        }

        // ✅ 4. MR PROCESSING
        const mrId = row.MRID?.toString().trim();

        if (mrId) {
          let existingMr = await Mr.findOne({ mrId });

          const mrPayload = {
            mrName:       row.MRNAME?.toString().trim(),
            password:     row.MRPASSWORD?.toString().trim() || mrId,
            HQ:           row.MRHQ?.toString().trim(),
            region:       row.MRREGION?.toString().trim(),
            zone:         row.MRZONE?.toString().trim(),
            BUSINESSUNIT: row.MRBUSINESSUNIT?.toString().trim(),
          };

          if (existingMr) {
            Object.assign(existingMr, mrPayload);
            await existingMr.save();
          } else {
            existingMr = new Mr({ ...mrPayload, mrId });
            await existingMr.save();
            successCount.mr++;
          }

          // Link MR → FLM
          if (currentFlmRef && existingMr) {
            if (!currentFlmRef.Mr) currentFlmRef.Mr = [];
            if (!currentFlmRef.Mr.map((id) => id.toString()).includes(existingMr._id.toString())) {
              currentFlmRef.Mr.push(existingMr._id);
              await currentFlmRef.save();
            }
          }
        }

      } catch (rowError) {
        errorMessages.push(`Row ${rowNumber}: ${rowError.message}`);
      }
    }

    res.status(200).json({
      message: "Upload successful — Hierarchy: TLM → SLM → FLM → MR",
      summary: successCount,
      errors: errorMessages.length > 0 ? errorMessages : null,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  handleExcelsheetUpload,
};