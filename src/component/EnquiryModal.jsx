"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Home,
  Landmark,
  Loader2,
  Mail,
  MapPinned,
  Phone,
  User,
  X,
} from "lucide-react";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  propertyType: "",
  message: "",
};

const goldBg = "bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]";

const PROPERTY_TYPES = [
  { value: "Residential", icon: Home },
  { value: "Commercial", icon: Building2 },
  { value: "Plot", icon: MapPinned },
  { value: "Other", icon: Landmark },
];

const inputClass =
  "w-full rounded-xl border bg-[#F3F0E8]/60 py-3 pl-11 pr-4 text-[15px] text-[#1A2A22] outline-none transition placeholder:text-[#52685B]/60 hover:border-[#1A2A22]/30 focus:bg-white focus:ring-4 disabled:opacity-60";
const okBorder =
  "border-[#1A2A22]/15 focus:border-[#D4AF37] focus:ring-[#FFCD39]/30";
const badBorder = "border-red-300 focus:border-red-400 focus:ring-red-200/60";
const iconClass =
  "pointer-events-none absolute left-4 top-3.5 text-[#52685B]";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function validate(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = "Please enter your name.";
  const digits = data.phone.replace(/\D/g, "");
  if (!data.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (digits.length < 10) errors.phone = "Phone number looks too short.";
  if (data.email.trim() && !/^\S+@\S+\.\S+$/.test(data.email.trim()))
    errors.email = "Please enter a valid email address.";
  return errors;
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-red-600"
    >
      <AlertCircle size={13} aria-hidden="true" />
      {message}
    </p>
  );
}

