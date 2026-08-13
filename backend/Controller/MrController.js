const Mr = require("../Model/MrModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_production";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

const nodemailer = require("nodemailer");

const crypto = require("crypto");
const Doctor = require("../Model/DoctorModel");

const sendEmailViaBrevo = require("../utils/brevoEmail");

const Campaign = require("../Model/CampaignModel");
const BASE_URL = process.env.BASE_URL || "https://quiz.pharma.com";
// const Mr       = require("../Model/MrModel");

const signMrToken = (id, mrId) =>
  jwt.sign({ id, mrId, role: "mr" }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// ════════════════════════════════════════════════
// POST /api/mr/auth/login
// Body: { mrId, password }
// MR logs in with their mrId (employee code) + password
// ════════════════════════════════════════════════
const mrLogin = async (req, res) => {
  try {
    const { mrId, password } = req.body;

    console.log("I am received.")

    if (!mrId || !password) {
      return res
        .status(400)
        .json({ success: false, error: "mrId and password are required" });
    }

    const mr = await Mr.findOne({ mrId: mrId.toString().trim() });
    if (!mr) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Simple password check
    // NOTE: MR passwords from Excel are plain text currently.
    // If you hash them later, swap this for bcrypt.compare()
    if (mr.password !== password) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = signMrToken(mr._id, mr.mrId);

    res.cookie("mr_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token,
      data: {
        id: mr._id,
        mrId: mr.mrId,
        mrName: mr.mrName,
        HQ: mr.HQ,
        region: mr.region,
        zone: mr.zone,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/mr/auth/logout
// ════════════════════════════════════════════════
const mrLogout = (req, res) => {
  res.cookie("mr_token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, message: "Logged out" });
};

// ════════════════════════════════════════════════
// GET /api/mr/auth/me
// ════════════════════════════════════════════════
const mrMe = async (req, res) => {
  try {
    const mr = await Mr.findById(req.mr._id).lean();
    if (!mr)
      return res.status(404).json({ success: false, error: "MR not found" });
    res.status(200).json({ success: true, data: mr });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const protectMr = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.mr_token) {
      token = req.cookies.mr_token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated. Please log in.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure it's an MR token
    if (decoded.role !== "mr") {
      return res.status(403).json({ success: false, error: "Access denied." });
    }

    const mr = await Mr.findById(decoded.id).lean();
    if (!mr) {
      return res
        .status(401)
        .json({ success: false, error: "MR account not found." });
    }

    req.mr = mr;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Session expired. Please log in again.",
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, error: "Invalid token." });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Transporter ───────────────────────────────────────────
// Uses Gmail. For production swap to SendGrid / SES.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your login password)
  },
});

// ════════════════════════════════════════════════
// sendConsentEmail
// Sends the consent invitation email to the doctor.
// ════════════════════════════════════════════════
// const sendConsentEmail = async ({ doctorName, doctorEmail, consentLink }) => {
//   const html = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <style>
//     body { margin: 0; padding: 0; background: #f4f6fa; font-family: Arial, sans-serif; }
//     .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff;
//                border-radius: 12px; overflow: hidden;
//                box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
//     .header { background: #ffffff; padding: 24px 32px 16px; border-bottom: 1px solid #eef1f8; }
//     .header-inner { display: flex; align-items: center; gap: 12px; }
//     .logo-circle { width: 44px; height: 44px; border-radius: 50%; background: #1a2e6c;
//                    display: inline-flex; align-items: center; justify-content: center;
//                    flex-shrink: 0; }
//     .logo-circle span { color: #ffffff; font-size: 20px; font-weight: 900;
//                         font-family: Georgia, serif; line-height: 1; }
//     .brand { font-size: 18px; font-weight: 700; color: #1a2e6c; margin: 0; }
//     .body { padding: 28px 32px 32px; color: #333; }
//     .body p { line-height: 1.7; font-size: 15px; margin: 0 0 16px; }
//     .points { background: #f0f4ff; border-radius: 8px; padding: 20px 24px; margin: 20px 0; }
//     .point { display: flex; align-items: flex-start; gap: 10px;
//              margin-bottom: 12px; font-size: 14px; color: #444; }
//     .point:last-child { margin-bottom: 0; }
//     .check { color: #1a9e6c; font-size: 16px; margin-top: 2px; flex-shrink: 0; }
//     .btn-wrap { text-align: center; margin: 28px 0; }
//     .btn { display: inline-block; background: #2563eb; color: #ffffff !important;
//            text-decoration: none; padding: 14px 36px; border-radius: 8px;
//            font-size: 16px; font-weight: bold; letter-spacing: 0.3px; }
//     .note { font-size: 13px; color: #888; text-align: center; margin-top: 8px; }
//     .footer { background: #f4f6fa; padding: 20px 32px; text-align: center;
//               font-size: 12px; color: #aaa; border-top: 1px solid #e8eaf0; }
//   </style>
// </head>
// <body>
//   <div class="wrapper">

//     <!-- Header: white bg, navy logo circle + brand name -->
//     <div class="header">
//       <div class="header-inner">
  
//         <p class="brand">DocTalk Quiz</p>
//       </div>
//     </div>

//     <div class="body">
//       <p>Dear <strong>${doctorName}</strong>,</p>
//       <p>
//         You are invited to participate in the <strong>DocTalk Quiz</strong> activity.
//         Please review the details below and provide your consent.
//       </p>

//       <div class="points">
//         <div class="point">
//           <span class="check">✔</span>
//           <span>This activity is an educational awareness initiative.</span>
//         </div>
//         <div class="point">
//           <span class="check">✔</span>
//           <span>Your photo and professional details may be used to create and host your doctor quiz experience.</span>
//         </div>
//         <div class="point">
//           <span class="check">✔</span>
//           <span>The activity may be accessed by patients via a web link or QR code.</span>
//         </div>
//         <div class="point">
//           <span class="check">✔</span>
//           <span>Weekly analytics reports may be shared with you.</span>
//         </div>
//       </div>

//       <div class="btn-wrap">
//         <a href="${consentLink}" class="btn">Review &amp; Provide Consent</a>
//       </div>
//       <p class="note">This link is unique to you and valid for <strong>7 days</strong>.</p>
//       <p class="note">If you did not expect this email, please ignore it.</p>
//     </div>

//     <div class="footer">
//       &mdash; DocTalk Quiz Team &nbsp;|&nbsp; info@digilateral.com
//     </div>
//   </div>
// </body>
// </html>
//   `;

//   await transporter.sendMail({
//     from: `"DocTalk Quiz" <${process.env.EMAIL_USER}>`,
//     to: doctorEmail,
//     subject: "Action Required: Consent for DocTalk Quiz Activity",
//     html,
//   });
// };

const sendConsentEmail = async ({ doctorName, doctorEmail, consentLink }) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin: 0; padding: 0; background: #f4f6fa; font-family: Arial, sans-serif; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff;
               border-radius: 12px; overflow: hidden;
               box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .header { background: #ffffff; padding: 24px 32px 16px; border-bottom: 1px solid #eef1f8; }
    .brand { font-size: 18px; font-weight: 700; color: #1a2e6c; margin: 0; }
    .body { padding: 28px 32px 32px; color: #333; }
    .body p { line-height: 1.7; font-size: 15px; margin: 0 0 16px; }
    .points { background: #f0f4ff; border-radius: 8px; padding: 20px 24px; margin: 20px 0; }
    .point { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 14px; color: #444; }
    .point:last-child { margin-bottom: 0; }
    .check { color: #1a9e6c; font-size: 16px; margin-top: 2px; flex-shrink: 0; }
    .btn-wrap { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important;
           text-decoration: none; padding: 14px 36px; border-radius: 8px;
           font-size: 16px; font-weight: bold; letter-spacing: 0.3px; }
    .note { font-size: 13px; color: #888; text-align: center; margin-top: 8px; }
    .footer { background: #f4f6fa; padding: 20px 32px; text-align: center;
              font-size: 12px; color: #aaa; border-top: 1px solid #e8eaf0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <p class="brand">DocTalk Quiz</p>
    </div>
    <div class="body">
      <p>Dear <strong>${doctorName}</strong>,</p>
      <p>You are invited to participate in the <strong>DocTalk Quiz</strong> activity.</p>
      <div class="points">
        <div class="point"><span class="check">✔</span><span>This activity is an educational awareness initiative.</span></div>
        <div class="point"><span class="check">✔</span><span>Your photo and professional details may be used.</span></div>
        <div class="point"><span class="check">✔</span><span>Patients access via QR code or web link.</span></div>
        <div class="point"><span class="check">✔</span><span>Weekly analytics reports may be shared.</span></div>
      </div>
      <div class="btn-wrap">
        <a href="${consentLink}" class="btn">Review &amp; Provide Consent</a>
      </div>
      <p class="note">This link is valid for <strong>7 days</strong>.</p>
    </div>
    <div class="footer">&mdash; DocTalk Quiz Team &nbsp;|&nbsp; info@digilateral.com</div>
  </div>
</body>
</html>`;

  await sendEmailViaBrevo({
    to: { email: doctorEmail, name: `Dr. ${doctorName}` },
    subject: "Action Required: Consent for DocTalk Quiz Activity",
    htmlContent: html,
    senderName: "DocTalk Quiz",
  });
};

const generateDoctorId = () =>
  "DOC-" +
  Date.now().toString(36).toUpperCase() +
  Math.random().toString(36).substring(2, 5).toUpperCase();

const toSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const uniqueSlug = async (base) => {
  let slug = base,
    counter = 1;
  while (await Doctor.findOne({ pageSlug: slug }))
    slug = `${base}-${counter++}`;
  return slug;
};

// ════════════════════════════════════════════════
// GET /api/mr/doctors
// MR sees only their own doctors
// ════════════════════════════════════════════════
const getMyDoctors = async (req, res) => {
  try {
    const { search, consentStatus } = req.query;

    const filter = { mr: req.mr._id };
    if (consentStatus && consentStatus !== "all")
      filter.consentStatus = consentStatus;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { clinic: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(filter)
      .sort({ name: 1 })
      .populate("campaign", "name therapyArea brand")
      .lean();

    res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/mr/doctors/:id
// MR can only view their own doctor
// ════════════════════════════════════════════════
const getMyDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, mr: req.mr._id })
      .populate("campaign", "name therapyArea brand")
      .lean();

    if (!doctor)
      return res
        .status(404)
        .json({ success: false, error: "Doctor not found" });

    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/mr/doctors
// MR adds a new doctor
// Body: { name, specialty, qualification, registrationNo,
//         email, mobile, address, clinic, city, state, campaignId }
// ════════════════════════════════════════════════
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      qualification,
      registrationNo,
      email,
      mobile,
      address,
      clinic,
      city,
      state,
      campaignId,
    } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ success: false, error: "Doctor name is required" });
    if (!email)
      return res
        .status(400)
        .json({ success: false, error: "Doctor email is required" });

    // ── Resolve campaign ──────────────────────────────────
    let campaignRef = null;
    if (campaignId) {
      campaignRef = await Campaign.findById(campaignId);
      if (!campaignRef) {
        return res
          .status(404)
          .json({ success: false, error: "Campaign not found" });
      }
    }

    // ── Check duplicate (same email + campaign) ───────────
    const existing = await Doctor.findOne({
      email: email.toLowerCase().trim(),
      campaign: campaignRef?._id || null,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "A doctor with this email already exists in this campaign",
      });
    }

    const slug = await uniqueSlug(toSlug(name));
    const doctor = new Doctor({
      doctorId: generateDoctorId(),
      name,
      specialty,
      qualification,
      registrationNo,
      email: email.toLowerCase().trim(),
      mobile,
      address,
      clinic,
      city,
      state,
      pageSlug: slug,
      campaign: campaignRef?._id || null,
      mr: req.mr._id,
    });

    await doctor.save();

    // Link doctor → campaign
    if (campaignRef) {
      await Campaign.findByIdAndUpdate(campaignRef._id, {
        $addToSet: { doctors: doctor._id },
      });
    }

    // Link doctor → MR
    await Mr.findByIdAndUpdate(req.mr._id, {
      $addToSet: { Mr: doctor._id }, // adjust field name if your MrModel uses a different key
    });

    res.status(201).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// PUT /api/mr/doctors/:id
// MR updates doctor contact details
// ════════════════════════════════════════════════
const updateMyDoctor = async (req, res) => {
  try {
    const allowed = [
      "email",
      "mobile",
      "address",
      "specialty",
      "qualification",
      "registrationNo",
      "clinic",
      "city",
      "state",
    ];

    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    // If email changed → reset consent (need to resend)
    if (updates.email) {
      const current = await Doctor.findOne({
        _id: req.params.id,
        mr: req.mr._id,
      });
      if (current && current.email !== updates.email.toLowerCase().trim()) {
        updates.consentStatus = "not_sent";
        updates.consentGiven = false;
        updates.consentSentAt = null;
        updates.consentAcceptedAt = null;
      }
      updates.email = updates.email.toLowerCase().trim();
    }

    const doctor = await Doctor.findOneAndUpdate(
      { _id: req.params.id, mr: req.mr._id },
      { $set: updates },
      { new: true, runValidators: true },
    ).populate("campaign", "name therapyArea brand");

    if (!doctor)
      return res
        .status(404)
        .json({ success: false, error: "Doctor not found" });

    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/mr/doctors/:id/send-consent
// MR sends consent email to doctor
// ════════════════════════════════════════════════
const sendConsent = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      mr: req.mr._id,
    }).select("+consentToken"); // include hidden field

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, error: "Doctor not found" });
    }
    if (!doctor.email) {
      return res
        .status(400)
        .json({ success: false, error: "Doctor has no email address" });
    }
    if (doctor.consentStatus === "accepted") {
      return res
        .status(400)
        .json({ success: false, error: "Doctor has already accepted consent" });
    }

    // ── Generate token + update doctor ────────────────────
    const rawToken = doctor.generateConsentToken(); // sets consentToken (hashed), expiry, status
    await doctor.save();

    // ── Build consent page link ───────────────────────────
    // Doctor clicks this → opens the consent form page
    const consentLink = `http://192.168.1.37:5173/consent/${rawToken}`;

    // ── Send email ────────────────────────────────────────
    await sendConsentEmail({
      doctorName: doctor.name,
      doctorEmail: doctor.email,
      consentLink,
    });

    res.status(200).json({
      success: true,
      message: `Consent form sent to ${doctor.email}`,
      data: {
        consentStatus: doctor.consentStatus,
        consentSentAt: doctor.consentSentAt,
        email: doctor.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/mr/campaigns
// MR sees campaigns available to assign doctors to
// ════════════════════════════════════════════════
const getAvailableCampaigns = async (req, res) => {
  console.log("Fetching active campaigns for MRRRR:");
  try {
    const campaigns = await Campaign.find({ status: "active" })
      .select("_id name therapyArea brand")
      .lean(); 

    res.status(200).json({ success: true, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/consent/:token
// Doctor opens the link from email.
// Returns doctor details to pre-fill the consent form.
// ════════════════════════════════════════════════
const getConsentPage = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const doctor = await Doctor.findOne({
      consentToken: hashedToken,
      consentTokenExpiry: { $gt: new Date() }, // not expired
    })
      .populate("campaign", "name therapyArea brand")
      .lean();

    console.log("Found doctor:", doctor ? doctor._id : "None");
    console.log("Current time:", new Date());
    console.log("Token expiry:", doctor?.consentTokenExpiry);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        error:
          "This consent link is invalid or has expired. Please ask your MR to resend it.",
      });
    }

    if (doctor.consentStatus === "accepted") {
      return res.status(200).json({
        success: true,
        alreadyAccepted: true,
        message: "You have already submitted your consent. Thank you!",
      });
    }

    // Return only what the consent form page needs to display
    res.status(200).json({
      success: true,
      data: {
        doctorId: doctor._id,
        name: doctor.name,
        photo: doctor.photo,
        specialty: doctor.specialty,
        qualification: doctor.qualification,
        registrationNo: doctor.registrationNo,
        email: doctor.email,
        mobile: doctor.mobile,
        clinic: doctor.clinic,
        city: doctor.city,
        state: doctor.state,
        campaign: doctor.campaign
          ? {
              name: doctor.campaign.name,
              therapyArea: doctor.campaign.therapyArea,
            }
          : null,
        consentSentAt: doctor.consentSentAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/consent/:token/submit
// Doctor checks the box and clicks "I Accept & Submit Consent"
// Body: { accepted: true }
// ════════════════════════════════════════════════


const confirmConsent = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
 
    const doctor = await Doctor.findOne({
      confirmToken: hashedToken,
      confirmTokenExpiry: { $gt: new Date() },
    }).select("+confirmToken");
 
    if (!doctor) {
      return res.status(400).json({
        success: false,
        error: "This confirmation link is invalid or has expired.",
      });
    }
 
    if (doctor.emailConfirmed) {
      // Already confirmed — just redirect to dashboard
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:2468"}/consent/success`
      );
    }
 
    // ── Mark email as confirmed ───────────────────────────
    doctor.emailConfirmed = true;
    doctor.emailConfirmedAt = new Date();
    doctor.confirmToken = null;
    doctor.confirmTokenExpiry = null;
 
    await doctor.save();
 
    // ✅ SEND MAIL 3 — Consent Confirmed Success Email
    try {
      await sendConsentConfirmedEmail2({
        doctorName: doctor.name,
        doctorEmail: doctor.email,
        dashboardUrl: `${process.env.FRONTEND_URL || "http://localhost:2468"}/doctor/dashboard`,
      });
      console.log(`Consent success email (Mail 3) sent to ${doctor.email}`);
    } catch (emailErr) {
      console.error("Failed to send Mail 3:", emailErr);
      // Don't fail the request if email fails
    }
 
    // Redirect doctor to the success page
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/consent/success`
    );
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


const submitConsent = async (req, res) => {
  try {
    const { accepted } = req.body;
 
    if (!accepted) {
      return res.status(400).json({
        success: false,
        error: "You must accept the consent to proceed.",
      });
    }
 
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
 
    const doctor = await Doctor.findOne({
      consentToken: hashedToken,
      consentTokenExpiry: { $gt: new Date() },
    }).select("+consentToken");
 
    if (!doctor) {
      return res.status(400).json({
        success: false,
        error: "This consent link is invalid or has expired.",
      });
    }
 
    if (doctor.consentStatus === "accepted") {
      return res.status(400).json({
        success: false,
        error: "Consent already submitted.",
      });
    }
 
    // ── Record consent ────────────────────────────────────
    const ip =
      req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null;
 
    doctor.consentStatus = "accepted";
    doctor.consentGiven = true;
    doctor.consentAcceptedAt = new Date();
    doctor.consentIp = ip;
    doctor.consentToken = null;
    doctor.consentTokenExpiry = null;
    doctor.pageStatus = "published";
 
    // ── Generate a confirmToken for Mail 2 link ───────────
    const rawConfirmToken = crypto.randomBytes(32).toString("hex");
    doctor.confirmToken = crypto
      .createHash("sha256")
      .update(rawConfirmToken)
      .digest("hex");
    doctor.confirmTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    doctor.emailConfirmed = false;
 
    await doctor.save();
 
    const confirmLink = `${
      process.env.FRONTEND_URL || "http://localhost:2468"
    }/api/mr/consent/${rawConfirmToken}/confirm`;
 
    // ✅ SEND MAIL 2 — "Confirm My Consent" email
    try {
      await sendConsentConfirmedEmail({
        doctorName: doctor.name,
        doctorEmail: doctor.email,
        confirmLink,
      });
      console.log(`Mail 2 (confirm email) sent to ${doctor.email}`);
    } catch (emailErr) {
      console.error("Failed to send Mail 2:", emailErr);
    }
 
    res.status(200).json({
      success: true,
      message: "Thank you! Your consent has been recorded successfully.",
      data: {
        name: doctor.name,
        consentAcceptedAt: doctor.consentAcceptedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
 

const sendConsentConfirmedEmail = async ({ doctorName, doctorEmail, confirmLink }) => {
 const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#eef1f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef1f8;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Card -->
        <table width="520" cellpadding="0" cellspacing="0" border="0"
               style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.10);max-width:520px;">

          <!-- Header: white bg, navy logo circle + brand name -->
          <tr>
            <td style="padding:24px 32px 16px;border-bottom:1px solid #eef1f8;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="48" height="48"
                            style="width:48px;height:48px;border-radius:50%;background:#1a2e6c;text-align:center;vertical-align:middle;">
                          <span style="color:#ffffff;font-size:22px;font-weight:900;font-family:Georgia,serif;display:block;line-height:48px;">D</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="vertical-align:middle;padding-left:12px;">
                    <span style="font-size:18px;font-weight:700;color:#1a2e6c;font-family:Arial,sans-serif;">DocTalk Quiz</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px 32px;">

              <p style="font-size:15px;color:#222;margin:0 0 14px;line-height:1.7;font-family:Arial,sans-serif;">
                Dear <strong>${doctorName}</strong>,
              </p>

              <p style="font-size:15px;color:#222;margin:0 0 14px;line-height:1.7;font-family:Arial,sans-serif;">
                Thank you for submitting your consent.
              </p>

              <p style="font-size:15px;color:#222;margin:0 0 22px;line-height:1.7;font-family:Arial,sans-serif;">
                Please confirm your consent by clicking the button below.
                This helps us verify your email and complete the process.
              </p>

              <!-- Green shield info box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:10px;padding:16px 18px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align:middle;padding-right:14px;">
                          <!-- Shield with checkmark (email-safe: table circle) -->
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="36" height="36"
                                  style="width:36px;height:36px;border-radius:50%;background:#16a34a;text-align:center;vertical-align:middle;">
                                <span style="color:#ffffff;font-size:18px;font-weight:700;font-family:Arial,sans-serif;display:block;line-height:36px;">&#10003;</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="vertical-align:middle;font-size:14px;color:#15803d;line-height:1.6;font-family:Arial,sans-serif;">
                          This ensures your consent is recorded and<br/>you will receive activity reports securely.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:22px;">
                <tr>
                  <td align="center">
                    <a href="${confirmLink}"
                       style="display:block;background:#2563eb;color:#ffffff;text-decoration:none;
                              padding:15px 20px;border-radius:8px;font-size:16px;font-weight:bold;
                              text-align:center;font-family:Arial,sans-serif;letter-spacing:0.3px;">
                      Confirm My Consent
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#666;margin:0 0 10px;line-height:1.6;font-family:Arial,sans-serif;">
                This link is valid for <strong>7 days</strong>.
              </p>
              <p style="font-size:13px;color:#666;margin:0 0 20px;line-height:1.6;font-family:Arial,sans-serif;">
                If you did not request this, please ignore this email.
              </p>
              <p style="font-size:14px;color:#333;margin:0;font-family:Arial,sans-serif;">
                &ndash; DocTalk Quiz Team
              </p>

            </td>
          </tr>

        </table>
        <!-- /card -->

      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await sendEmailViaBrevo({
    to: { email: doctorEmail, name: `Dr. ${doctorName}` },
    subject: "Please confirm your consent for DocTalk Quiz",
    htmlContent: html,
    senderName: "DocTalk Quiz",
  });
};


const sendConsentConfirmedEmail2 = async ({ doctorName, doctorEmail, dashboardUrl }) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#eef1f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef1f8;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Card -->
        <table width="440" cellpadding="0" cellspacing="0" border="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);max-width:440px;">

          <!-- Top bar: logo + secure badge -->
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Logo -->
                  <td style="vertical-align:middle;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="38" height="38"
                            style="width:38px;height:38px;border-radius:50%;background:#1a2e6c;text-align:center;vertical-align:middle;">
                          <span style="color:#ffffff;font-size:18px;font-weight:900;font-family:Georgia,serif;display:block;line-height:38px;">D</span>
                        </td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="font-size:16px;font-weight:700;color:#1a2e6c;font-family:Arial,sans-serif;">DocTalk Quiz</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <!-- Secure badge -->
                  <td align="right" style="vertical-align:middle;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:20px;padding:5px 12px;">
                          <span style="font-size:12px;font-weight:700;color:#16a34a;font-family:Arial,sans-serif;">&#128274; Secure</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Success area -->
          <tr>
            <td align="center" style="padding:36px 28px 32px;">

              <!-- Green check circle -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="88" height="88"
                            style="width:88px;height:88px;border-radius:50%;background:#16a34a;text-align:center;vertical-align:middle;">
                          <span style="color:#ffffff;font-size:46px;font-weight:700;font-family:Arial,sans-serif;display:block;line-height:88px;">&#10003;</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;font-family:Arial,sans-serif;text-align:center;">
                Consent Confirmed Successfully!
              </p>

              <!-- Subtext -->
              <p style="margin:0 0 28px;font-size:14px;color:#64748b;font-family:Arial,sans-serif;text-align:center;">
                Thank you, Dr. <strong style="color:#0f172a;">${doctorName}</strong>.
              </p>

              <!-- Points box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 18px;">

                    <!-- Point 1 -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:12px;">
                      <tr>
                        <td width="22" style="vertical-align:top;padding-top:2px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="20" height="20"
                                  style="width:20px;height:20px;border-radius:50%;background:#16a34a;text-align:center;vertical-align:middle;">
                                <span style="color:#ffffff;font-size:12px;font-weight:700;font-family:Arial,sans-serif;display:block;line-height:20px;">&#10003;</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding-left:10px;font-size:13.5px;color:#374151;line-height:1.6;font-family:Arial,sans-serif;vertical-align:top;">
                          Your consent has been confirmed.
                        </td>
                      </tr>
                    </table>

                    <!-- Point 2 -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:12px;">
                      <tr>
                        <td width="22" style="vertical-align:top;padding-top:2px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="20" height="20"
                                  style="width:20px;height:20px;border-radius:50%;background:#16a34a;text-align:center;vertical-align:middle;">
                                <span style="color:#ffffff;font-size:12px;font-weight:700;font-family:Arial,sans-serif;display:block;line-height:20px;">&#10003;</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding-left:10px;font-size:13.5px;color:#374151;line-height:1.6;font-family:Arial,sans-serif;vertical-align:top;">
                          You will now receive activity updates and reports.
                        </td>
                      </tr>
                    </table>

                    <!-- Point 3 -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="22" style="vertical-align:top;padding-top:2px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="20" height="20"
                                  style="width:20px;height:20px;border-radius:50%;background:#16a34a;text-align:center;vertical-align:middle;">
                                <span style="color:#ffffff;font-size:12px;font-weight:700;font-family:Arial,sans-serif;display:block;line-height:20px;">&#10003;</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding-left:10px;font-size:13.5px;color:#374151;line-height:1.6;font-family:Arial,sans-serif;vertical-align:top;">
                          Thank you for being a part of the DocTalk Quiz activity.
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12.5px;color:#94a3b8;font-family:Arial,sans-serif;text-align:center;">
                You may now close this window.
              </p>

            </td>
          </tr>

        </table>
        <!-- /card -->

      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await sendEmailViaBrevo({
    to: { email: doctorEmail, name: `Dr. ${doctorName}` },
    subject: "✅ Consent Confirmed - Welcome to DocTalk Quiz",
    htmlContent: html,
    senderName: "DocTalk Quiz",
  });
};


const addDoctorDetails = async (req, res) => {
  try {
    const {id} = req.params;



    if(!req.files || req.files.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Minimum 4 images are required."
      })
    }

    const doctor = Doctor.findById(id)

     if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }



    const imagesFiles = req.files.map(file => ({
      fileName: file.filename,
      filePath: file.path
    }))

    

    await Doctor.findByIdAndUpdate(id, {
      $push: {
        imageFilePath: {
          $each: imagesFiles
        }
      }
    }, {
      new: true
    })

    res.status(200).json({
      success: true,
      file: req.files,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



const mrAddDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      qualification,
      registrationNo,
      email,
      mobile,
      address,
      clinic,
      city,
      state,
      campaignId,
    } = req.body;
 
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Doctor name and email are required",
      });
    }
 
    let campaignRef = null;
 
    if (campaignId) {
      campaignRef = await Campaign.findById(campaignId);
 
      if (!campaignRef) {
        return res.status(404).json({
          success: false,
          error: "Campaign not found",
        });
      }
    }
 
    const existing = await Doctor.findOne({
      email: email.toLowerCase().trim(),
      campaign: campaignRef?._id || null,
    });
 
    if (existing) {
      return res.status(409).json({
        success: false,
        error:
          "A doctor with this email already exists in this campaign",
      });
    }
 
    const slug = await uniqueSlug(toSlug(name));
 
    const doctor = await Doctor.create({
      doctorId: generateDoctorId(),
      name,
      specialty,
      qualification,
      registrationNo,
      email: email.toLowerCase().trim(),
      mobile,
      address,
      clinic,
      city,
      state,
      pageSlug: slug,
      campaign: campaignRef?._id || null,
      mr: req.mr._id,
    });
 
    if (campaignRef) {
      await Campaign.findByIdAndUpdate(campaignRef._id, {
        $addToSet: {
          doctors: doctor._id,
        },
      });
    }
 
    await Mr.findByIdAndUpdate(req.mr._id, {
      $addToSet: {
        doctors: doctor._id,
      },
    });
 
    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      data: doctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  mrLogin,
  mrLogout,
  mrMe,
  protectMr,
  sendConsentEmail,
  getMyDoctors,
  getMyDoctorById,
  addDoctor,
  updateMyDoctor,
  sendConsent,
  getAvailableCampaigns,
  getConsentPage,
  submitConsent,
  sendConsentConfirmedEmail,
  sendConsentConfirmedEmail2,
  confirmConsent,
  addDoctorDetails,
  mrAddDoctor
};
