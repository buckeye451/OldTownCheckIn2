import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

// ═══════════════════════════════════════════════════════════════
//  CONFIGURATION — Update these values for your business
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  companyName: "Old Town Design",
  emailJS: {
    serviceId: "service_n5zpa0o",   // ← From EmailJS dashboard → Email Services
    checkinTemplateId: "template_4ynfska", // ← From EmailJS dashboard → Email Templates
    dropoffTemplateId: "template_bmw02qk", // ← Template for drop-offs
    publicKey: "IFx-86ajIgX8EyOuP",   // ← From EmailJS dashboard → Account → API Keys
    },
 // ── Staff directory: names shown in "I am here to see" dropdown ──
  staff: [
    { name: "Katie" },
    { name: "Sam" },
    { name: "Jordan" },
    { name: "Alex" },
  ],
  visitReasons: [
    "Scheduled Appointment",
    "Interview / Candidate",
    "Vendor / Partner Meeting",
    "Delivery / Pickup",
    "Sales Inquiry",
    "Client Meeting",
    "Tour / Site Visit",
    "Other",
  ],
  dropOffItems: [
    "Check",
    "Letter",
    "Other",
  ],
};

// ─── Theme ───
const T = {
  primary: "#1B4332",
  primaryLight: "#2D6A4F",
  primaryMid: "#40916C",
  accent: "#52B788",
  accentLight: "#74C69D",
  bg: "#F6FAF7",
  bgCard: "#EDF5F0",
  bgInput: "#F0F7F2",
  border: "#D1E4D8",
  borderFocus: "#2D6A4F",
  text: "#1B4332",
  textMid: "#3E6B54",
  textLight: "#6B9A7E",
  textMuted: "#9DBDAB",
  error: "#C0392B",
  errorBg: "#FEF2F2",
  errorBorder: "#FECACA",
  warnBg: "#FFF7ED",
  warnBorder: "#FED7AA",
  warnText: "#C2410C",
  shadow: "rgba(27, 67, 50, 0.25)",
  shadowLight: "rgba(27, 67, 50, 0.1)",
  font: "'Libre Franklin', 'Segoe UI', sans-serif",
  fontDisplay: "'Fraunces', Georgia, serif",
};

const fadeUp = (delay = 0) => ({
  opacity: 0,
  transform: "translateY(20px)",
  animation: `fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`,
});