export default function EnquiryModal({ open, onClose }) {
  const reduce = useReducedMotion();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock, Escape, focus trap, focus restore
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => firstFieldRef.current?.focus(), 80);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const nodes = dialogRef.current.querySelectorAll(FOCUSABLE);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  // Reset the success/error state after the modal has closed
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStatus("idle");
      setServerError("");
      setErrors({});
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "loading") return;

    const found = validate(formData);
    setErrors(found);
    if (Object.keys(found).length) {
      const firstBad = Object.keys(found)[0];
      dialogRef.current?.querySelector(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          enquiryType: formData.propertyType,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      setStatus("success");
    } catch (error) {
      console.error("Enquiry submission error:", error);
      setServerError(
        error.message || "Unable to submit enquiry. Please try again."
      );
      setStatus("error");
    }
  };

  const handleDone = () => {
    setFormData(initialFormData);
    onClose();
  };

  if (!mounted) return null;

  const loading = status === "loading";
  const firstName = formData.name.trim().split(" ")[0];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="enquiry-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] flex items-end justify-center bg-[#1A2A22]/70 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-title"
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[94vh] w-full max-w-lg overflow-y-auto scrollbar-hide rounded-t-3xl bg-[#FAF9F6] shadow-2xl sm:rounded-3xl"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 z-10 h-[3px] ${goldBg}`}
            />

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close enquiry form"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-[#1A2A22] transition hover:bg-[#F3F0E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {status === "success" ? (
              /* ===== Success ===== */
              <div
                role="status"
                aria-live="polite"
                className="px-6 py-14 text-center sm:px-10"
              >
                <motion.span
                  initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[#1A2A22] ${goldBg}`}
                >
                  <CheckCircle2 size={30} aria-hidden="true" />
                </motion.span>
                <h2
                  id="enquiry-title"
                  className="font-marcellus mt-6 text-3xl text-[#1A2A22]"
                >
                  {firstName ? `Thank you, ${firstName}` : "Thank you"}
                </h2>
                <span
                  aria-hidden="true"
                  className={`mx-auto mt-4 block h-[3px] w-14 rounded-full ${goldBg}`}
                />
                <p className="mx-auto mt-4 max-w-xs text-[15px] leading-relaxed text-[#52685B]">
                  Your enquiry has been submitted. Our team will get in touch
                  with you soon.
                </p>
                <button
                  type="button"
                  onClick={handleDone}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1A2A22] px-8 py-3 text-sm font-medium text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition hover:bg-[#52685B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                {/* Heading */}
                <div className="mb-6 pr-10">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8902F]">
                    Let&apos;s connect
                  </p>
                  <h2
                    id="enquiry-title"
                    className="font-marcellus text-3xl text-[#1A2A22]"
                  >
                    Make an enquiry
                  </h2>
                  <span
                    aria-hidden="true"
                    className={`mt-3 block h-[3px] w-14 rounded-full ${goldBg}`}
                  />
                  <p className="mt-3 text-sm leading-relaxed text-[#52685B]">
                    Tell us what you&apos;re looking for. Our team will get in
                    touch with you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="enquiry-name"
                      className="mb-1.5 block text-sm text-[#1A2A22]"
                    >
                      Full name <span className="text-[#B8902F]">*</span>
                    </label>
                    <div className="relative">
                      <User size={17} aria-hidden="true" className={iconClass} />
                      <input
                        ref={firstFieldRef}
                        id="enquiry-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        autoComplete="name"
                        required
                        disabled={loading}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "err-name" : undefined}
                        className={`${inputClass} ${errors.name ? badBorder : okBorder}`}
                      />
                    </div>
                    <FieldError id="err-name" message={errors.name} />
                  </div>

                  {/* Phone + Email */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="enquiry-phone"
                        className="mb-1.5 block text-sm text-[#1A2A22]"
                      >
                        Phone number <span className="text-[#B8902F]">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={17} aria-hidden="true" className={iconClass} />
                        <input
                          id="enquiry-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          autoComplete="tel"
                          inputMode="tel"
                          required
                          disabled={loading}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "err-phone" : undefined}
                          className={`${inputClass} ${errors.phone ? badBorder : okBorder}`}
                        />
                      </div>
                      <FieldError id="err-phone" message={errors.phone} />
                    </div>

                    <div>
                      <label
                        htmlFor="enquiry-email"
                        className="mb-1.5 block text-sm text-[#1A2A22]"
                      >
                        Email address{" "}
                        <span className="font-sans text-xs text-[#52685B]">
                          (optional)
                        </span>
                      </label>
                      <div className="relative">
                        <Mail size={17} aria-hidden="true" className={iconClass} />
                        <input
                          id="enquiry-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                          autoComplete="email"
                          disabled={loading}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "err-email" : undefined}
                          className={`${inputClass} ${errors.email ? badBorder : okBorder}`}
                        />
                      </div>
                      <FieldError id="err-email" message={errors.email} />
                    </div>
                  </div>

                  {/* Property type chips */}
                  <fieldset disabled={loading}>
                    <legend className="mb-2 block text-sm text-[#1A2A22]">
                      Interested in{" "}
                      <span className="font-sans text-xs text-[#52685B]">
                        (optional)
                      </span>
                    </legend>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {PROPERTY_TYPES.map(({ value, icon: Icon }) => (
                        <div key={value}>
                          <input
                            id={`enquiry-type-${value}`}
                            type="radio"
                            name="propertyType"
                            value={value}
                            checked={formData.propertyType === value}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <label
                            htmlFor={`enquiry-type-${value}`}
                            className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-[#1A2A22]/15 bg-white px-2 py-3 text-center text-[13px] text-[#52685B] transition hover:border-[#D4AF37] peer-checked:border-[#D4AF37] peer-checked:bg-[#1A2A22] peer-checked:text-[#F5D77A] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#D4AF37] peer-disabled:cursor-not-allowed peer-disabled:opacity-60"
                          >
                            <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                            {value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="enquiry-message"
                      className="mb-1.5 block text-sm text-[#1A2A22]"
                    >
                      Message{" "}
                      <span className="font-sans text-xs text-[#52685B]">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="enquiry-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      disabled={loading}
                      placeholder="Tell us about your requirements..."
                      className={`${inputClass} ${okBorder} resize-none !pl-4`}
                    />
                  </div>

                  {/* Server error */}
                  <div aria-live="polite">
                    {status === "error" && (
                      <p
                        role="alert"
                        className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700"
                      >
                        <AlertCircle
                          size={17}
                          className="mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                        {serverError}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-7 pr-2.5 text-base text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                    <span className="relative z-10">
                      {loading ? "Submitting…" : "Submit enquiry"}
                    </span>
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
                      {loading ? (
                        <Loader2
                          size={18}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-500 group-hover:-rotate-45"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}