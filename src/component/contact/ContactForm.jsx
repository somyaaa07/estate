"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
} from "lucide-react";
import { Marcellus } from "next/font/google";
import { enquiryTypes } from "@/data/contactData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/* ---------- Options ---------- */
const INTENTS = ["Buy", "Rent", "Invest"];
const PROPERTY_TYPES = [
  "Flat / Apartment",
  "Villa / House",
  "Plot / Land",
  "Commercial",
  "Other",
];
const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
const BUY_BUDGETS = [
  "Under ₹50 Lakh",
  "₹50 Lakh – ₹1 Cr",
  "₹1 Cr – ₹2 Cr",
  "₹2 Cr – ₹5 Cr",
  "Above ₹5 Cr",
];
const RENT_BUDGETS = [
  "Under ₹15,000 / month",
  "₹15,000 – ₹30,000 / month",
  "₹30,000 – ₹60,000 / month",
  "Above ₹60,000 / month",
];
const CALL_TIMES = ["Morning", "Afternoon", "Evening", "Anytime"];

const initialState = {
  name: "",
  phone: "",
  email: "",
  enquiryType: "",
  intent: "Buy",
  propertyType: "Flat / Apartment",
  bhk: "",
  budget: "",
  location: "",
  callTime: "Anytime",
  message: "",
};

