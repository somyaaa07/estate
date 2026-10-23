"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Marcellus, DM_Sans } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Building2, Check, CheckCircle2, Circle, Home, ImageIcon,
  Landmark, LandPlot, Loader2, MapPin, Minus, Plus, Ruler, Store, User, X,
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

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-3 text-[15px] text-[#1A2A22] placeholder:text-[#52685B]/55 outline-none transition focus:border-[#1A2A22] focus:ring-4 focus:ring-[#D4AF37]/25";

/* ───────────── UI pieces ───────────── */
function Item({ label, required, hint, error, span, children, htmlFor }) {
  return (
    <div className={span ? "sm:col-span-2" : ""} data-error={error ? "true" : undefined}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-[#1A2A22]">
        <span>
          {label}
          {required && <span className="ml-0.5 text-[#9C3B2B]" aria-hidden="true">*</span>}
        </span>
        {hint && <span className="text-xs font-normal text-[#52685B]">{hint}</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#9C3B2B]">
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
      className={`${inputBase} ${error ? "border-[#9C3B2B] bg-[#FBF1EF]" : "border-[#52685B]/25"} ${
        Tag === "textarea" ? "min-h-[120px] resize-y leading-relaxed" : ""
      } ${Tag === "select" ? "cursor-pointer" : ""} ${className}`}
    />
  );
}

function TypeTiles({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Property type" className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
      {TYPES.map(({ value: v, label, icon: Icon }) => {
        const on = value === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(v)}
            className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
              on
                ? "border-[#1A2A22] bg-[#1A2A22] text-[#FAF9F6]"
                : "border-[#52685B]/25 bg-white text-[#52685B] hover:border-[#1A2A22] hover:text-[#1A2A22]"
            }`}
          >
            <Icon size={22} strokeWidth={1.5} className={on ? "text-[#F5D77A]" : ""} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Stepper({ value, onChange, max = 20 }) {
  const n = value === "" ? 0 : Number(value);
  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F0E8] text-[#1A2A22] transition hover:bg-[#1A2A22] hover:text-[#FAF9F6] disabled:opacity-35 disabled:hover:bg-[#F3F0E8] disabled:hover:text-[#1A2A22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]";
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#52685B]/25 bg-white px-2 py-1.5">
      <button type="button" aria-label="Decrease" disabled={n <= 0} onClick={() => onChange(n - 1 <= 0 ? "0" : String(n - 1))} className={btn}>
        <Minus size={15} />
      </button>
      <span className="text-lg tabular-nums">{value === "" ? "–" : n}</span>
      <button type="button" aria-label="Increase" disabled={n >= max} onClick={() => onChange(String(n + 1))} className={btn}>
        <Plus size={15} />
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
    `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] ring-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
      on ? "bg-[#1A2A22] text-[#FAF9F6] ring-[#1A2A22]" : "bg-white text-[#52685B] ring-[#52685B]/25 hover:ring-[#1A2A22]"
    }`;
  return (
    <div>
      {suggestions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
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
        <button type="button" onClick={commit} disabled={!text.trim()} className="shrink-0 rounded-lg bg-[#1A2A22] px-5 text-sm text-[#FAF9F6] transition hover:bg-[#52685B] disabled:opacity-40">
          Add
        </button>
      </div>
      {custom.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
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

function Section({ id, icon: Icon, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-6 border-t border-[#1A2A22]/15 py-9 first:border-t-0 first:pt-0">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A2A22]">
          <Icon className="text-[#F5D77A]" size={18} strokeWidth={1.5} />
        </span>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl leading-tight">{title}</h2>
          <p className="text-sm text-[#52685B]">{subtitle}</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

/* Live preview of how the listing will look */
function Preview({ form }) {
  const specs = [
    form.bedrooms && `${form.bedrooms} bed`,
    form.bathrooms && `${form.bathrooms} bath`,
    form.area && `${form.area} sq ft`,
  ].filter(Boolean);
  const cover = form.images[0];
  const src = typeof cover === "string" ? cover : cover?.url;
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#1A2A22]/15">
      <div className="flex aspect-[16/10] items-center justify-center bg-[#F3F0E8] text-[#52685B]/60">
        {src ? <img src={src} alt="Cover" className="h-full w-full object-cover" /> : <ImageIcon size={32} strokeWidth={1.25} />}
      </div>
      <div className="space-y-1 p-4">
        <p className="font-[family-name:var(--font-display)] text-xl text-[#1A2A22]">
          {inr(form.price) || "Price"}
        </p>
        <p className="line-clamp-2 text-sm text-[#1A2A22]">{form.title || "Your property title"}</p>
        <p className="text-xs text-[#52685B]">
          {[form.city, TYPES.find((t) => t.value === form.property_type)?.label].filter(Boolean).join(", ")}
          {specs.length > 0 && ` · ${specs.join(" · ")}`}
        </p>
      </div>
    </div>
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
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-7 py-3 text-sm font-medium text-[#1A2A22] transition hover:bg-[#F5D77A] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A2A22]"
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {loading ? "Sending…" : "Send my property"}
    </button>
  );

  return (
    <div className={`${display.variable} ${body.variable} min-h-screen overflow-x-clip bg-[#F3F0E8] font-[family-name:var(--font-body)] text-[#1A2A22]`}>
      {/* Hero */}
      <header className="relative bg-[#1A2A22] px-4 py-12 text-[#FAF9F6] sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.1] sm:text-5xl">
            Sell your property without the broker runaround
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#FAF9F6]/75">
            Tell us about your home and add a few photos. It takes about five minutes, it&rsquo;s free, and our team calls you back once we&rsquo;ve reviewed it.
          </p>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent" />
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 pb-28 sm:px-6 lg:px-8 lg:pb-16">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="ok"
              role="status"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center ring-1 ring-[#1A2A22]/15"
            >
              <CheckCircle2 className="mx-auto text-[#D4A62A]" size={44} strokeWidth={1.25} />
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl">We&rsquo;ve got your property</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#52685B]">
                Our team will review the details and call you on the number you gave us.
              </p>
              <button type="button" onClick={() => setSuccess(false)} className="mt-7 rounded-full bg-[#1A2A22] px-7 py-2.5 text-sm text-[#FAF9F6] transition hover:bg-[#52685B]">
                Add another property
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                {shownError && (
                  <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border-l-4 border-[#9C3B2B] bg-[#F6E3DF] px-5 py-4 text-sm text-[#9C3B2B]">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" /> {shownError}
                  </div>
                )}

                {/* Honeypot */}
                <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <div className="rounded-3xl bg-[#FAF9F6] p-6 ring-1 ring-[#1A2A22]/10 sm:p-9">
                  <Section id="contact" icon={User} title="Your contact details" subtitle="Where should we call you?">
                    <Item required label="Full name" error={errors.name}>
                      <Field placeholder="Your name" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
                    </Item>
                    <Item required label="Phone" error={errors.phone}>
                      <Field type="tel" inputMode="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
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
                    <Item span required label="Expected price (₹)" error={errors.price} hint={inr(form.price)}>
                      <Field type="number" inputMode="numeric" min="0" placeholder="5000000" value={form.price} onChange={set("price")} error={errors.price} />
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
                    <Item label="Area" hint="sq ft">
                      <Field type="number" inputMode="numeric" min="0" placeholder="1200" value={form.area} onChange={set("area")} />
                    </Item>
                    <Item span label="Nearby landmarks" hint="Press Enter or comma to add">
                      <TagInput value={form.nearby_landmarks} onChange={(a) => update("nearby_landmarks", a)} suggestions={opts?.landmarks_suggestions} placeholder="e.g. Metro station, 500 m" />
                    </Item>
                  </Section>

                  <Section id="specs" icon={Ruler} title="Property details" subtitle="Optional, but detailed listings get more enquiries.">
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
                    <div className="sm:col-span-2" data-error={errors.images ? "true" : undefined}>
                      <ImageUpload value={form.images} onChange={(urls) => update("images", urls)} />
                      {errors.images && (
                        <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs text-[#9C3B2B]">
                          <AlertCircle size={13} /> {errors.images}
                        </p>
                      )}
                    </div>
                  </Section>
                </div>
              </div>

              {/* Desktop sidebar: preview + checklist */}
              <aside className="hidden lg:block">
                <div className="sticky top-6 space-y-5">
                  <div>
                    <p className="mb-2 text-sm text-[#52685B]">How your listing will look</p>
                    <Preview form={form} />
                  </div>
                  <div className="rounded-2xl bg-white p-5 ring-1 ring-[#1A2A22]/15">
                    <div className="mb-3 flex items-baseline justify-between">
                      <p className="font-[family-name:var(--font-display)] text-lg">To finish</p>
                      <p className="text-xs text-[#52685B]">{doneCount} of {totalReq} done</p>
                    </div>
                    <div className="mb-4 h-1 overflow-hidden rounded-full bg-[#1A2A22]/10">
                      <div className="h-full rounded-full bg-[#D4AF37] transition-all duration-500" style={{ width: `${(doneCount / totalReq) * 100}%` }} />
                    </div>
                    <ul className="space-y-1.5">
                      {REQUIRED.map((r) => {
                        const ok = checks[r.key];
                        return (
                          <li key={r.key}>
                            <button
                              type="button"
                              onClick={() => goTo(r.sec)}
                              className={`flex w-full items-center gap-2 rounded-md py-0.5 text-left text-sm transition hover:text-[#1A2A22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                                ok ? "text-[#52685B] line-through decoration-[#52685B]/40" : "text-[#1A2A22]"
                              }`}
                            >
                              {ok ? <CheckCircle2 size={16} className="text-[#3D7A55]" /> : <Circle size={16} className="text-[#52685B]/50" />}
                              {r.label}
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
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-[#D4AF37]/30 bg-[#1A2A22] px-4 py-3 text-[#FAF9F6] lg:hidden">
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