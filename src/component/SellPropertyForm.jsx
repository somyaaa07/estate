"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Marcellus, DM_Sans } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Building2, Check, CheckCircle2, ChevronDown, Circle, Clock, Home,
  ImageIcon, Landmark, LandPlot, Loader2, MapPin, Minus, PhoneCall, Plus, Ruler,
  ShieldCheck, Store, User, X,
} from "lucide-react";
import ImageUpload from "@/component/ImageUploads";

const display = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const EMPTY_FORM = {
  name: "", phone: "", email: "", title: "", description: "", price: "",
  property_type: "apartment", location: "", city: "", area: "",
  nearby_landmarks: [], bedrooms: "", bathrooms: "", balcony: "", total_floors: "",
  age_of_property: "", furnishing: "", transaction_type: "", parking: "", facing: "",
  construction_type: "", property_highlights: [], amenities: [], images: [],
  website: "", // honeypot – must stay empty
};

const inr = (n) => {
  const v = Number(n);
  if (!v) return "";
  if (v >= 1e7) return `₹${+(v / 1e7).toFixed(2)} Crore`;
  if (v >= 1e5) return `₹${+(v / 1e5).toFixed(2)} Lakh`;
  return `₹${v.toLocaleString("en-IN")}`;
};

const TYPES = [
  { value: "apartment", label: "Apartment", icon: Building2 },
  { value: "house", label: "House", icon: Home },
  { value: "villa", label: "Villa", icon: Landmark },
  { value: "plot", label: "Plot", icon: LandPlot },
  { value: "commercial", label: "Commercial", icon: Store },
];

const REQUIRED = [
  { key: "name", label: "Your name", sec: "contact", msg: "Enter your full name." },
  { key: "phone", label: "Phone number", sec: "contact", msg: "Enter a valid 10-digit phone number." },
  { key: "email", label: "Email", sec: "contact", msg: "Enter a valid email address." },
  { key: "title", label: "Property title", sec: "basic", msg: "Give the property a title." },
  { key: "price", label: "Expected price", sec: "basic", msg: "Enter a price greater than 0." },
  { key: "location", label: "Full address", sec: "location", msg: "Add the full address." },
  { key: "city", label: "City", sec: "location", msg: "Add the city." },
  { key: "images", label: "At least one photo", sec: "photos", msg: "Upload at least one photo." },
];