const PHONE_RE = /^[0-9+\-\s]{10,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const showBhkFor = (type) => ["Flat / Apartment", "Villa / House"].includes(type);

/* ---------- Shared classes ---------- */
const fieldClass =
  "w-full rounded-xl border border-[#e8e3d3] bg-[#faf9f6] px-4 py-3.5 text-base text-[#000000] placeholder:text-[#52685B]/60 transition-all duration-300 hover:border-[#e2a10d]/60 focus:border-[#e2a10d] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ffcd39]/20 disabled:opacity-60";
// soft error look (no loud red)
const invalidClass = "!border-[#d9a49a] !bg-[#fdf6f4]";
const labelClass =
  "mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-[#52685B]";
const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

/* ---------- Chip group (radio inputs styled as pills) ---------- */
function ChipGroup({ legend, name, options, value, onChange, disabled }) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className={labelClass}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = value === opt;
          return (
            <label key={opt} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={opt}
                checked={checked}
                onChange={onChange}
                className="peer sr-only"
              />
              <span
                className={`inline-block rounded-full border px-4 py-2 text-sm transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-[#D4AF37] peer-focus-visible:ring-offset-2 ${
                  checked
                    ? `border-transparent text-[#000000] ${goldBg}`
                    : "border-[#e8e3d3] bg-[#faf9f6] text-[#000000] hover:border-[#e2a10d]/60"
                }`}
              >
                {opt}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ---------- Dark button (hero BtnDark look, full width) ---------- */
function BtnDark({ label, loading, disabled, type = "submit" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="group relative inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#000000] py-2.5 pl-7 pr-2.5 text-base font-medium text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#000000] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:ring-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {/* Golden fill */}
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      {/* Shine */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
      />
      <span className="relative z-10">{label}</span>
      {/* Arrow */}
      <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#000000] transition-all duration-500 group-hover:bg-none group-hover:bg-[#000000] group-hover:text-[#F5D77A]">
        {loading ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight
            size={16}
            className="transition-transform duration-500 group-hover:-rotate-45"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-[#b4584a]">
      {children}
    </p>
  );
}

export default function ContactForm() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState(initialState);
  const [step, setStep] = useState(1); // 1 = contact, 2 = requirements
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState({});

  const cardRef = useRef(null);
  const headingRef = useRef(null);
  const firstRender = useRef(true);

  const loading = status === "loading";
  const isRent = form.intent === "Rent";
  const showBhk = showBhkFor(form.propertyType);
  const budgetOptions = isRent ? RENT_BUDGETS : BUY_BUDGETS;

  /* ---------- Validation (step 1) ---------- */
  const errors = {
    name: form.name.trim() ? "" : "Please enter your name.",
    phone: !form.phone.trim()
      ? "Please enter your phone number."
      : !PHONE_RE.test(form.phone.trim())
      ? "Enter a valid number (10–15 digits)."
      : "",
    email:
      form.email.trim() && !EMAIL_RE.test(form.email.trim())
        ? "Enter a valid email address."
        : "",
  };
  const showErr = (k) => (touched[k] ? errors[k] : "");
  const markTouched = (e) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  /* ---------- Focus + scroll on step / success change ---------- */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    cardRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, status === "success"]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => {
      const next = { ...p, [name]: value };
      if (name === "intent" && (value === "Rent") !== (p.intent === "Rent")) {
        next.budget = "";
      }
      if (name === "propertyType" && !showBhkFor(value)) {
        next.bhk = "";
      }
      return next;
    });
  };

  /* ---------- API ---------- */
  const post = async (payload) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || "Something went wrong.");
    return data;
  };

  const buildMessage = () => {
    const lines = [
      form.message.trim() && `Message: ${form.message.trim()}`,
      `Looking to: ${form.intent}`,
      `Property type: ${form.propertyType}`,
      form.bhk && `Configuration: ${form.bhk}`,
      form.budget && `Budget: ${form.budget}`,
      form.location.trim() && `Preferred location: ${form.location.trim()}`,
      `Best time to call: ${form.callTime}`,
    ];
    return lines.filter(Boolean).join("\n");
  };

  const submit = async (payload) => {
    setStatus("loading");
    setErrorMsg("");
    try {
      await post(payload);
      setStatus("success");
      setForm(initialState);
      setTouched({});
      setStep(1);
    } catch (err) {
      setErrorMsg(err.message || "Unable to send. Please try again.");
      setStatus("error");
    }
  };

  /* ---------- Step 1: validate, then go to step 2 (nothing sent yet) ---------- */
  const handleStep1 = (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    const firstBad = ["name", "phone", "email"].find((k) => errors[k]);
    if (firstBad) {
      document.getElementById(firstBad)?.focus();
      return;
    }
    setErrorMsg("");
    setStatus("idle");
    setStep(2);
  };

  /* ---------- Step 2: send full requirements ---------- */
  const handleStep2 = (e) => {
    e.preventDefault();
    submit({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      enquiryType: form.enquiryType || "Property Enquiry",
      intent: form.intent,
      propertyType: form.propertyType,
      bhk: form.bhk,
      budget: form.budget,
      location: form.location.trim(),
      callTime: form.callTime,
      message: buildMessage(),
    });
  };

  /* ---------- Skip: send only contact details ---------- */
  const handleSkip = () =>
    submit({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      enquiryType: form.enquiryType || "General Enquiry",
      message: "Enquiry from contact page. No extra details provided.",
    });

  const stepAnim = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 16 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.35, ease: "easeOut" },
      };

  const headingClass = `${marcellus.className} text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.15] tracking-tight text-[#000000] outline-none`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      className="relative flex h-full min-w-0 scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-[#e8e3d3] bg-[#f3f0E8] p-6 sm:p-10"
      style={{ boxShadow: "0 30px 60px -35px rgba(26,42,34,0.35)" }}
    >
      {/* Top gold hairline */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 25%, #ffcd39 50%, #e2a10d 75%, rgba(226,161,13,0) 100%)",
        }}
      />

      {status === "success" ? (
        /* ================= SUCCESS ================= */
        <div
          aria-live="polite"
          className="flex flex-1 flex-col items-center justify-center py-8 text-center"
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full text-[#000000] ${goldBg}`}
          >
            <Check size={28} strokeWidth={2.5} aria-hidden="true" />
          </span>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className={`${headingClass} mt-6`}
          >
            Enquiry received
          </h3>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#52685B]">
            Thank you! Our team will get back to you shortly with options that
            match your requirements.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-7 text-sm text-[#52685B] underline underline-offset-4 transition hover:text-[#000000]"
          >
            Send another enquiry
          </button>
        </div>
      ) : (
        <>
          {/* Header: eyebrow + step counter on one line, thin progress below */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="h-px w-10"
                  style={{ background: "linear-gradient(90deg, #e2a10d, #ffcd39)" }}
                />
                <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#52685B] sm:text-xs">
                  Enquiry
                </span>
              </div>
              <span className="text-xs text-[#52685B]">Step {step} of 2</span>
            </div>

            <div className="mt-4 flex gap-1.5" aria-hidden="true">
              <span className={`h-[3px] flex-1 rounded-full ${goldBg}`} />
              <span
                className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${
                  step === 2 ? goldBg : "bg-[#000000]/10"
                }`}
              />
            </div>
          </div>

          {/* Body: vertically centred so the card never looks half-empty */}
          <div className="flex flex-1 flex-col justify-center pt-8">
            {step === 1 ? (
              /* ================= STEP 1 ================= */
              <motion.div key="step1" {...stepAnim}>
                <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                  Send us an enquiry
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#52685B]">
                  Share your contact details first. Fields marked * are required.
                </p>

                <form onSubmit={handleStep1} noValidate className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={markTouched}
                        aria-invalid={!!showErr("name")}
                        aria-describedby={showErr("name") ? "name-err" : undefined}
                        placeholder="Your full name"
                        className={`${fieldClass} ${showErr("name") ? invalidClass : ""}`}
                      />
                      {/* <FieldError id="name-err">{showErr("name")}</FieldError> */}
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={markTouched}
                        aria-invalid={!!showErr("phone")}
                        aria-describedby={showErr("phone") ? "phone-err" : undefined}
                        placeholder="+91 00000 00000"
                        className={`${fieldClass} ${showErr("phone") ? invalidClass : ""}`}
                      />
                      {/* <FieldError id="phone-err">{showErr("phone")}</FieldError> */}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address{" "}
                      <span className="normal-case tracking-normal text-[#52685B]/70">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={markTouched}
                      aria-invalid={!!showErr("email")}
                      aria-describedby={showErr("email") ? "email-err" : undefined}
                      placeholder="you@example.com"
                      className={`${fieldClass} ${showErr("email") ? invalidClass : ""}`}
                    />
                    <FieldError id="email-err">{showErr("email")}</FieldError>
                  </div>

                  <div className="pt-2">
                    <BtnDark label="Continue" />
                  </div>

                  <p className="flex items-center justify-center gap-2 text-xs text-[#52685B]">
                    <Lock size={13} aria-hidden="true" />
                    Your details stay private. We never share your number.
                  </p>
                </form>
              </motion.div>
            ) : (
              /* ================= STEP 2 ================= */
              <motion.div key="step2" {...stepAnim}>
                <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                  What are you looking for?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#52685B]">
                  We have your details. These help us prepare better options
                  before we get in touch.
                </p>

                <form onSubmit={handleStep2} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="enquiryType" className={labelClass}>
                      Enquiry Type
                    </label>
                    <select
                      id="enquiryType"
                      name="enquiryType"
                      value={form.enquiryType}
                      onChange={handleChange}
                      disabled={loading}
                      className={fieldClass}
                    >
                      <option value="">Select type</option>
                      {enquiryTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ChipGroup
                    legend="I want to"
                    name="intent"
                    options={INTENTS}
                    value={form.intent}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <ChipGroup
                    legend="Property type"
                    name="propertyType"
                    options={PROPERTY_TYPES}
                    value={form.propertyType}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  {showBhk && (
                    <ChipGroup
                      legend="Configuration"
                      name="bhk"
                      options={BHK_OPTIONS}
                      value={form.bhk}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="budget" className={labelClass}>
                        {isRent ? "Monthly Budget" : "Budget"}
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        disabled={loading}
                        className={fieldClass}
                      >
                        <option value="">Select a range</option>
                        {budgetOptions.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="location" className={labelClass}>
                        Preferred Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={form.location}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Area or city"
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <ChipGroup
                    legend="Best time to call"
                    name="callTime"
                    options={CALL_TIMES}
                    value={form.callTime}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Anything else we should know?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      maxLength={500}
                      value={form.message}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Possession timeline, parking, near a metro, loan needed..."
                      className={`${fieldClass} resize-none`}
                    />
                  </div>

                  <div className="pt-2">
                    <BtnDark
                      label={loading ? "Sending..." : "Send Enquiry"}
                      loading={loading}
                      disabled={loading}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setStatus("idle");
                        setErrorMsg("");
                      }}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 text-[#52685B] transition hover:text-[#000000] disabled:opacity-60"
                    >
                      <ArrowLeft size={14} aria-hidden="true" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSkip}
                      disabled={loading}
                      className="text-[#52685B] underline underline-offset-4 transition hover:text-[#000000] disabled:opacity-60"
                    >
                      Skip, just contact me
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Server error */}
            <div aria-live="polite" className="mt-4 empty:hidden">
              {status === "error" && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-[#e8c9c2] bg-[#fdf6f4] px-4 py-3 text-sm text-[#a2483a]"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {errorMsg}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}