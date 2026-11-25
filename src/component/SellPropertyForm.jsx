"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Marcellus, DM_Sans } from "next/font/google";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Home,
  ImageIcon,
  Landmark,
  LandPlot,
  Loader2,
  MapPin,
  Minus,
  PhoneCall,
  Plus,
  Ruler,
  ShieldCheck,
  Store,
  User,
  X,
  ArrowRight,
} from "lucide-react";
import ImageUpload from "@/component/ImageUploadPublic";
const display = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});
const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* 👉 Put your hero photo here (any file inside /public). Wide, landscape photos work best. */
const HERO_IMAGE =
  "https://i.pinimg.com/736x/08/e7/fd/08e7fdc04193aefd05acc2876e93201d.jpg";

const ease = [0.22, 1, 0.36, 1];
const heroV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const riseV = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

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
  {
    key: "name",
    label: "Your name",
    sec: "contact",
    msg: "Enter your full name.",
  },
  {
    key: "phone",
    label: "Phone number",
    sec: "contact",
    msg: "Enter a valid 10-digit phone number.",
  },
  {
    key: "email",
    label: "Email",
    sec: "contact",
    msg: "Enter a valid email address.",
  },
  {
    key: "title",
    label: "Property title",
    sec: "basic",
    msg: "Give the property a title.",
  },
  {
    key: "price",
    label: "Expected price",
    sec: "basic",
    msg: "Enter a price greater than 0.",
  },
  {
    key: "location",
    label: "Full address",
    sec: "location",
    msg: "Add the full address.",
  },
  { key: "city", label: "City", sec: "location", msg: "Add the city." },
  {
    key: "images",
    label: "At least one photo",
    sec: "photos",
    msg: "Upload at least one photo.",
  },
];

/* Mobile steps (one section per step). Desktop still shows everything. */
const STEPS = [
  { id: "contact", label: "Contact" },
  { id: "basic", label: "Property" },
  { id: "location", label: "Location" },
  { id: "specs", label: "Details" },
  { id: "photos", label: "Photos" },
];
const LAST_STEP = STEPS.length - 1;

/* Shared input look: tall, soft, clear focus.
   text-base on mobile stops iOS Safari from zooming in when an input is focused. */