/* Shared input look: tall, soft, clear focus */
const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-[#14231B] placeholder:text-[#52685B]/50 outline-none transition-[border-color,box-shadow] duration-150 hover:border-[#52685B]/50 focus:border-[#1A2A22] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.22)] disabled:cursor-wait disabled:bg-[#F6F3EC] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]";

/* ───────────── UI pieces ───────────── */
function Item({ label, required, hint, error, span, children, htmlFor }) {
  return (
    <div className={span ? "col-span-full" : ""} data-error={error ? "true" : undefined}>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between gap-2 text-[13.5px] font-medium text-[#14231B]">
        <span>
          {label}
          {required && <span className="ml-0.5 text-[#9C3B2B]" aria-hidden="true">*</span>}
        </span>
        {hint && <span className="text-xs font-normal text-[#52685B]">{hint}</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#9C3B2B]">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

function Field({ as: Tag = "input", error, className = "", prefix, suffix, ...props }) {
  const id = useId();
  const isSelect = Tag === "select";
  const el = (
    <Tag
      id={props.id || id}
      aria-invalid={!!error}
      {...props}
      className={`${inputBase} ${error ? "border-[#9C3B2B] bg-[#FDF5F3]" : "border-[#52685B]/25"} ${
        Tag === "textarea" ? "min-h-[130px] resize-y leading-relaxed" : ""
      } ${isSelect ? "cursor-pointer appearance-none pr-10" : ""} ${prefix ? "pl-11" : ""} ${suffix ? "pr-14" : ""} ${className}`}
    />
  );
  if (!prefix && !suffix && !isSelect) return el;
  return (
    <div className="relative">
      {prefix && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-[15px] text-[#52685B]">
          {prefix}
        </span>
      )}
      {el}
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-[#52685B]">{suffix}</span>
      )}
      {isSelect && <ChevronDown size={17} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#52685B]" />}
    </div>
  );
}

function TypeTiles({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Property type" className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {TYPES.map(({ value: v, label, icon: Icon }) => {
        const on = value === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(v)}
            className={`relative flex flex-col items-center gap-2.5 rounded-2xl border px-2 py-5 text-sm transition ${focusRing} ${
              on
                ? "border-[#1A2A22] bg-[#1A2A22] text-[#FAF9F6] shadow-[0_8px_20px_-8px_rgba(26,42,34,0.55)]"
                : "border-[#52685B]/20 bg-white text-[#52685B] hover:border-[#1A2A22]/60 hover:text-[#1A2A22]"
            }`}
          >
            {on && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37]">
                <Check size={10} strokeWidth={3} className="text-[#1A2A22]" />
              </span>
            )}
            <Icon size={24} strokeWidth={1.4} className={on ? "text-[#F5D77A]" : ""} />
            <span className={on ? "font-medium" : ""}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Stepper({ value, onChange, max = 20 }) {
  const n = value === "" ? 0 : Number(value);
  const btn = `flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EDE3] text-[#14231B] transition hover:bg-[#1A2A22] hover:text-[#FAF9F6] active:scale-95 disabled:opacity-30 disabled:hover:bg-[#F1EDE3] disabled:hover:text-[#14231B] ${focusRing}`;
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#52685B]/25 bg-white px-2 py-1.5 transition hover:border-[#52685B]/50">
      <button type="button" aria-label="Decrease" disabled={n <= 0} onClick={() => onChange(n - 1 <= 0 ? "0" : String(n - 1))} className={btn}>
        <Minus size={16} />
      </button>
      <span className={`text-lg font-medium tabular-nums ${value === "" ? "text-[#52685B]/50" : ""}`}>{value === "" ? "–" : n}</span>
      <button type="button" aria-label="Increase" disabled={n >= max} onClick={() => onChange(String(n + 1))} className={btn}>
        <Plus size={16} />
      </button>
    </div>
  );
}

function TagInput({ value = [], onChange, suggestions = [], placeholder }) {
  const [text, setText] = useState("");
  const has = (t) => value.some((v) => v.toLowerCase() === t.toLowerCase());
  const add = (t) => { const c = t.trim(); if (c && !has(c)) onChange([...value, c]); };
  const remove = (t) => onChange(value.filter((v) => v.toLowerCase() !== t.toLowerCase()));
  const toggle = (t) => (has(t) ? remove(t) : add(t));
  const commit = () => {
    const next = [...value];
    text.split(",").map((t) => t.trim()).filter(Boolean).forEach((p) => {
      if (!next.some((v) => v.toLowerCase() === p.toLowerCase())) next.push(p);
    });
    onChange(next);
    setText("");
  };
  const custom = value.filter((v) => !suggestions.some((s) => s.toLowerCase() === v.toLowerCase()));
  const chip = (on) =>
    `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] ring-1 transition ${focusRing} ${
      on ? "bg-[#1A2A22] text-[#FAF9F6] ring-[#1A2A22]" : "bg-white text-[#52685B] ring-[#52685B]/25 hover:text-[#1A2A22] hover:ring-[#1A2A22]/60"
    }`;
  return (
    <div>
      {suggestions.length > 0 && (
        <div className="mb-3.5 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} type="button" aria-pressed={has(s)} onClick={() => toggle(s)} className={chip(has(s))}>
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
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); } }}
        />
        <button type="button" onClick={commit} disabled={!text.trim()} className={`shrink-0 rounded-xl bg-[#1A2A22] px-6 text-sm font-medium text-[#FAF9F6] transition hover:bg-[#2C4337] disabled:opacity-35 ${focusRing}`}>
          Add
        </button>
      </div>
      {custom.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-2">
          {custom.map((v) => (
            <span key={v} className={chip(true)}>
              {v}
              <button type="button" aria-label={`Remove ${v}`} onClick={() => remove(v)} className="rounded-full hover:text-[#F5D77A]">
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* Each section is its own card so the long form feels like short steps */
function Section({ id, icon: Icon, title, subtitle, dense, children }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(20,35,27,0.05),0_12px_32px_-16px_rgba(20,35,27,0.18)] ring-1 ring-[#1A2A22]/[0.07] sm:p-8">
      <div className="mb-7 flex items-center gap-4 border-b border-[#1A2A22]/10 pb-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1A2A22] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.35)]">
          <Icon className="text-[#F5D77A]" size={20} strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-display)] text-[1.65rem] leading-tight">{title}</h2>
          <p className="mt-0.5 text-sm text-[#52685B]">{subtitle}</p>
        </div>
      </div>
      <div className={`grid gap-x-5 gap-y-6 ${dense ? "grid-cols-2" : "sm:grid-cols-2"}`}>{children}</div>
    </section>
  );
}

/* Live preview of how the listing will look */
function Preview({ form }) {
  const specs = [
    form.bedrooms && Number(form.bedrooms) > 0 && `${form.bedrooms} bed`,
    form.bathrooms && Number(form.bathrooms) > 0 && `${form.bathrooms} bath`,
    form.area && `${form.area} sq ft`,
  ].filter(Boolean);
  const cover = form.images[0];
  const src = typeof cover === "string" ? cover : cover?.url;
  const typeLabel = TYPES.find((t) => t.value === form.property_type)?.label;
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_40px_-20px_rgba(20,35,27,0.45)] ring-1 ring-[#1A2A22]/10">
      <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#EFEADD] to-[#E4DDCB] text-[#52685B]/55">
        {src ? <img src={src} alt="Cover" className="h-full w-full object-cover" /> : (
          <div className="flex flex-col items-center gap-1.5 text-xs">
            <ImageIcon size={28} strokeWidth={1.25} /> Cover photo
          </div>
        )}
        {typeLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-[#1A2A22]/90 px-3 py-1 text-xs text-[#FAF9F6] backdrop-blur">{typeLabel}</span>
        )}
        {form.images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs text-[#14231B]">{form.images.length} photos</span>
        )}
      </div>
      <div className="space-y-1.5 p-5">
        <p className={`font-[family-name:var(--font-display)] text-2xl ${form.price ? "text-[#14231B]" : "text-[#52685B]/50"}`}>
          {inr(form.price) || "₹ Price"}
        </p>
        <p className={`line-clamp-2 text-[15px] leading-snug ${form.title ? "text-[#14231B]" : "text-[#52685B]/50"}`}>
          {form.title || "Your property title"}
        </p>
        {(form.city || specs.length > 0) && (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-[#52685B]">
            {form.city && <span className="inline-flex items-center gap-1"><MapPin size={12} /> {form.city}</span>}
            {specs.map((s) => <span key={s}>{s}</span>)}
          </p>
        )}
      </div>
    </div>
  );
}

function ProgressRing({ done, total }) {
  const r = 15, c = 2 * Math.PI * r;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="-rotate-90">
      <circle cx="20" cy="20" r={r} fill="none" stroke="#1A2A22" strokeOpacity="0.1" strokeWidth="3.5" />
      <circle cx="20" cy="20" r={r} fill="none" stroke="#D4AF37" strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - done / total)} style={{ transition: "stroke-dashoffset .5s ease" }} />
    </svg>
  );
}

/* ───────────── PAGE ───────────── */
export default function SellPropertyForm() {
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
      .catch(() => setOptsError("Could not load dropdown options. Refresh the page."));
  }, []);

  const dirty = JSON.stringify(form) !== baseline.current;
  useEffect(() => {
    if (!dirty || loading || success) return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, loading, success]);

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };
  const set = (key) => (e) => update(key, e.target.value);

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
  const totalReq = REQUIRED.length;
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSubmit = async () => {
    const next = {};
    REQUIRED.forEach((r) => { if (!checks[r.key]) next[r.key] = r.msg; });
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" }),
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
      } else {
        setSubmitError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Check your connection and try again.");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(false);
  };

  const select = (k, options) => (
    <Field as="select" value={form[k]} onChange={set(k)} disabled={!opts}>
      <option value="">{opts ? "Select" : "Loading…"}</option>
      {(options || []).map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </Field>
  );

  const shownError = submitError || optsError;
  const descMax = 1000;
  const submitBtn = (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={loading}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-7 py-3.5 text-sm font-semibold text-[#14231B] shadow-[0_8px_20px_-8px_rgba(212,175,55,0.8)] transition hover:bg-[#E3C255] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 ${focusRing}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {loading ? "Sending…" : "Send my property"}
    </button>
  );

  return (
    <div className={`${display.variable} ${body.variable} min-h-screen overflow-x-clip bg-[#F6F3EC] font-[family-name:var(--font-body)] text-[#14231B] antialiased`}>
      {/* Hero */}
      <header className="relative overflow-hidden bg-[#14231B] px-4 pb-16 pt-14 text-[#FAF9F6] sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(250,249,246,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(250,249,246,.05) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
            WebkitMaskImage: "radial-gradient(ellipse 80% 100% at 80% 0%, #000 20%, transparent 75%)",
            maskImage: "radial-gradient(ellipse 80% 100% at 80% 0%, #000 20%, transparent 75%)",
          }}
        />
        <div aria-hidden="true" className="absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-[#D4AF37]/20 blur-[110px]" />
        <div className="relative mx-auto max-w-6xl">
          <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-[2.5rem] leading-[1.08] sm:text-6xl">
            Sell your property without the broker runaround
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#FAF9F6]/75 sm:text-lg">
            Tell us about your home and add a few photos. Our team calls you back once we&rsquo;ve reviewed it.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#FAF9F6]/85">
            {[
              { i: ShieldCheck, t: "Free to list" },
              { i: Clock, t: "Takes about 5 minutes" },
              { i: PhoneCall, t: "We call you after review" },
            ].map(({ i: I, t }) => (
              <li key={t} className="flex items-center gap-2">
                <I size={17} strokeWidth={1.6} className="text-[#F5D77A]" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/40 to-transparent" />
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 pb-32 sm:px-6 lg:px-8 lg:pb-20">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="ok"
              role="status"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-6 max-w-xl rounded-3xl bg-white p-10 text-center shadow-[0_24px_60px_-28px_rgba(20,35,27,0.4)] ring-1 ring-[#1A2A22]/10 sm:p-12"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/15">
                <CheckCircle2 className="text-[#B8921F]" size={36} strokeWidth={1.4} />
              </span>
              <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl">We&rsquo;ve got your property</h2>
              <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[#52685B]">
                Our team will review the details and call you on the number you gave us.
              </p>
              <button type="button" onClick={() => setSuccess(false)} className={`mt-8 rounded-full bg-[#1A2A22] px-8 py-3 text-sm font-medium text-[#FAF9F6] transition hover:bg-[#2C4337] ${focusRing}`}>
                Add another property
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
              <div className="space-y-6">
                {shownError && (
                  <div role="alert" className="flex items-start gap-3 rounded-2xl border border-[#9C3B2B]/25 border-l-4 border-l-[#9C3B2B] bg-[#FBEDEA] px-5 py-4 text-sm text-[#9C3B2B]">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" /> {shownError}
                  </div>
                )}

                {/* Honeypot */}
                <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <Section id="contact" icon={User} title="Your contact details" subtitle="Where should we call you?">
                  <Item required label="Full name" error={errors.name}>
                    <Field placeholder="Your name" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
                  </Item>
                  <Item required label="Phone" error={errors.phone}>
                    <Field type="tel" inputMode="tel" placeholder="98765 43210" prefix="+91" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" className="!pl-14" />
                  </Item>
                  <Item span required label="Email" error={errors.email}>
                    <Field type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
                  </Item>
                </Section>

                <Section id="basic" icon={Building2} title="About the property" subtitle="This is what buyers see first.">
                  <Item span label="Property type">
                    <TypeTiles value={form.property_type} onChange={(v) => update("property_type", v)} />
                  </Item>
                  <Item span required label="Title" error={errors.title}>
                    <Field placeholder="e.g. 3 BHK apartment in Kaveri City Center" value={form.title} onChange={set("title")} error={errors.title} />
                  </Item>
                  <Item span required label="Expected price" error={errors.price} hint={inr(form.price)}>
                    <Field type="number" inputMode="numeric" min="0" placeholder="5000000" prefix="₹" value={form.price} onChange={set("price")} error={errors.price} />
                  </Item>
                  <Item span label="Description" hint={`${form.description.length}/${descMax}`}>
                    <Field as="textarea" maxLength={descMax} placeholder="Describe the layout, the surroundings and what makes this property special." value={form.description} onChange={set("description")} />
                  </Item>
                </Section>

                <Section id="location" icon={MapPin} title="Location" subtitle="Help buyers find the exact spot.">
                  <Item span required label="Full address" error={errors.location}>
                    <Field placeholder="Tower B, Sector 4, Greater Noida West" value={form.location} onChange={set("location")} error={errors.location} />
                  </Item>
                  <Item required label="City" error={errors.city}>
                    <Field placeholder="Greater Noida" value={form.city} onChange={set("city")} error={errors.city} />
                  </Item>
                  <Item label="Area">
                    <Field type="number" inputMode="numeric" min="0" placeholder="1200" suffix="sq ft" value={form.area} onChange={set("area")} />
                  </Item>
                  <Item span label="Nearby landmarks" hint="Press Enter or comma to add">
                    <TagInput value={form.nearby_landmarks} onChange={(a) => update("nearby_landmarks", a)} suggestions={opts?.landmarks_suggestions} placeholder="e.g. Metro station, 500 m" />
                  </Item>
                </Section>

                <Section id="specs" icon={Ruler} title="Property details" subtitle="Optional, but detailed listings get more enquiries." dense>
                  <Item label="Bedrooms"><Stepper value={form.bedrooms} onChange={(v) => update("bedrooms", v)} /></Item>
                  <Item label="Bathrooms"><Stepper value={form.bathrooms} onChange={(v) => update("bathrooms", v)} /></Item>
                  <Item label="Balconies"><Stepper value={form.balcony} onChange={(v) => update("balcony", v)} /></Item>
                  <Item label="Total floors"><Stepper value={form.total_floors} onChange={(v) => update("total_floors", v)} max={200} /></Item>
                  <Item label="Age of property">{select("age_of_property", opts?.age_of_property)}</Item>
                  <Item label="Furnishing">{select("furnishing", opts?.furnishing)}</Item>
                  <Item label="Transaction type">{select("transaction_type", opts?.transaction_type)}</Item>
                  <Item label="Parking">{select("parking", opts?.parking)}</Item>
                  <Item label="Facing">{select("facing", opts?.facing)}</Item>
                  <Item label="Construction type">{select("construction_type", opts?.construction_type)}</Item>
                </Section>

                <Section id="photos" icon={ImageIcon} title="Photos" subtitle="The first photo becomes the cover image.">
                  <div className="col-span-full" data-error={errors.images ? "true" : undefined}>
                    <ImageUpload value={form.images} onChange={(urls) => update("images", urls)} />
                    {errors.images && (
                      <p role="alert" className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-[#9C3B2B]">
                        <AlertCircle size={13} /> {errors.images}
                      </p>
                    )}
                  </div>
                </Section>
              </div>

              {/* Desktop sidebar: preview + checklist */}
              <aside className="hidden lg:block">
                <div className="sticky top-6 space-y-5">
                  <div>
                    <p className="mb-2.5 text-sm font-medium text-[#52685B]">How your listing will look</p>
                    <Preview form={form} />
                  </div>
                  <div className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(20,35,27,0.05),0_12px_32px_-16px_rgba(20,35,27,0.18)] ring-1 ring-[#1A2A22]/[0.07]">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="relative flex h-10 w-10 items-center justify-center">
                        <ProgressRing done={doneCount} total={totalReq} />
                        <span className="absolute text-[11px] font-semibold tabular-nums">{doneCount}/{totalReq}</span>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-display)] text-lg leading-tight">To finish</p>
                        <p className="text-xs text-[#52685B]">{doneCount === totalReq ? "All set. Ready to send." : `${totalReq - doneCount} required left`}</p>
                      </div>
                    </div>
                    <ul className="space-y-0.5">
                      {REQUIRED.map((r) => {
                        const ok = checks[r.key];
                        return (
                          <li key={r.key}>
                            <button
                              type="button"
                              onClick={() => goTo(r.sec)}
                              className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-[#F6F3EC] ${focusRing} ${
                                ok ? "text-[#52685B]" : "text-[#14231B]"
                              }`}
                            >
                              {ok ? <CheckCircle2 size={17} className="text-[#3D7A55]" /> : <Circle size={17} className="text-[#52685B]/45" />}
                              <span className={ok ? "line-through decoration-[#52685B]/40" : ""}>{r.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-5">{submitBtn}</div>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile action bar */}
      {!success && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-[#D4AF37]/30 bg-[#14231B]/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-[#FAF9F6] backdrop-blur lg:hidden">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[#FAF9F6]/80">{doneCount} of {totalReq} required done</p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#FAF9F6]/15">
              <div className="h-full rounded-full bg-[#D4AF37] transition-all duration-500" style={{ width: `${(doneCount / totalReq) * 100}%` }} />
            </div>
          </div>
          <div className="w-44 shrink-0">{submitBtn}</div>
        </div>
      )}
    </div>
  );
}