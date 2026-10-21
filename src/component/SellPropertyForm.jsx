"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Marcellus } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  BadgeCheck,
  Check,
  CheckCircle2,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  Sparkles,
  ImageIcon,
  User,
  X,
  Zap,
} from "lucide-react";
import ImageUpload from "@/component/ImageUploads";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  title: "",
  description: "",
  price: "",
  property_type: "apartment",
  location: "",
  city: "",
  area: "",
  nearby_landmarks: [],
  bedrooms: "",
  bathrooms: "",
  balcony: "",
  total_floors: "",
  age_of_property: "",
  furnishing: "",
  transaction_type: "",
  parking: "",
  facing: "",
  construction_type: "",
  property_highlights: [],
  amenities: [],
  images: [],
  website: "", // honeypot – must stay empty
};

/* ───────────── helpers ───────────── */
const inr = (n) => {
  const v = Number(n);
  if (!v) return "";
  if (v >= 1e7) return `₹${+(v / 1e7).toFixed(2)} Crore`;
  if (v >= 1e5) return `₹${+(v / 1e5).toFixed(2)} Lakh`;
  return `₹${v.toLocaleString("en-IN")}`;
};

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-[#000000] placeholder:text-[#52685B]/50 outline-none transition focus:border-[#000000] focus:ring-4 focus:ring-[#D4AF37]/25";

/* ───────────── HERO ───────────── */
const perks = [
  { icon: BadgeCheck, label: "Free to list" },
  { icon: Zap, label: "Quick callback" },
  { icon: ShieldCheck, label: "No spam, no cap" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

function SellHero() {
  return (
    <section
      className={`${marcellus.className} relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#000000] px-4 pb-24 pt-10 text-[#FAF9F6] sm:px-6 sm:pb-28 sm:pt-12 lg:px-8`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#52685B]/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#FAF9F6 1px, transparent 1px), linear-gradient(90deg, #FAF9F6 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl text-center">
        <motion.span
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 rounded-full bg-[#FAF9F6]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-[#F5D77A] ring-1 ring-[#D4AF37]/40 backdrop-blur"
        >
          <Sparkles size={13} /> Sell with Bringo
        </motion.span>

        <motion.h1
          {...fadeUp(0.1)}
          className="mt-4 text-3xl leading-[1.1] sm:text-4xl lg:text-5xl"
        >
          Wanna Sell Your Property?
          <br />
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] bg-clip-text text-transparent">
            Let&rsquo;s Make It Happen.
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#FAF9F6]/75 sm:text-base"
        >
          No broker drama, no cap. Drop your deets below and we&rsquo;ll bring
          serious buyers straight to your door.
        </motion.p>

       
      </div>
    </section>
  );
}

/* ───────────── UI pieces ───────────── */
function Item({ label, required, hint, error, span, children, htmlFor }) {
  return (
    <div
      className={span ? "sm:col-span-2" : ""}
      data-error={error ? "true" : undefined}
    >
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-baseline justify-between gap-2 text-[13px] text-[#000000]"
      >
        <span>
          {label}
          {required && (
            <span className="ml-1 text-[#9C3B2B]" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {hint && <span className="text-[11px] text-[#52685B]">{hint}</span>}
      </label>
      {children}
      {error && (
        <p
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs text-[#9C3B2B]"
        >
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

function Field({ as: Tag = "input", error, className = "", ...props }) {
  const id = useId();
  return (
    <Tag
      id={props.id || id}
      aria-invalid={!!error}
      {...props}
      className={`${inputBase} ${error ? "border-[#9C3B2B]" : "border-[#52685B]/25"} ${
        Tag === "textarea" ? "min-h-[120px] resize-y leading-relaxed" : ""
      } ${Tag === "select" ? "cursor-pointer" : ""} ${className}`}
    />
  );
}

function Segmented({ value, onChange, options, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-5 py-2.5 text-sm ring-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
              on
                ? "bg-[#000000] text-[#FAF9F6] ring-[#D4AF37]/50"
                : "bg-white text-[#52685B] ring-[#52685B]/25 hover:ring-[#000000]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Stepper({ value, onChange, max = 20 }) {
  const n = value === "" ? 0 : Number(value);
  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F0E8] text-[#000000] transition hover:bg-[#000000] hover:text-[#FAF9F6] disabled:opacity-40 disabled:hover:bg-[#F3F0E8] disabled:hover:text-[#000000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]";
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#52685B]/25 bg-white px-3 py-1.5">
      <button
        type="button"
        aria-label="Decrease"
        disabled={n <= 0}
        onClick={() => onChange(n - 1 <= 0 ? "0" : String(n - 1))}
        className={btn}
      >
        <Minus size={15} />
      </button>
      <span className="text-lg tabular-nums">{value === "" ? "–" : n}</span>
      <button
        type="button"
        aria-label="Increase"
        disabled={n >= max}
        onClick={() => onChange(String(n + 1))}
        className={btn}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function TagInput({ value = [], onChange, suggestions = [], placeholder }) {
  const [text, setText] = useState("");
  const has = (t) => value.some((v) => v.toLowerCase() === t.toLowerCase());
  const add = (t) => {
    const c = t.trim();
    if (c && !has(c)) onChange([...value, c]);
  };
  const remove = (t) =>
    onChange(value.filter((v) => v.toLowerCase() !== t.toLowerCase()));
  const toggle = (t) => (has(t) ? remove(t) : add(t));
  const commit = () => {
    const parts = text
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const next = [...value];
    parts.forEach((p) => {
      if (!next.some((v) => v.toLowerCase() === p.toLowerCase())) next.push(p);
    });
    onChange(next);
    setText("");
  };
  const custom = value.filter(
    (v) => !suggestions.some((s) => s.toLowerCase() === v.toLowerCase()),
  );
  const chip = (on) =>
    `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] ring-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
      on
        ? "bg-[#000000] text-[#FAF9F6] ring-[#000000]"
        : "bg-white text-[#52685B] ring-[#52685B]/25 hover:ring-[#000000]"
    }`;

  return (
    <div>
      {suggestions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={has(s)}
              onClick={() => toggle(s)}
              className={chip(has(s))}
            >
              {has(s) ? <Check size={13} /> : <Plus size={13} />} {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Field
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
          }}
        />
        <button
          type="button"
          onClick={commit}
          disabled={!text.trim()}
          className="shrink-0 rounded-xl bg-[#000000] px-5 text-sm text-[#FAF9F6] transition hover:bg-[#52685B] disabled:opacity-40"
        >
          Add
        </button>
      </div>
      {custom.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {custom.map((v) => (
            <span key={v} className={chip(true)}>
              {v}
              <button
                type="button"
                aria-label={`Remove ${v}`}
                onClick={() => remove(v)}
                className="rounded-full hover:text-[#F5D77A]"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ id, icon: Icon, title, subtitle, children }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="scroll-mt-6 rounded-3xl bg-[#FAF9F6] p-6 shadow-[0_10px_40px_rgba(26,42,34,0.07)] ring-1 ring-[#52685B]/15 sm:p-8"
    >
      <div className="mb-6 flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3F0E8]">
          <Icon className="text-[#D4A62A]" size={20} strokeWidth={1.5} />
        </span>
        <div>
          <h2 className="text-2xl leading-tight">{title}</h2>
          <p className="mt-1 text-sm text-[#52685B]">{subtitle}</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </motion.section>
  );
}

/* ───────────── FORM BODY ───────────── */
function SellFormBody() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [opts, setOpts] = useState(null);
  const [errors, setErrors] = useState({});
  const [optsError, setOptsError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const baseline = useRef(JSON.stringify(EMPTY_FORM));

  useEffect(() => {
    fetch("/api/properties/options")
      .then((r) => r.json())
      .then(setOpts)
      .catch(() =>
        setOptsError("Could not load dropdown options. Refresh the page."),
      );
  }, []);

  const dirty = JSON.stringify(form) !== baseline.current;
  useEffect(() => {
    if (!dirty || loading || success) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, loading, success]);

  const set = (key) => (e) => update(key, e.target.value);
  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  /* required-field checks */
  const checks = useMemo(
    () => ({
      name: !!form.name.trim(),
      phone: form.phone.replace(/\D/g, "").length >= 10,
      email: /^\S+@\S+\.\S+$/.test(form.email.trim()),
      title: !!form.title.trim(),
      price: Number(form.price) > 0,
      location: !!form.location.trim(),
      city: !!form.city.trim(),
      images: form.images.length > 0,
    }),
    [form],
  );
  const doneCount = Object.values(checks).filter(Boolean).length;
  const totalReq = Object.keys(checks).length;

  const handleSubmit = async () => {
    const msgs = {
      name: "Enter your full name.",
      phone: "Enter a valid phone number.",
      email: "Enter a valid email address.",
      title: "Give the property a title.",
      price: "Enter a price greater than 0.",
      location: "Add the full address.",
      city: "Add the city.",
      images: "Upload at least one photo.",
    };
    const next = {};
    Object.keys(checks).forEach((k) => {
      if (!checks[k]) next[k] = msgs[k];
    });
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        document
          .querySelector('[data-error="true"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return;
    }

    setSubmitError("");
    setLoading(true);
    try {
      const res = await fetch("/api/sell-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSuccess(true);
        setForm(EMPTY_FORM);
        baseline.current = JSON.stringify(EMPTY_FORM);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setSubmitError("Network error. Check your connection and try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setLoading(false);
  };

  const select = (k, options, placeholder = "Select") => (
    <Field as="select" value={form[k]} onChange={set(k)} disabled={!opts}>
      {placeholder && (
        <option value="">{opts ? placeholder : "Loading…"}</option>
      )}
      {(options || []).map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Field>
  );

  const shownError = submitError || optsError;
  const descMax = 1000;

  /* Success screen */
  if (success) {
    return (
      <div
        className={`${marcellus.variable} font-[family-name:var(--font-marcellus)] font-normal text-[#000000]`}
      >
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-xl rounded-3xl bg-[#FAF9F6] p-8 text-center shadow-[0_10px_40px_rgba(26,42,34,0.07)] ring-1 ring-[#52685B]/15 sm:p-12"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F0E8]">
            <CheckCircle2
              className="text-[#D4A62A]"
              size={28}
              strokeWidth={1.5}
            />
          </span>
          <h2 className="mt-5 text-3xl leading-tight">Thank you!</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#52685B]">
            Your property details have been submitted. Our team will review them
            and contact you shortly.
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-8 rounded-full bg-[#000000] px-7 py-2.5 text-sm text-[#FAF9F6] transition hover:bg-[#52685B]"
          >
            Submit another property
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`${marcellus.variable} font-[family-name:var(--font-marcellus)] font-normal text-[#000000]`}
    >
      <AnimatePresence>
        {shownError && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-start gap-3 rounded-2xl border-l-4 border-[#9C3B2B] bg-[#F6E3DF] px-5 py-4 text-sm text-[#9C3B2B]"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" /> {shownError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={set("website")}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="space-y-6">
        {/* CONTACT */}
        <Section
          id="contact"
          icon={User}
          title="Your Contact Details"
          subtitle="So our team can reach you."
        >
          <Item required label="Full name" error={errors.name}>
            <Field
              placeholder="Your name"
              value={form.name}
              onChange={set("name")}
              error={errors.name}
              autoComplete="name"
            />
          </Item>
          <Item required label="Phone" error={errors.phone}>
            <Field
              type="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={set("phone")}
              error={errors.phone}
              autoComplete="tel"
            />
          </Item>
          <Item span required label="Email" error={errors.email}>
            <Field
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              autoComplete="email"
            />
          </Item>
        </Section>

        {/* BASICS */}
        <Section
          id="basic"
          icon={Sparkles}
          title="Basic Information"
          subtitle="What buyers see first."
        >
          <Item span required label="Property title" error={errors.title}>
            <Field
              placeholder="e.g. 3 BHK apartment in Kaveri City Center"
              value={form.title}
              onChange={set("title")}
              error={errors.title}
            />
          </Item>
          <Item
            span
            label="Description"
            hint={`${form.description.length}/${descMax}`}
          >
            <Field
              as="textarea"
              maxLength={descMax}
              placeholder="Describe the layout, surroundings and what makes this property special."
              value={form.description}
              onChange={set("description")}
            />
          </Item>
          <Item
            span
            required
            label="Expected price (₹)"
            error={errors.price}
            hint={inr(form.price)}
          >
            <Field
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="5000000"
              value={form.price}
              onChange={set("price")}
              error={errors.price}
            />
          </Item>
          <Item span label="Property type">
            <Segmented
              label="Property type"
              value={form.property_type}
              onChange={(v) => update("property_type", v)}
              options={[
                { value: "apartment", label: "Apartment" },
                { value: "house", label: "House" },
                { value: "villa", label: "Villa" },
                { value: "plot", label: "Plot" },
                { value: "commercial", label: "Commercial" },
              ]}
            />
          </Item>
        </Section>

        {/* LOCATION */}
        <Section
          id="location"
          icon={MapPin}
          title="Location"
          subtitle="Help buyers find the exact spot."
        >
          <Item span required label="Full address" error={errors.location}>
            <Field
              placeholder="Tower B, Sector 4, Greater Noida West"
              value={form.location}
              onChange={set("location")}
              error={errors.location}
            />
          </Item>
          <Item required label="City" error={errors.city}>
            <Field
              placeholder="Greater Noida"
              value={form.city}
              onChange={set("city")}
              error={errors.city}
            />
          </Item>
          <Item label="Area" hint="sq ft">
            <Field
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="1200"
              value={form.area}
              onChange={set("area")}
            />
          </Item>
          <Item
            span
            label="Nearby landmarks"
            hint="Press Enter or comma to add"
          >
            <TagInput
              value={form.nearby_landmarks}
              onChange={(a) => update("nearby_landmarks", a)}
              suggestions={opts?.landmarks_suggestions}
              placeholder="e.g. Metro station, 500 m"
            />
          </Item>
        </Section>

        {/* SPECS */}
        <Section
          id="specs"
          icon={Ruler}
          title="Property Details"
          subtitle="Optional, but listings with details get more enquiries."
        >
          <Item label="Bedrooms">
            <Stepper
              value={form.bedrooms}
              onChange={(v) => update("bedrooms", v)}
            />
          </Item>
          <Item label="Bathrooms">
            <Stepper
              value={form.bathrooms}
              onChange={(v) => update("bathrooms", v)}
            />
          </Item>
          <Item label="Balconies">
            <Stepper
              value={form.balcony}
              onChange={(v) => update("balcony", v)}
            />
          </Item>
          <Item label="Total floors">
            <Stepper
              value={form.total_floors}
              onChange={(v) => update("total_floors", v)}
              max={200}
            />
          </Item>
          <Item label="Age of property">
            {select("age_of_property", opts?.age_of_property)}
          </Item>
          <Item label="Furnishing">
            {select("furnishing", opts?.furnishing)}
          </Item>
          <Item label="Transaction type">
            {select("transaction_type", opts?.transaction_type)}
          </Item>
          <Item label="Parking">{select("parking", opts?.parking)}</Item>
          <Item label="Facing">{select("facing", opts?.facing)}</Item>
          <Item label="Construction type">
            {select("construction_type", opts?.construction_type)}
          </Item>
        </Section>

        {/* PHOTOS */}
        <Section
          id="photos"
          icon={ImageIcon}
          title="Photos"
          subtitle="The first photo becomes the cover image."
        >
          <div
            className="sm:col-span-2"
            data-error={errors.images ? "true" : undefined}
          >
            <ImageUpload
              value={form.images}
              onChange={(urls) => update("images", urls)}
            />
            {errors.images && (
              <p
                role="alert"
                className="mt-2 flex items-center gap-1.5 text-xs text-[#9C3B2B]"
              >
                <AlertCircle size={13} /> {errors.images}
              </p>
            )}
          </div>
        </Section>

        {/* Sticky action bar */}
        <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl bg-[#000000]/95 p-3 pl-5 text-[#FAF9F6] shadow-[0_20px_50px_rgba(26,42,34,0.35)] ring-1 ring-[#D4AF37]/30 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[#FAF9F6]/80">
              {doneCount === totalReq
                ? "All required fields done"
                : `${doneCount} of ${totalReq} required fields done`}
            </p>
            <div className="mt-2 h-1 w-full max-w-xs overflow-hidden rounded-full bg-[#FAF9F6]/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] transition-all duration-500"
                style={{ width: `${(doneCount / totalReq) * 100}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] px-7 py-2.5 text-sm text-[#000000] transition hover:shadow-[0_8px_24px_rgba(212,175,55,0.45)] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D77A]"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Submitting…" : "Submit Property"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────── PAGE LAYOUT: hero + form ───────────── */
export default function SellPropertyForm() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#F3F0E8]">
      <SellHero />
      <div className="relative z-10 mx-auto -mt-20 max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <SellFormBody />
      </div>
    </div>
  );
}