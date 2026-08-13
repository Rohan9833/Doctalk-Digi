// src/components/Doctor/ConsentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/* ── Inline SVG icons (no external deps) ── */
const IconShield = ({ size = 20, color = "#1a2e6c" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
  </svg>
);
const IconServer = ({ size = 20, color = "#1a2e6c" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);
const IconLink = ({ size = 20, color = "#1a2e6c" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);
const IconMail = ({ size = 20, color = "#1a2e6c" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconLock = ({ size = 20, color = "#1a2e6c" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IconPhone = ({ size = 18, color = "#1a2e6c" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const IconCalendar = ({ size = 18, color = "#64748b" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconInfo = ({ size = 22, color = "#1a2e6c" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const IconCheck = ({ size = 20, color = "#fff" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconCheckCircle = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#1a9e6c" />
    <polyline
      points="7 12 10 15 17 9"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconSubmit = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Doctor avatar placeholder ── */
const DoctorAvatar = () => (
  <div
    style={{
      width: 96,
      height: 96,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#e0f2fe,#bfdbfe)",
      border: "3px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="24" r="14" fill="#93c5fd" />
      <path d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24" fill="#bfdbfe" />
      {/* stethoscope */}
      <path
        d="M26 30 c0 6 8 6 8 0"
        stroke="#1a2e6c"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 36 C30 42 38 42 38 48"
        stroke="#1a2e6c"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="38" cy="49" r="2" fill="#1a2e6c" />
    </svg>
  </div>
);

/* ── DocTalk Quiz logo ── */
const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div
      style={{
        background: "#1a2e6c",
        borderRadius: 8,
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle
          cx="13"
          cy="10"
          r="5"
          stroke="#fff"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M13 15 C13 20 19 20 19 25"
          stroke="#4ade80"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="19" cy="25" r="2" fill="#4ade80" />
        <path
          d="M10 8.5L8 6.5M16 8.5L18 6.5"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <div>
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontWeight: 900,
          fontSize: 18,
          color: "#1a2e6c",
          lineHeight: 1,
        }}
      >
        <span style={{ fontWeight: 700 }}>Quiz</span>
        Doc
        <span
          style={{
            color: "#1a9e6c",
            background: "#e6f7f1",
            borderRadius: 4,
            padding: "1px 5px",
            fontSize: 17,
          }}
        >
          Talk
        </span>{" "}
      </div>
      <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>
        by digiLATERAL
      </div>
    </div>
  </div>
);

const ConsentPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    fetchConsentData();
  }, [token]);

  const fetchConsentData = async () => {
    try {
      const response = await axios.get(`/api/mr/consent/${token}`);
      if (response.data.alreadyAccepted) {
        navigate("/consent/success");
        return;
      }
      setDoctor(response.data.data);
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError("This consent link has expired or is invalid.");
        setShowResend(true);
      } else {
        setError("Unable to load consent form. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitConsent = async () => {
    if (!agreed) {
      alert("Please accept the consent terms to proceed");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`/api/mr/consent/${token}/submit`, { accepted: true });
      navigate("/consent/success");
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          "This consent link has expired. Please request a new one below.",
        );
        setShowResend(true);
      } else {
        setError(
          err.response?.data?.error ||
            "Failed to submit consent. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendConsent = async () => {
    setResending(true);
    try {
      setResendSuccess(true);
      setTimeout(() => {
        setResendSuccess(false);
        setShowResend(false);
      }, 3000);
    } catch {
      setError("Failed to resend. Please contact your MR.");
    } finally {
      setResending(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #1a2e6c",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ color: "#64748b", fontFamily: "system-ui" }}>
            Loading consent form…
          </p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );

  if (error && !doctor)
    return (
      <div
        style={{
          maxWidth: 560,
          margin: "60px auto",
          padding: "0 16px",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: 32,
          }}
        >
          <h2 style={{ color: "#dc2626", margin: "0 0 8px", fontSize: 20 }}>
            Link Expired or Invalid
          </h2>
          <p style={{ color: "#7f1d1d", margin: "0 0 20px" }}>{error}</p>
          {showResend && (
            <div
              style={{
                borderTop: "1px solid #fecaca",
                paddingTop: 20,
                marginTop: 8,
              }}
            >
              <p style={{ fontSize: 14, color: "#7f1d1d", marginBottom: 16 }}>
                Would you like to receive a new consent link?
              </p>
              <button
                onClick={handleResendConsent}
                disabled={resending}
                style={{
                  background: "#1a2e6c",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {resending ? "Sending…" : "Resend Consent Email"}
              </button>
              {resendSuccess && (
                <p style={{ color: "#16a34a", fontSize: 13, marginTop: 10 }}>
                  ✅ New link sent!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const infoItems = [
    {
      icon: <IconShield size={22} color="#1a2e6c" />,
      label: "Purpose",
      desc: "Awareness & Education Only",
    },
    {
      icon: <IconServer size={22} color="#1a2e6c" />,
      label: "Hosting",
      desc: "Hosted on digiLATERAL Secure Server",
    },
    {
      icon: <IconLink size={22} color="#1a2e6c" />,
      label: "Access",
      desc: "Via Web Link or QR Scan",
    },
    {
      icon: <IconMail size={22} color="#1a2e6c" />,
      label: "Reports",
      desc: "Weekly analytics via email",
    },
    {
      icon: <IconLock size={22} color="#1a2e6c" />,
      label: "Privacy",
      desc: "Your data will be kept secure and confidential",
    },
  ];

  const consentPoints = [
    "My approved photo and details may be used to create an AI-generated doctor video for this activity.",
    "The activity, including my details, photo, video and related content, may be hosted on digiLATERAL's secure server.",
    "The activity may be accessed by users through a QR code or web link placed on posters, print material, WhatsApp, email or other approved digital channels.",
    "I agree to receive weekly analytics reports for this activity on my registered email ID.",
    "The activity is for education and awareness only and will not be used for personal endorsement or product claims.",
  ];

  const rights = [
    "You can withdraw your consent anytime.",
    "Your data will be used only for this activity.",
    "We do not share your data with 3rd parties.",
    "You can contact us for any assistance.",
  ];

  return (
    <div
      style={{
        background: "#f1f5f9",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .consent-grid { flex-direction: column !important; }
          .sidebar { width: 100% !important; }
          .doctor-info-grid { grid-template-columns: 1fr 1fr !important; }
          .header-top { flex-direction: column !important; gap: 12px !important; }
          .consent-main { padding: 16px !important; }
        }
      `}</style>

      <div
        style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 48px" }}
      >
        {/* ── TOP HEADER ── */}
        <div
          className="header-top"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
            marginBottom: 20,
          }}
        >
          <Logo />
          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.5px",
              }}
            >
              Doctor Consent Form
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13.5,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Please read the following information carefully and provide your
              consent for the{" "}
              <span style={{ color: "#1a2e6c", fontWeight: 600 }}>
                DocTalk Quiz
              </span>{" "}
              activity.
            </p>
          </div>
          {/* Security badge */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: "10px 14px",
              minWidth: 180,
              maxWidth: 220,
            }}
          >
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              <IconShield size={20} color="#1a2e6c" />
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#475569",
                lineHeight: 1.5,
              }}
            >
              Your data is secure and will be used only for this approved
              activity.
            </p>
          </div>
        </div>

        {/* ── DOCTOR INFO CARD ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            padding: "20px 24px",
            marginBottom: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <DoctorAvatar />
            <div style={{ flex: 1, minWidth: 260 }}>
              <div
                className="doctor-info-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "12px 20px",
                }}
              >
                {[
                  {
                    label: "Doctor Name",
                    val: doctor?.name || "Dr. Ananya Sharma",
                    bold: true,
                  },
                  {
                    label: "Specialty",
                    val: doctor?.specialty || "Cardiologist",
                  },
                  {
                    label: "Clinic / Hospital",
                    val: doctor?.clinic || "Sharma Heart Clinic",
                    bold: true,
                  },
                  {
                    label: "City",
                    val: `${doctor?.city || "Mumbai"}, ${doctor?.state || "Maharashtra"}`,
                  },
                ].map(({ label, val, bold }) => (
                  <div key={label}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        marginBottom: 3,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#0f172a",
                        fontWeight: bold ? 700 : 500,
                      }}
                    >
                      {val}
                    </div>
                  </div>
                ))}
              </div>
              {/* second row */}
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  marginTop: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <IconMail size={16} color="#64748b" />
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Email ID
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#0f172a",
                        fontWeight: 500,
                      }}
                    >
                      {doctor?.email || "ananya.sharma@clinic.com"}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <IconPhone size={16} color="#64748b" />
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Mobile Number
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#0f172a",
                        fontWeight: 500,
                      }}
                    >
                      {doctor?.mobile || "+91 98765 43210"}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <IconCalendar size={16} color="#64748b" />
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Date
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#0f172a",
                        fontWeight: 500,
                      }}
                    >
                      {today}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PURPOSE BANNER ── */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #dbeafe",
            borderRadius: 12,
            padding: "14px 18px",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ flexShrink: 0, marginTop: 1 }}>
            <IconInfo size={22} color="#1a2e6c" />
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              color: "#374151",
              lineHeight: 1.65,
            }}
          >
            <strong>Purpose:</strong> The DocTalk Quiz activity is an
            educational awareness initiative to engage patients and visitors
            through an interactive quiz experience on important health topics.
          </p>
        </div>

        {/* ── MAIN 2-COLUMN LAYOUT ── */}
        <div
          className="consent-grid"
          style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
        >
          {/* LEFT: Main consent content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Consent for DocTalk Quiz Activity */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                padding: 24,
                marginBottom: 16,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {/* <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: '#1a9e6c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontWeight: 800, color: '#fff', fontSize: 15
                }}>1</div> */}
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#1a9e6c",
                  }}
                >
                  Consent for DocTalk Quiz Activity
                </h2>
              </div>

              <p
                style={{
                  fontSize: 14,
                  color: "#374151",
                  lineHeight: 1.7,
                  margin: "0 0 20px",
                }}
              >
                I consent to digiLATERAL and its authorized client/brand team
                using my approved photograph, name, specialty, clinic/hospital
                details and other professional information to create and host a
                DocTalk Quiz activity.
              </p>

              {/* Illustration + checklist side by side */}
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                {/* Illustration */}

                {/* Checklist */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  {consentPoints.map((pt, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        marginBottom: i < consentPoints.length - 1 ? 14 : 0,
                      }}
                    >
                      <div style={{ flexShrink: 0, marginTop: 1 }}>
                        <IconCheckCircle size={20} />
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13.5,
                          color: "#374151",
                          lineHeight: 1.6,
                        }}
                      >
                        {pt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full-width consent checkbox */}
              <div
                style={{
                  marginTop: 24,
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  cursor: "pointer",
                  background: agreed ? "#f0fdf4" : "#fafafa",
                  transition: "background 0.2s",
                }}
                onClick={() => setAgreed(!agreed)}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    border: `2px solid ${agreed ? "#1a9e6c" : "#cbd5e1"}`,
                    borderRadius: 5,
                    background: agreed ? "#1a9e6c" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                    transition: "all 0.15s",
                  }}
                >
                  {agreed && <IconCheck size={14} />}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    color: "#1e293b",
                    lineHeight: 1.65,
                    fontWeight: 500,
                  }}
                >
                  I have read and understood the above and I consent to the use
                  of my details, photo, AI-generated video, hosting, access
                  through QR code/web link and receiving weekly analytics
                  reports on my registered email ID for the DocTalk Quiz
                  activity. <span style={{ color: "#dc2626" }}>*</span>
                </p>
              </div>
            </div>

            {/* Declaration */}
            {/* <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 24, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#1a2e6c' }}>Declaration</h3>
              {[
                'I confirm that all the information provided by me is correct to the best of my knowledge.',
                'I have read and understood this consent form. I am voluntarily giving my consent for the purposes mentioned above.',
              ].map((txt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i === 0 ? 10 : 0 }}>
                  <div style={{ width: 18, height: 18, background: '#1a2e6c', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <IconCheck size={11}/>
                  </div>
                  <p style={{ margin: 0, fontSize: 13.5, color: '#374151', lineHeight: 1.6 }}>{txt}</p>
                </div>
              ))}
              {!agreed && (
                <p style={{ margin: '12px 0 0', fontSize: 12.5, color: '#dc2626', fontWeight: 500 }}>
                  * Please select the consent to proceed.
                </p>
              )}
            </div> */}

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 16,
                  fontSize: 13.5,
                  color: "#dc2626",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Submit footer */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                padding: "20px 24px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                {/* Left: I Accept label */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      background: "#f0f4ff",
                      borderRadius: 10,
                      padding: 10,
                    }}
                  >
                    <IconShield size={24} color="#1a2e6c" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#0f172a",
                        fontSize: 15,
                      }}
                    >
                      I Accept
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}
                    >
                      By clicking the button, you agree to the above terms and
                      conditions.
                    </div>
                  </div>
                </div>
                {/* Right: Submit button */}
                <div>
                  <button
                    onClick={handleSubmitConsent}
                    disabled={!agreed || submitting}
                    style={{
                      background: agreed ? "#1a9e6c" : "#94a3b8",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "13px 28px",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: agreed ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "background 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <IconSubmit size={18} />
                    {submitting ? "Submitting…" : "I Accept & Submit Consent"}
                  </button>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 11.5,
                      color: "#94a3b8",
                      textAlign: "center",
                    }}
                  >
                    Your consent will be recorded with date, time and IP
                    address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="sidebar" style={{ width: 230, flexShrink: 0 }}>
            {/* Important Information */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                padding: "20px 18px",
                marginBottom: 14,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 4px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1a2e6c",
                }}
              >
                Important Information
              </h3>
              <div
                style={{
                  width: 32,
                  height: 2.5,
                  background: "#1a2e6c",
                  borderRadius: 2,
                  marginBottom: 16,
                }}
              />
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {infoItems.map(({ icon, label, desc }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        background: "#f0f4ff",
                        borderRadius: 8,
                        padding: 8,
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: 2,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                          lineHeight: 1.5,
                        }}
                      >
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Rights */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                padding: "20px 18px",
                marginBottom: 14,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1a2e6c",
                }}
              >
                Your Rights
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {rights.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        color: "#1a2e6c",
                        fontSize: 14,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      •
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12.5,
                        color: "#374151",
                        lineHeight: 1.55,
                      }}
                    >
                      {r}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                padding: "18px 18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Need Help?
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <IconMail size={15} color="#1a2e6c" />
                <span style={{ fontSize: 12.5, color: "#374151" }}>
                  info@digilateral.com
                </span>
              </div>
              {/* <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconPhone size={15} color="#1a2e6c"/>
                <span style={{ fontSize: 12.5, color: '#374151' }}>+91 98765 43210</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentPage;