const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-base lg:text-[15px] text-[#0A0A0A] placeholder:text-[#5F5F5F]/60 outline-none transition-[border-color,box-shadow] duration-150 hover:border-[#5F5F5F]/50 focus:border-black focus:shadow-[0_0_0_4px_rgba(212,175,55,0.25)] disabled:cursor-wait disabled:bg-[#F6F3EC] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]";

const cardShadow =
  "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_12px_32px_-16px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.07]";

const touch = "touch-manipulation [-webkit-tap-highlight-color:transparent]";

/* ───────────── UI pieces ───────────── */
function Item({ label, required, hint, error, span, children, htmlFor }) {
  return (
    <div
      className={span ? "col-span-full" : ""}
      data-error={error ? "true" : undefined}
    >
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-baseline justify-between gap-2 text-[13.5px] font-semibold text-[#0A0A0A]"
      >
        <span>
          {label}
          {required && (
            <span className="ml-0.5 text-[#B3261E]" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {hint && (
          <span className="text-xs font-normal text-[#5F5F5F]">{hint}</span>
        )}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, x: -8, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#B3261E]"
          >
            <AlertCircle size={13} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  as: Tag = "input",
  error,
  className = "",
  prefix,
  suffix,
  ...props
}) {
  const id = useId();
  const isSelect = Tag === "select";
  const el = (
    <Tag
      id={props.id || id}
      aria-invalid={!!error}
      {...props}
      className={`${inputBase} ${error ? "border-[#B3261E] bg-[#FDF3F2]" : "border-[#5F5F5F]/25"} ${
        Tag === "textarea" ? "min-h-[130px] resize-y leading-relaxed" : ""
      } ${isSelect ? "cursor-pointer appearance-none pr-10" : ""} ${prefix ? "pl-11" : ""} ${suffix ? "pr-14" : ""} ${className}`}
    />
  );
  if (!prefix && !suffix && !isSelect) return el;
  return (
    <div className="relative">
      {prefix && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-[15px] font-medium text-[#5F5F5F]">
          {prefix}
        </span>
      )}
      {el}
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-[#5F5F5F]">
          {suffix}
        </span>
      )}
      {isSelect && (
        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5F5F5F]"
        />
      )}
    </div>
  );
}

function TypeTiles({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Property type"
      className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 sm:gap-3"
    >
      {TYPES.map(({ value: v, label, icon: Icon }) => {
        const on = value === v;
        return (
          <motion.button
            key={v}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(v)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`relative flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border px-1.5 py-4 text-[13px] transition-colors sm:gap-2.5 sm:px-2 sm:py-5 sm:text-sm ${touch} ${focusRing} ${
              on
                ? "border-black text-[#FAF9F6] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.7)]"
                : "border-[#5F5F5F]/20 bg-white text-[#5F5F5F] hover:border-black/60 hover:text-black"
            }`}
          >
            {on && (
              <motion.span
                layoutId="type-bg"
                className="absolute inset-0 rounded-2xl bg-black"
                transition={{ type: "spring", stiffness: 450, damping: 36 }}
              />
            )}
            <AnimatePresence>
              {on && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute right-2 top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37]"
                >
                  <Check size={10} strokeWidth={3} className="text-black" />
                </motion.span>
              )}
            </AnimatePresence>
            <Icon
              size={24}
              strokeWidth={1.5}
              className={`relative z-10 ${on ? "text-[#F5D77A]" : ""}`}
            />
            <span
              className={`relative z-10 ${on ? "font-semibold" : "font-medium"}`}
            >
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function Stepper({ value, onChange, max = 20 }) {
  const n = value === "" ? 0 : Number(value);
  const btn = `flex h-11 w-11 items-center justify-center rounded-full bg-[#F1EDE3] text-[#0A0A0A] transition-colors hover:bg-black hover:text-[#FAF9F6] disabled:opacity-30 disabled:hover:bg-[#F1EDE3] disabled:hover:text-[#0A0A0A] lg:h-10 lg:w-10 ${touch} ${focusRing}`;
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#5F5F5F]/25 bg-white px-2 py-1.5 transition hover:border-[#5F5F5F]/50">
      <motion.button
        whileTap={{ scale: 0.82 }}
        type="button"
        aria-label="Decrease"
        disabled={n <= 0}
        onClick={() => onChange(n - 1 <= 0 ? "0" : String(n - 1))}
        className={btn}
      >
        <Minus size={16} />
      </motion.button>
      <span className="relative flex h-7 w-10 items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value === "" ? "none" : n}
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 14, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`text-lg font-semibold tabular-nums ${value === "" ? "text-[#5F5F5F]/50" : ""}`}
          >
            {value === "" ? "–" : n}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.button
        whileTap={{ scale: 0.82 }}
        type="button"
        aria-label="Increase"
        disabled={n >= max}
        onClick={() => onChange(String(n + 1))}
        className={btn}
      >
        <Plus size={16} />
      </motion.button>
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
    const next = [...value];
    text
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((p) => {
        if (!next.some((v) => v.toLowerCase() === p.toLowerCase()))
          next.push(p);
      });
    onChange(next);
    setText("");
  };
  const custom = value.filter(
    (v) => !suggestions.some((s) => s.toLowerCase() === v.toLowerCase()),
  );
  const chip = (on) =>
    `inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium ring-1 transition-colors ${touch} ${focusRing} ${
      on
        ? "bg-black text-[#FAF9F6] ring-black"
        : "bg-white text-[#5F5F5F] ring-[#5F5F5F]/25 hover:text-black hover:ring-black/60"
    }`;
  return (
    <div>
      {suggestions.length > 0 && (
        <div className="mb-3.5 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.92 }}
              type="button"
              aria-pressed={has(s)}
              onClick={() => toggle(s)}
              className={chip(has(s))}
            >
              {has(s) ? <Check size={13} /> : <Plus size={13} />} {s}
            </motion.button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Field
          value={text}
          placeholder={placeholder}
          enterKeyHint="done"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
          }}
        />
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={commit}
          disabled={!text.trim()}
          className={`shrink-0 rounded-xl bg-black px-6 text-sm font-semibold text-[#FAF9F6] transition-colors hover:bg-[#262626] disabled:opacity-35 ${touch} ${focusRing}`}
        >
          Add
        </motion.button>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        <AnimatePresence>
          {custom.map((v) => (
            <motion.span
              key={v}
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={chip(true)}
            >
              {v}
              <button
                type="button"
                aria-label={`Remove ${v}`}
                onClick={() => remove(v)}
                className="rounded-full p-0.5 hover:text-[#F5D77A]"
              >
                <X size={14} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* Each section is its own card; fades up as it scrolls into view.
   On mobile only the current step is visible (mobileHidden); on desktop all show. */
function Section({
  id,
  icon: Icon,
  title,
  subtitle,
  dense,
  mobileHidden,
  children,
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease }}
      className={`scroll-mt-24 rounded-3xl bg-white p-5 sm:p-8 ${cardShadow} ${
        mobileHidden ? "max-lg:hidden" : ""
      }`}
    >
      <div className="mb-5 flex items-center gap-3.5 border-b border-black/10 pb-5 sm:mb-7 sm:gap-4 sm:pb-6">
        <motion.span
          whileHover={{ rotate: -8, scale: 1.08 }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black shadow-[inset_0_0_0_1px_rgba(212,175,55,0.5)] sm:h-12 sm:w-12"
        >
          <Icon className="text-[#F5D77A]" size={20} strokeWidth={1.6} />
        </motion.span>
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-display)] text-2xl leading-tight sm:text-[1.65rem]">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-[#5F5F5F]">{subtitle}</p>
        </div>
      </div>
      <div
        className={`grid gap-x-5 gap-y-5 sm:gap-y-6 ${dense ? "grid-cols-2" : "sm:grid-cols-2"}`}
      >
        {children}
      </div>
    </motion.section>
  );
}

/* Mobile only: numbered step tracker at the top of the form */
function MobileStepper({ step, onJump }) {
  const pct = (step / (STEPS.length - 1)) * 80;
  return (
    <nav
      aria-label="Progress"
      className={`rounded-2xl bg-white px-2 pb-3.5 pt-4 ${cardShadow} lg:hidden`}
    >
      <ol className="relative flex items-start">
        <span
          aria-hidden="true"
          className="absolute left-[10%] right-[10%] top-[17px] h-0.5 rounded-full bg-black/10"
        />
        <motion.span
          aria-hidden="true"
          className="absolute left-[10%] top-[17px] h-0.5 rounded-full bg-[#D4AF37]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease }}
        />
        {STEPS.map((s, i) => {
          const past = i < step;
          const now = i === step;
          return (
            <li
              key={s.id}
              className="relative z-10 flex w-1/5 flex-col items-center"
            >
              <button
                type="button"
                disabled={!past}
                onClick={() => onJump(i)}
                aria-label={`${s.label}${past ? " (done, tap to edit)" : now ? " (current step)" : ""}`}
                aria-current={now ? "step" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold transition-all duration-300 ${touch} ${focusRing} ${
                  past
                    ? "bg-[#D4AF37] text-black"
                    : now
                      ? "scale-110 bg-black text-[#F5D77A] ring-4 ring-[#D4AF37]/30"
                      : "bg-[#EFEADD] text-[#5F5F5F]"
                }`}
              >
                {past ? <Check size={16} strokeWidth={3} /> : i + 1}
              </button>
              <span
                className={`mt-2 text-[11px] leading-none ${
                  now ? "font-bold text-black" : "font-medium text-[#5F5F5F]"
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_-20px_rgba(0,0,0,0.5)] ring-1 ring-black/10"
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-[#EFEADD] to-[#E4DDCB] text-[#5F5F5F]/60">
        <AnimatePresence mode="wait">
          {src ? (
            <motion.img
              key={src}
              src={src}
              alt="Cover"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              key="empty"
              className="flex flex-col items-center gap-1.5 text-xs"
            >
              <ImageIcon size={28} strokeWidth={1.25} /> Cover photo
            </div>
          )}
        </AnimatePresence>
        {typeLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-black/90 px-3 py-1 text-xs font-medium text-[#FAF9F6] backdrop-blur">
            {typeLabel}
          </span>
        )}
        {form.images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs text-[#0A0A0A]">
            {form.images.length} photos
          </span>
        )}
      </div>
      <div className="space-y-1.5 p-5">
        <p
          className={`font-[family-name:var(--font-display)] text-2xl ${form.price ? "text-[#0A0A0A]" : "text-[#5F5F5F]/50"}`}
        >
          {inr(form.price) || "₹ Price"}
        </p>
        <p
          className={`line-clamp-2 text-[15px] leading-snug ${form.title ? "text-[#0A0A0A]" : "text-[#5F5F5F]/50"}`}
        >
          {form.title || "Your property title"}
        </p>
        {(form.city || specs.length > 0) && (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-[#5F5F5F]">
            {form.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} /> {form.city}
              </span>
            )}
            {specs.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function ProgressRing({ done, total }) {
  const r = 15,
    c = 2 * Math.PI * r;
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="-rotate-90"
    >
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="#000"
        strokeOpacity="0.1"
        strokeWidth="3.5"
      />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="#D4AF37"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - done / total)}
        style={{ transition: "stroke-dashoffset .5s ease" }}
      />
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
  const [imgOk, setImgOk] = useState(true);
  const [step, setStep] = useState(0); // mobile step
  const baseline = useRef(JSON.stringify(EMPTY_FORM));
  const heroRef = useRef(null);
  const topRef = useRef(null);
  const firstRender = useRef(true);
  const skipScroll = useRef(false);

  // Hero image parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

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

  /* Mobile: when the step changes, bring the top of the form into view */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

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
  const goTo = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  const scrollToFirstError = () =>
    setTimeout(
      () =>
        document
          .querySelector('[data-error="true"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      90,
    );

  /* Mobile: validate only the current step before moving on */
  const handleNext = () => {
    const next = {};
    REQUIRED.filter((r) => r.sec === STEPS[step].id).forEach((r) => {
      if (!checks[r.key]) next[r.key] = r.msg;
    });
    if (Object.keys(next).length) {
      setErrors((e) => ({ ...e, ...next }));
      scrollToFirstError();
      return;
    }
    setStep((s) => Math.min(s + 1, LAST_STEP));
  };

  const handleSubmit = async () => {
    const next = {};
    REQUIRED.forEach((r) => {
      if (!checks[r.key]) next[r.key] = r.msg;
    });
    setErrors(next);
    if (Object.keys(next).length) {
      /* Jump to the step that holds the first problem (mobile) */
      const firstBad = REQUIRED.find((r) => next[r.key]);
      const idx = STEPS.findIndex((s) => s.id === firstBad.sec);
      if (idx !== -1 && idx !== step) {
        skipScroll.current = true;
        setStep(idx);
      }
      scrollToFirstError();
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
        setStep(0);
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
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Field>
  );

  const shownError = submitError || optsError;
  const descMax = 1000;
  const goldBtn =
    "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] px-7 py-3.5 text-sm font-extrabold tracking-wide text-black shadow-[0_10px_24px_-8px_rgba(226,161,13,0.8)] transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70";

  const submitBtn = (
    <motion.button
      type="button"
      onClick={handleSubmit}
      disabled={loading}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={`${goldBtn} min-h-[48px] ${touch} ${focusRing}`}
    >
      {!loading && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          initial={{ x: "-150%" }}
          animate={{ x: "400%" }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}
      {loading && <Loader2 size={16} className="relative animate-spin" />}
      <span className="relative">
        {loading ? "Sending…" : "Send my property"}
      </span>
      {!loading && (
        <ArrowRight
          size={16}
          className="relative transition-transform group-hover:translate-x-1"
        />
      )}
    </motion.button>
  );

  const nextBtn = (
    <motion.button
      type="button"
      onClick={handleNext}
      whileTap={{ scale: 0.97 }}
      className={`${goldBtn} min-h-[48px] ${touch} ${focusRing}`}
    >
      <span className="relative">
        Continue
      </span>
      <ArrowRight size={16} className="relative" />
    </motion.button>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`${display.variable} ${body.variable} min-h-screen overflow-x-clip bg-[#F6F3EC] font-[family-name:var(--font-body)] text-[#0A0A0A] antialiased`}
      >
        {/* ───── Hero: photo + black overlay ───── */}
        <header
          ref={heroRef}
          className="relative isolate overflow-hidden bg-black px-4 pb-20 pt-10 text-[#FAF9F6] sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-32 lg:pt-28"
        >
          {imgOk && (
            <motion.div
              style={{ y: imgY }}
              className="absolute inset-x-0 -bottom-16 -top-16 -z-20"
            >
              <motion.img
                src={HERO_IMAGE}
                alt=""
                onError={() => setImgOk(false)}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2.4, ease }}
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}
          {/* black overlays keep text readable over any photo */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/25 max-sm:from-black/90 max-sm:via-black/75 max-sm:to-black/50"
          />

          <motion.div
            aria-hidden="true"
            animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.15, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-24 -top-32 -z-10 h-[420px] w-[420px] rounded-full bg-[#D4AF37]/30 blur-[110px]"
          />

          <motion.div
            style={{ y: textY }}
            variants={heroV}
            initial="hidden"
            animate="show"
            className="relative mx-auto max-w-6xl"
          >
            <motion.span
              variants={riseV}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#D4AF37]/50 bg-black/50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F5D77A] backdrop-blur sm:px-4 sm:text-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AF37]" />
              </span>
              Sell with Bringo
            </motion.span>
            <motion.h1
              variants={riseV}
              className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-[2.1rem] leading-[1.1] sm:mt-6 sm:text-6xl sm:leading-[1.08]"
            >
              Sell Your Property the{" "}
              <span className="bg-gradient-to-r from-[#E2A10D] via-[#FFE08A] to-[#E2A10D] bg-clip-text text-transparent">
                Hassle-Free Way
              </span>
            </motion.h1>
            <motion.p
              variants={riseV}
              className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#FAF9F6]/85 sm:mt-5 sm:text-lg"
            >
              Tell us about your home and add a few photos. Our team calls you
              back once we&rsquo;ve reviewed it.
            </motion.p>
            <motion.ul
              variants={heroV}
              className="mt-6 flex flex-wrap gap-2 text-[13px] font-medium text-[#FAF9F6] sm:mt-8 sm:gap-3 sm:text-sm"
            >
              {[
                { i: ShieldCheck, t: "Free to list" },
                { i: Clock, t: "Sell less than 5mins" },
                { i: PhoneCall, t: "Get a quick response " },
              ].map(({ i: I, t }) => (
                <motion.li
                  key={t}
                  variants={riseV}
                  whileHover={{ y: -3, borderColor: "rgba(212,175,55,0.7)" }}
                  className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-md sm:px-4 sm:py-2"
                >
                  <I size={16} strokeWidth={1.8} className="text-[#F5D77A]" />{" "}
                  {t}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.5, ease }}
            className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-transparent"
          />
        </header>

        <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 pb-12 sm:-mt-12 sm:px-6 lg:px-8 lg:pb-20">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="ok"
                role="status"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease }}
                className="mx-auto mt-6 max-w-xl rounded-3xl bg-white p-8 text-center shadow-[0_24px_60px_-28px_rgba(0,0,0,0.5)] ring-1 ring-black/10 sm:p-12"
              >
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/15">
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border-2 border-[#D4AF37]"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 14,
                      delay: 0.15,
                    }}
                  >
                    <CheckCircle2
                      className="text-[#B8921F]"
                      size={36}
                      strokeWidth={1.5}
                    />
                  </motion.span>
                </span>
                <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl">
                  We&rsquo;ve got your property
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[#5F5F5F]">
                  Our team will review the details and call you on the number
                  you gave us.
                </p>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setStep(0);
                  }}
                  className={`mt-8 min-h-[48px] rounded-full bg-black px-8 py-3 text-sm font-semibold text-[#FAF9F6] transition-colors hover:bg-[#262626] ${touch} ${focusRing}`}
                >
                  Add another property
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10"
              >
                <div
                  className="space-y-5 lg:space-y-6"
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.defaultPrevented &&
                      e.target.tagName === "INPUT" &&
                      window.innerWidth < 1024 &&
                      step < LAST_STEP
                    ) {
                      e.preventDefault();
                      e.target.blur();
                      handleNext();
                    }
                  }}
                >
                  {/* Mobile: step progress */}
                  <div ref={topRef} className="scroll-mt-16 lg:hidden">
                    <MobileStepper
                      step={step}
                      onJump={(i) => i < step && setStep(i)}
                    />
                  </div>

                  <AnimatePresence>
                    {shownError && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="flex items-start gap-3 rounded-2xl border border-[#B3261E]/25 border-l-4 border-l-[#B3261E] bg-[#FDF3F2] px-5 py-4 text-sm font-medium text-[#B3261E]"
                      >
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />{" "}
                        {shownError}
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

                  <Section
                    id="contact"
                    icon={User}
                    title="Your contact details"
                    subtitle="Where should we call you?"
                    mobileHidden={step !== 0}
                  >
                    <Item required label="Full name" error={errors.name}>
                      <Field
                        placeholder="Your name"
                        value={form.name}
                        onChange={set("name")}
                        error={errors.name}
                        autoComplete="name"
                        enterKeyHint="next"
                      />
                    </Item>
                    <Item required label="Phone" error={errors.phone}>
                      <Field
                        type="tel"
                        inputMode="tel"
                        placeholder="98765 43210"
                        prefix="+91"
                        value={form.phone}
                        onChange={set("phone")}
                        error={errors.phone}
                        autoComplete="tel"
                        enterKeyHint="next"
                        className="!pl-14"
                      />
                    </Item>
                    <Item span required label="Email" error={errors.email}>
                      <Field
                        type="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={set("email")}
                        error={errors.email}
                        autoComplete="email"
                        enterKeyHint="done"
                      />
                    </Item>
                  </Section>

                  <Section
                    id="basic"
                    icon={Building2}
                    title="About the property"
                    subtitle="This is what buyers see first."
                    mobileHidden={step !== 1}
                  >
                    <Item span label="Property type">
                      <TypeTiles
                        value={form.property_type}
                        onChange={(v) => update("property_type", v)}
                      />
                    </Item>
                    <Item span required label="Title" error={errors.title}>
                      <Field
                        placeholder="e.g. 3 BHK apartment in Kaveri City Center"
                        value={form.title}
                        onChange={set("title")}
                        error={errors.title}
                        enterKeyHint="next"
                      />
                    </Item>
                    <Item
                      span
                      required
                      label="Expected price"
                      error={errors.price}
                      hint={inr(form.price)}
                    >
                      <Field
                        type="number"
                        inputMode="numeric"
                        min="0"
                        placeholder="5000000"
                        prefix="₹"
                        value={form.price}
                        onChange={set("price")}
                        error={errors.price}
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
                        placeholder="Describe the layout, the surroundings and what makes this property special."
                        value={form.description}
                        onChange={set("description")}
                      />
                    </Item>
                  </Section>

                  <Section
                    id="location"
                    icon={MapPin}
                    title="Location"
                    subtitle="Help buyers find the exact spot."
                    mobileHidden={step !== 2}
                  >
                    <Item
                      span
                      required
                      label="Full address"
                      error={errors.location}
                    >
                      <Field
                        placeholder="Tower B, Sector 4, Greater Noida West"
                        value={form.location}
                        onChange={set("location")}
                        error={errors.location}
                        autoComplete="street-address"
                        enterKeyHint="next"
                      />
                    </Item>
                    <Item required label="City" error={errors.city}>
                      <Field
                        placeholder="Greater Noida"
                        value={form.city}
                        onChange={set("city")}
                        error={errors.city}
                        autoComplete="address-level2"
                        enterKeyHint="next"
                      />
                    </Item>
                    <Item label="Area">
                      <Field
                        type="number"
                        inputMode="numeric"
                        min="0"
                        placeholder="1200"
                        suffix="sq ft"
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

                  <Section
                    id="specs"
                    icon={Ruler}
                    title="Property details"
                    subtitle="Optional, but detailed listings get more enquiries."
                    dense
                    mobileHidden={step !== 3}
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
                    <Item label="Parking">
                      {select("parking", opts?.parking)}
                    </Item>
                    <Item label="Facing">{select("facing", opts?.facing)}</Item>
                    <Item label="Construction type">
                      {select("construction_type", opts?.construction_type)}
                    </Item>
                  </Section>

                  <Section
                    id="photos"
                    icon={ImageIcon}
                    title="Photos"
                    subtitle="The first photo becomes the cover image."
                    mobileHidden={step !== 4}
                  >
                    <div
                      className="col-span-full"
                      data-error={errors.images ? "true" : undefined}
                    >
                      <ImageUpload
                        value={form.images}
                        onChange={(urls) => update("images", urls)}
                      />
                      {errors.images && (
                        <p
                          role="alert"
                          className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-[#B3261E]"
                        >
                          <AlertCircle size={13} /> {errors.images}
                        </p>
                      )}
                    </div>
                  </Section>

                  {/* Mobile, last step: preview + what is still missing */}
                  {step === LAST_STEP && (
                    <div className="space-y-4 lg:hidden">
                      <div>
                        <p className="mb-2.5 px-1 text-sm font-semibold text-[#0A0A0A]">
                          How your listing will look
                        </p>
                        <Preview form={form} />
                      </div>
                      {doneCount < totalReq && (
                        <p className="rounded-2xl bg-white px-4 py-3 text-xs text-[#5F5F5F] ring-1 ring-black/[0.07]">
                          {totalReq - doneCount} required{" "}
                          {totalReq - doneCount === 1 ? "field is" : "fields are"}{" "}
                          still empty. We&rsquo;ll take you right to{" "}
                          {totalReq - doneCount === 1 ? "it" : "them"} when you
                          tap send.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Mobile: inline Back + Continue / Send (no fixed bar, no overlap) */}
                  <div className="space-y-3 pt-1 lg:hidden">
                    <div className="flex items-center gap-3">
                      {step > 0 && (
                        <motion.button
                          type="button"
                          onClick={() => setStep((s) => Math.max(s - 1, 0))}
                          whileTap={{ scale: 0.94 }}
                          className={`flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black active:bg-black/5 ${touch} ${focusRing}`}
                        >
                          <ArrowLeft size={16} aria-hidden="true" /> Back
                        </motion.button>
                      )}
                      <div className="min-w-0 flex-1">
                        {step === LAST_STEP ? submitBtn : nextBtn}
                      </div>
                    </div>
                    <p className="text-center text-xs text-[#5F5F5F]">
                      {step < LAST_STEP
                        ? `Next: ${STEPS[step + 1].label}`
                        : "Last step. Review and send."}
                      {step === 3 && (
                        <>
                          {" · "}
                          <button
                            type="button"
                            onClick={() => setStep(4)}
                            className={`font-semibold text-black underline underline-offset-2 ${touch} ${focusRing}`}
                          >
                            Skip this step
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Desktop sidebar: preview + checklist */}
                <motion.aside
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3, ease }}
                  className="hidden lg:mt-12 lg:block"
                >
                  <div className="sticky top-24 space-y-5">
                    <div>
                      <p className="mb-2.5 mt-6 px-4 text-sm font-semibold text-[#0A0A0A]">
                        How your listing will look
                      </p>
                      <Preview form={form} />
                    </div>
                    <div className={`rounded-2xl bg-white p-6 ${cardShadow}`}>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center">
                          <ProgressRing done={doneCount} total={totalReq} />
                          <span className="absolute text-[11px] font-bold tabular-nums">
                            {doneCount}/{totalReq}
                          </span>
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-display)] text-lg leading-tight">
                            To finish
                          </p>
                          <p className="text-xs text-[#5F5F5F]">
                            {doneCount === totalReq
                              ? "All set. Ready to send."
                              : `${totalReq - doneCount} required left`}
                          </p>
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
                                className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition hover:translate-x-0.5 hover:bg-[#F6F3EC] ${focusRing} ${
                                  ok
                                    ? "text-[#5F5F5F]"
                                    : "font-medium text-[#0A0A0A]"
                                }`}
                              >
                                <motion.span
                                  key={ok ? "on" : "off"}
                                  initial={{ scale: 0.4, rotate: -40 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 14,
                                  }}
                                  className="flex"
                                >
                                  {ok ? (
                                    <CheckCircle2
                                      size={17}
                                      className="text-[#B8921F]"
                                    />
                                  ) : (
                                    <Circle
                                      size={17}
                                      className="text-[#5F5F5F]/50"
                                    />
                                  )}
                                </motion.span>
                                <span
                                  className={
                                    ok
                                      ? "line-through decoration-[#5F5F5F]/40"
                                      : ""
                                  }
                                >
                                  {r.label}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-5">{submitBtn}</div>
                    </div>
                  </div>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </MotionConfig>
  );
}