// ═══════════════════════════════════════════════════════════════
//  WELCOME SCREEN
// ═══════════════════════════════════════════════════════════════
function WelcomeScreen({ onCheckIn, onDropOff }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100%", padding: "32px 48px", gap: 64,
    }}>
      {/* Left: logo */}
      <div style={{
        ...fadeUp(0.1),
        flex: "0 0 auto",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{
          width: 140, height: 140, borderRadius: 32,
          background: `linear-gradient(145deg, ${T.primary} 0%, ${T.primaryLight} 50%, ${T.primaryMid} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 24px 64px ${T.shadow}, 0 0 0 1px rgba(255,255,255,0.06)`,
        }}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <path d="M36 12L56 28V58H16V28L36 12Z" stroke="white" strokeWidth="2.5" fill="none" opacity="0.25" />
            <path d="M36 20L50 31V52H22V31L36 20Z" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.06)" />
            <rect x="30" y="40" width="12" height="12" rx="1" stroke="white" strokeWidth="2" opacity="0.7" />
            <line x1="36" y1="40" x2="36" y2="52" stroke="white" strokeWidth="1.5" opacity="0.5" />
            <circle cx="36" cy="32" r="4" fill="white" opacity="0.8" />
          </svg>
        </div>
        <svg width="160" height="40" viewBox="0 0 160 40" fill="none" style={{ marginTop: 20, opacity: 0.3 }}>
          <path d="M30 30C30 30 40 10 60 15C50 20 45 30 30 30Z" fill={T.accent} />
          <path d="M130 30C130 30 120 10 100 15C110 20 115 30 130 30Z" fill={T.accent} />
          <line x1="50" y1="35" x2="110" y2="35" stroke={T.accentLight} strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Right: text + buttons */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <h1 style={{
          ...fadeUp(0.2),
          fontFamily: T.fontDisplay,
          fontSize: "clamp(36px, 5vw, 56px)",
          fontWeight: 700, color: T.primary,
          margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.05,
        }}>
          {CONFIG.companyName}
        </h1>
        <p style={{
          ...fadeUp(0.35),
          fontFamily: T.font, fontSize: 18, color: T.textLight,
          margin: "0 0 44px", fontWeight: 500,
          letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          Welcome — How Can We Help?
        </p>

        {/* Button row */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <button
            onClick={onCheckIn}
            style={{
              ...fadeUp(0.5),
              fontFamily: T.font, fontSize: 20, fontWeight: 700, color: "#fff",
              background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryLight} 100%)`,
              border: "none", borderRadius: 18, padding: "24px 56px",
              cursor: "pointer", letterSpacing: "0.07em", textTransform: "uppercase",
              minHeight: 68,
              boxShadow: pulse
                ? `0 10px 44px ${T.shadow}, 0 0 0 7px rgba(45, 106, 79, 0.14)`
                : `0 10px 36px rgba(27,67,50,0.22), 0 0 0 0px rgba(45,106,79,0)`,
              transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              transform: pulse ? "scale(1.03)" : "scale(1)",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
          >
            Check In
          </button>

          <button
            onClick={onDropOff}
            style={{
              ...fadeUp(0.6),
              fontFamily: T.font, fontSize: 20, fontWeight: 700, color: T.primary,
              background: "#fff",
              border: `3px solid ${T.primary}`,
              borderRadius: 18, padding: "24px 56px",
              cursor: "pointer", letterSpacing: "0.07em", textTransform: "uppercase",
              minHeight: 68,
              boxShadow: "0 6px 24px rgba(27,67,50,0.12)",
              transition: "all 0.3s ease",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
          >
            Drop Off
          </button>
        </div>

        <p style={{
          ...fadeUp(0.75),
          fontFamily: T.font, fontSize: 14, color: T.textMuted, marginTop: 24,
        }}>
          Tap a button to begin
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  FORM COMPONENTS
// ═══════════════════════════════════════════════════════════════
function Field({ label, type = "text", value, onChange, placeholder, required, delay = 0, children }) {
  const [focused, setFocused] = useState(false);
  const baseStyle = {
    fontFamily: T.font, fontSize: 18, color: T.text,
    background: focused ? "#fff" : T.bgInput,
    border: `2px solid ${focused ? T.borderFocus : T.border}`,
    borderRadius: 14, padding: "16px 20px", minHeight: 56,
    width: "100%", boxSizing: "border-box", outline: "none",
    transition: "all 0.25s ease",
    boxShadow: focused ? `0 4px 18px ${T.shadowLight}` : "none",
    WebkitAppearance: "none",
  };

  return (
    <div style={{ ...fadeUp(delay), marginBottom: 18 }}>
      <label style={{
        display: "block", fontFamily: T.font, fontSize: 13, fontWeight: 700,
        color: T.textMid, marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase",
      }}>
        {label} {required && <span style={{ color: T.error }}>*</span>}
      </label>
      {children || (
        type === "textarea" ? (
          <textarea
            value={value} onChange={onChange} placeholder={placeholder} rows={3}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ ...baseStyle, resize: "vertical", minHeight: 90 }}
          />
        ) : (
          <input
            type={type} value={value} onChange={onChange}
            placeholder={placeholder} required={required}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={baseStyle}
          />
        )
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, required, delay, placeholder = "Select an option..." }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ ...fadeUp(delay), marginBottom: 18 }}>
      <label style={{
        display: "block", fontFamily: T.font, fontSize: 13, fontWeight: 700,
        color: T.textMid, marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase",
      }}>
        {label} {required && <span style={{ color: T.error }}>*</span>}
      </label>
      <select
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          fontFamily: T.font, fontSize: 18,
          color: value ? T.text : T.textMuted,
          background: focused ? "#fff" : T.bgInput,
          border: `2px solid ${focused ? T.borderFocus : T.border}`,
          borderRadius: 14, padding: "16px 20px", minHeight: 56,
          width: "100%", boxSizing: "border-box", outline: "none",
          cursor: "pointer", transition: "all 0.25s ease",
          boxShadow: focused ? `0 4px 18px ${T.shadowLight}` : "none",
          appearance: "none", WebkitAppearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='14' height='9' viewBox='0 0 14 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L7 7.5L13 1.5' stroke='%236B9A7E' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 20px center",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  FORM SCREEN
// ═══════════════════════════════════════════════════════════════
function FormScreen({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", address: "",
    email: "", phone: "", reason: "", hereToSee: "", comment: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const formRef = useRef(null);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = true;
    if (!form.lastName.trim()) errs.lastName = true;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = true;
    if (!form.phone.trim()) errs.phone = true;
    if (!form.reason) errs.reason = true;
    if (!form.hereToSee) errs.hereToSee = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    setSubmitError(false);

    const checkinTime = new Date().toLocaleString();

    // Template parameters — these map to {{variables}} in your EmailJS template
    const templateParams = {
      first_name: form.firstName,
      last_name: form.lastName,
      address: form.address || "Not provided",
      email: form.email,
      phone: form.phone,
      reason: form.reason,
      here_to_see: form.hereToSee,
      comments: form.comment || "None",
      checkin_time: checkinTime,
    };

    try {
      await emailjs.send(
        CONFIG.emailJS.serviceId,
        CONFIG.emailJS.checkinTemplateId,
        templateParams,
        CONFIG.emailJS.publicKey
      );

      console.log("✅ Visitor check-in sent via EmailJS:", templateParams);
      setSubmitting(false);
      onSubmit(form);
    } catch (e) {
      console.error("❌ EmailJS submission failed:", e);
      setSubmitError(true);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", maxHeight: "100%" }}>
      {/* Header */}
      <div style={{
        padding: "18px 32px", borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 12, borderRadius: 12, display: "flex",
            minWidth: 48, minHeight: 48, alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
            WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = T.bgCard}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 4L7 11L14 18" stroke={T.textMid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 700, color: T.primary, margin: 0 }}>
            Visitor Details
          </h2>
          <p style={{ fontFamily: T.font, fontSize: 14, color: T.textLight, margin: "2px 0 0" }}>
            Please fill in the required fields below
          </p>
        </div>
      </div>

      {/* Two-column form */}
      <div ref={formRef} style={{ flex: 1, overflowY: "auto", padding: "24px 40px 140px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="First Name" value={form.firstName} onChange={update("firstName")} placeholder="Jane" required delay={0.05} />
              <Field label="Last Name" value={form.lastName} onChange={update("lastName")} placeholder="Doe" required delay={0.08} />
            </div>
            <Field label="Street Address" value={form.address} onChange={update("address")} placeholder="123 Main St, Suite 200" delay={0.11} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Email Address" type="email" value={form.email} onChange={update("email")} placeholder="jane@company.com" required delay={0.14} />
              <Field label="Phone Number" type="tel" value={form.phone} onChange={update("phone")} placeholder="(317) 555-0100" required delay={0.17} />
            </div>
          </div>
          <div>
            <SelectField label="I Am Here to See" value={form.hereToSee} onChange={update("hereToSee")} options={CONFIG.staff.map(s => s.name)} required delay={0.2} placeholder="Select a person..." />
            <SelectField label="Reason for Visit" value={form.reason} onChange={update("reason")} options={CONFIG.visitReasons} required delay={0.23} placeholder="Select a reason..." />
            <Field label="Comments" type="textarea" value={form.comment} onChange={update("comment")} placeholder="Anything else we should know..." delay={0.26} />
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div style={{
            background: T.errorBg, border: `1px solid ${T.errorBorder}`, borderRadius: 14,
            padding: "14px 20px", marginTop: 8, marginBottom: 8,
            fontFamily: T.font, fontSize: 16, color: "#B91C1C",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#D94F4F" strokeWidth="1.5" />
              <path d="M10 6V10.5M10 13.5V13.51" stroke="#D94F4F" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Please complete all required fields
          </div>
        )}

        {submitError && (
          <div style={{
            background: T.warnBg, border: `1px solid ${T.warnBorder}`, borderRadius: 14,
            padding: "14px 20px", marginTop: 8, marginBottom: 8,
            fontFamily: T.font, fontSize: 16, color: T.warnText,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#EA580C" strokeWidth="1.5" />
              <path d="M10 6V10.5M10 13.5V13.51" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Submission failed. Please try again or notify the front desk.
          </div>
        )}
      </div>

      {/* Fixed submit bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "14px 40px 24px",
        background: `linear-gradient(to top, ${T.bg} 70%, transparent)`,
      }}>
        <button
          onClick={handleSubmit} disabled={submitting}
          style={{
            fontFamily: T.font, fontSize: 19, fontWeight: 700, color: "#fff",
            background: submitting
              ? `linear-gradient(135deg, ${T.textLight} 0%, ${T.textMuted} 100%)`
              : `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryLight} 100%)`,
            border: "none", borderRadius: 16, padding: "22px 40px",
            minHeight: 68, width: "100%",
            cursor: submitting ? "wait" : "pointer",
            letterSpacing: "0.05em", textTransform: "uppercase",
            boxShadow: `0 10px 36px ${T.shadow}`,
            transition: "all 0.3s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
          }}
        >
          {submitting ? (
            <>
              <span style={{
                width: 22, height: 22, border: "3px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff", borderRadius: "50%",
                animation: "spin 0.8s linear infinite", display: "inline-block",
              }} />
              Submitting...
            </>
          ) : "Submit Check-In"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONFIRMATION SCREEN
// ═══════════════════════════════════════════════════════════════
function ConfirmScreen({ visitor, onReset }) {
  const [stage, setStage] = useState(0); // 0=hidden, 1=plane flies, 2=plane lands, 3=flag pops

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);   // plane starts flying
    const t2 = setTimeout(() => setStage(2), 1400);   // plane reaches mailbox
    const t3 = setTimeout(() => setStage(3), 1900);   // flag pops up
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const t = setTimeout(onReset, 15000);
    return () => clearTimeout(t);
  }, [onReset]);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100%", padding: "32px 48px", gap: 56,
    }}>
      {/* Left: Airplane + Mailbox animation */}
      <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          ...fadeUp(0.1),
          width: 200, height: 180,
          position: "relative",
          overflow: "visible",
        }}>
          {/* Paper airplane */}
          <div style={{
            position: "absolute",
            left: stage >= 2 ? 105 : -30,
            top: stage >= 2 ? 52 : -10,
            opacity: stage >= 1 ? (stage >= 2 ? 0 : 1) : 0,
            transform: stage >= 2
              ? "rotate(25deg) scale(0.4)"
              : stage >= 1
                ? "rotate(-8deg) scale(1)"
                : "rotate(-15deg) scale(0.6)",
            transition: stage >= 2
              ? "all 0.5s cubic-bezier(0.32, 0, 0.67, 0)"
              : "all 1.0s cubic-bezier(0.22, 1, 0.36, 1)",
            zIndex: 3,
          }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <path d="M6 28L50 8L36 48L28 32L6 28Z" fill={T.accent} opacity="0.9" />
              <path d="M28 32L50 8" stroke={T.primaryLight} strokeWidth="1.5" opacity="0.5" />
              <path d="M6 28L28 32L36 48" fill={T.accentLight} opacity="0.6" />
            </svg>
          </div>

          {/* Trail particles (appear during flight) */}
          {stage >= 1 && stage < 2 && [0, 1, 2].map((i) => (
            <div key={i} style={{
              position: "absolute",
              left: 10 + i * 18,
              top: 22 - i * 3,
              width: 6 - i, height: 6 - i,
              borderRadius: "50%",
              background: T.accentLight,
              opacity: 0.4 - i * 0.12,
              animation: `trailFade 0.8s ease ${i * 0.15}s forwards`,
            }} />
          ))}

          {/* Mailbox */}
          <svg width="120" height="140" viewBox="0 0 120 140" style={{
            position: "absolute",
            right: 0, bottom: 0,
            filter: "drop-shadow(0 8px 24px rgba(27, 67, 50, 0.2))",
          }}>
            {/* Post */}
            <rect x="52" y="70" width="8" height="65" rx="3" fill={T.primaryLight} />
            {/* Base */}
            <rect x="40" y="130" width="32" height="8" rx="3" fill={T.primary} />
            {/* Mailbox body */}
            <rect x="24" y="32" width="64" height="44" rx="8" fill={T.primary}
              style={{
                transform: stage >= 2 ? "scaleY(1.03)" : "scaleY(1)",
                transformOrigin: "center bottom",
                transition: "transform 0.2s ease",
              }}
            />
            {/* Mailbox top / lid */}
            <path d="M20 40C20 28 32 20 56 20C80 20 92 28 92 40L92 44L20 44Z" fill={T.primaryLight} />
            {/* Mail slot */}
            <rect x="38" y="50" width="36" height="5" rx="2.5" fill={T.primaryMid} opacity="0.6" />
            {/* Received mail peek (appears when plane arrives) */}
            <rect x="42" y="46" width="28" height="12" rx="2" fill="white" opacity={stage >= 2 ? 0.8 : 0}
              style={{ transition: "opacity 0.3s ease 0.2s" }}
            />
            {/* Flag */}
            <g style={{
              transform: stage >= 3 ? "rotate(0deg)" : "rotate(90deg)",
              transformOrigin: "104px 58px",
              transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}>
              <rect x="92" y="36" width="4" height="28" rx="2" fill={T.textMid} />
              <path d="M96 36L114 42L96 48Z" fill="#D94F4F" />
            </g>
          </svg>

          {/* Sparkles after delivery */}
          {stage >= 3 && [
            { x: 30, y: 15, delay: 0, size: 8 },
            { x: 95, y: 8, delay: 0.1, size: 6 },
            { x: 15, y: 45, delay: 0.2, size: 5 },
            { x: 100, y: 55, delay: 0.15, size: 7 },
          ].map((s, i) => (
            <div key={i} style={{
              position: "absolute",
              left: s.x, top: s.y,
              width: s.size, height: s.size,
              borderRadius: "50%",
              background: T.accent,
              opacity: 0,
              animation: `sparkle 0.8s ease ${s.delay}s forwards`,
            }} />
          ))}
        </div>

        <p style={{
          ...fadeUp(0.8),
          fontFamily: T.font, fontSize: 13, color: T.textMuted, marginTop: 16,
          opacity: stage >= 3 ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}>
          This screen will reset automatically
        </p>
      </div>

      {/* Right: message + summary */}
      <div style={{ maxWidth: 440 }}>
        <h2 style={{
          ...fadeUp(0.3), fontFamily: T.fontDisplay,
          fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700,
          color: T.primary, margin: "0 0 10px", lineHeight: 1.15,
        }}>
          Thank You, {visitor.firstName}!
        </h2>
        <p style={{
          ...fadeUp(0.42), fontFamily: T.font,
          fontSize: 18, color: T.textLight,
          margin: "0 0 10px", lineHeight: 1.6,
        }}>
          We've recorded your visit. Someone will let {visitor.hereToSee} know you're here shortly.
        </p>
        <p style={{
          opacity: stage >= 3 ? 1 : 0,
          transition: "opacity 0.6s ease 0.2s",
          fontFamily: T.font,
          fontSize: 14, color: T.accent, fontWeight: 600,
          margin: "0 0 28px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke={T.accent} strokeWidth="1.5" />
            <path d="M6 9L8 11L12 7" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Notification delivered
        </p>

        <div style={{
          ...fadeUp(0.55), background: T.bgCard, borderRadius: 16,
          padding: "20px 24px", border: `1px solid ${T.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="14" height="14" rx="3" stroke={T.textLight} strokeWidth="1.5" />
              <path d="M4 8H12M4 5H12M4 11H8" stroke={T.textLight} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{
              fontFamily: T.font, fontSize: 12, fontWeight: 700,
              color: T.textLight, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              Visit Summary
            </span>
          </div>
          {[
            ["Here to See", visitor.hereToSee],
            ["Reason", visitor.reason],
            ["Email", visitor.email],
            ["Time", new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })],
          ].map(([k, v]) => (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: `1px solid ${T.border}`,
            }}>
              <span style={{ fontFamily: T.font, fontSize: 15, color: T.textLight }}>{k}</span>
              <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 600, color: T.primary }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  DROP OFF FORM SCREEN
// ═══════════════════════════════════════════════════════════════
function DropOffFormScreen({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", item: "", notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const formRef = useRef(null);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = true;
    if (!form.lastName.trim()) errs.lastName = true;
    if (!form.item) errs.item = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    setSubmitError(false);

    const dropoffTime = new Date().toLocaleString();

    const templateParams = {
      first_name: form.firstName,
      last_name: form.lastName,
      item: form.item,
      notes: form.notes || "None",
      dropoff_time: dropoffTime,
    };

    try {
      await emailjs.send(
        CONFIG.emailJS.serviceId,
        CONFIG.emailJS.dropoffTemplateId,
        templateParams,
        CONFIG.emailJS.publicKey
      );
      console.log("✅ Drop-off sent via EmailJS:", templateParams);
      setSubmitting(false);
      onSubmit({ ...form, dropoffTime });
    } catch (e) {
      console.error("❌ EmailJS drop-off submission failed:", e);
      setSubmitError(true);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", maxHeight: "100%" }}>
      {/* Header */}
      <div style={{
        padding: "18px 32px", borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 12, borderRadius: 12, display: "flex",
            minWidth: 48, minHeight: 48, alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
            WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = T.bgCard}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 4L7 11L14 18" stroke={T.textMid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 700, color: T.primary, margin: 0 }}>
            Drop Off Details
          </h2>
          <p style={{ fontFamily: T.font, fontSize: 14, color: T.textLight, margin: "2px 0 0" }}>
            Tell us what you're dropping off
          </p>
        </div>
      </div>

      {/* Form — centered single column for fewer fields */}
      <div ref={formRef} style={{ flex: 1, overflowY: "auto", padding: "32px 40px 140px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 560 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="First Name" value={form.firstName} onChange={update("firstName")} placeholder="Jane" required delay={0.05} />
            <Field label="Last Name" value={form.lastName} onChange={update("lastName")} placeholder="Doe" required delay={0.08} />
          </div>

          <SelectField label="Dropped Off Item" value={form.item} onChange={update("item")} options={CONFIG.dropOffItems} required delay={0.14} />

          <Field label="Notes" type="textarea" value={form.notes} onChange={update("notes")} placeholder="Any additional details (optional)..." delay={0.2} />

          {Object.keys(errors).length > 0 && (
            <div style={{
              background: T.errorBg, border: `1px solid ${T.errorBorder}`, borderRadius: 14,
              padding: "14px 20px", marginTop: 8, marginBottom: 8,
              fontFamily: T.font, fontSize: 16, color: "#B91C1C",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#D94F4F" strokeWidth="1.5" />
                <path d="M10 6V10.5M10 13.5V13.51" stroke="#D94F4F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Please complete all required fields
            </div>
          )}

          {submitError && (
            <div style={{
              background: T.warnBg, border: `1px solid ${T.warnBorder}`, borderRadius: 14,
              padding: "14px 20px", marginTop: 8, marginBottom: 8,
              fontFamily: T.font, fontSize: 16, color: T.warnText,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#EA580C" strokeWidth="1.5" />
                <path d="M10 6V10.5M10 13.5V13.51" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Submission failed. Please try again or notify the front desk.
            </div>
          )}
        </div>
      </div>

      {/* Fixed submit bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "14px 40px 24px",
        background: `linear-gradient(to top, ${T.bg} 70%, transparent)`,
      }}>
        <button
          onClick={handleSubmit} disabled={submitting}
          style={{
            fontFamily: T.font, fontSize: 19, fontWeight: 700, color: "#fff",
            background: submitting
              ? `linear-gradient(135deg, ${T.textLight} 0%, ${T.textMuted} 100%)`
              : `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryLight} 100%)`,
            border: "none", borderRadius: 16, padding: "22px 40px",
            minHeight: 68, width: "100%",
            cursor: submitting ? "wait" : "pointer",
            letterSpacing: "0.05em", textTransform: "uppercase",
            boxShadow: `0 10px 36px ${T.shadow}`,
            transition: "all 0.3s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
          }}
        >
          {submitting ? (
            <>
              <span style={{
                width: 22, height: 22, border: "3px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff", borderRadius: "50%",
                animation: "spin 0.8s linear infinite", display: "inline-block",
              }} />
              Submitting...
            </>
          ) : "Submit Drop Off"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  DROP OFF CONFIRMATION SCREEN
// ═══════════════════════════════════════════════════════════════
function DropOffConfirmScreen({ dropoff, onReset }) {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCheck(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(onReset, 15000);
    return () => clearTimeout(t);
  }, [onReset]);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100%", padding: "32px 48px", gap: 56,
    }}>
      <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          ...fadeUp(0.1),
          width: 130, height: 130, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.primaryMid} 0%, ${T.accent} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 20px 56px rgba(45, 106, 79, 0.35)",
          transform: showCheck ? "scale(1)" : "scale(0.5)",
          opacity: showCheck ? 1 : 0,
          transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          <svg width="58" height="58" viewBox="0 0 58 58" fill="none">
            <path d="M16 30L24 38L42 18" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 55, strokeDashoffset: showCheck ? 0 : 55, transition: "stroke-dashoffset 0.6s ease 0.3s" }} />
          </svg>
        </div>
        <p style={{ ...fadeUp(0.8), fontFamily: T.font, fontSize: 13, color: T.textMuted, marginTop: 32 }}>
          This screen will reset automatically
        </p>
      </div>

      <div style={{ maxWidth: 440 }}>
        <h2 style={{
          ...fadeUp(0.3), fontFamily: T.fontDisplay,
          fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700,
          color: T.primary, margin: "0 0 10px", lineHeight: 1.15,
        }}>
          Drop Off Received!
        </h2>
        <p style={{
          ...fadeUp(0.42), fontFamily: T.font,
          fontSize: 18, color: T.textLight,
          margin: "0 0 32px", lineHeight: 1.6,
        }}>
          Thank you, {dropoff.firstName}. We've logged your drop off and our team has been notified.
        </p>

        <div style={{
          ...fadeUp(0.55), background: T.bgCard, borderRadius: 16,
          padding: "20px 24px", border: `1px solid ${T.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="14" height="14" rx="3" stroke={T.textLight} strokeWidth="1.5" />
              <path d="M4 8H12M4 5H12M4 11H8" stroke={T.textLight} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{
              fontFamily: T.font, fontSize: 12, fontWeight: 700,
              color: T.textLight, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              Drop Off Summary
            </span>
          </div>
          {[
            ["From", `${dropoff.firstName} ${dropoff.lastName}`],
            ["Item", dropoff.item],
            ["Notes", dropoff.notes || "—"],
            ["Time", new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })],
          ].map(([k, v]) => (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: `1px solid ${T.border}`,
            }}>
              <span style={{ fontFamily: T.font, fontSize: 15, color: T.textLight }}>{k}</span>
              <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 600, color: T.primary, textAlign: "right", maxWidth: 260 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [visitor, setVisitor] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const navigate = (to, data) => {
    setTransitioning(true);
    setTimeout(() => {
      if (to === "confirm") setVisitor(data);
      if (to === "dropoff-confirm") setDropoff(data);
      setScreen(to);
      setTransitioning(false);
    }, 280);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;800&family=Libre+Franklin:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes trailFade {
          0% { opacity: 0.4; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.2) translateX(-20px); }
        }
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.7; transform: scale(1.3); }
          100% { opacity: 0; transform: scale(0); }
        }
        * { -webkit-tap-highlight-color: transparent; }
        html, body { overscroll-behavior: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.textMuted}; }
        select option { font-family: 'Libre Franklin', 'Segoe UI', sans-serif; font-size: 18px; }
        input, textarea, select { font-size: 18px !important; touch-action: manipulation; }
      `}</style>

      <div style={{
        width: "100%", height: "100vh", background: T.bg,
        position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        {/* Decorative background */}
        <div style={{
          position: "absolute", top: -100, right: -80, width: 360, height: 360,
          background: "radial-gradient(circle, rgba(45, 106, 79, 0.06) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60, width: 280, height: 280,
          background: "radial-gradient(circle, rgba(27, 67, 50, 0.04) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 4,
          background: `linear-gradient(90deg, ${T.primary}, ${T.accent}, ${T.primaryLight})`,
          zIndex: 10,
        }} />

        {/* Screen content */}
        <div style={{
          position: "relative", zIndex: 1, flex: 1,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.97)" : "scale(1)",
          transition: "all 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
        }}>
          {screen === "welcome" && (
            <WelcomeScreen
              onCheckIn={() => navigate("form")}
              onDropOff={() => navigate("dropoff-form")}
            />
          )}
          {screen === "form" && (
            <FormScreen onBack={() => navigate("welcome")} onSubmit={(data) => navigate("confirm", data)} />
          )}
          {screen === "confirm" && visitor && (
            <ConfirmScreen visitor={visitor} onReset={() => navigate("welcome")} />
          )}
          {screen === "dropoff-form" && (
            <DropOffFormScreen onBack={() => navigate("welcome")} onSubmit={(data) => navigate("dropoff-confirm", data)} />
          )}
          {screen === "dropoff-confirm" && dropoff && (
            <DropOffConfirmScreen dropoff={dropoff} onReset={() => navigate("welcome")} />
          )}
        </div>

        {/* Bottom brand */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          textAlign: "center", padding: 10, pointerEvents: "none", zIndex: 0,
        }}>
          <span style={{
            fontFamily: T.font, fontSize: 11, color: T.textMuted,
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            Powered by {CONFIG.companyName}
          </span>
        </div>
      </div>
    </>
  );
}


