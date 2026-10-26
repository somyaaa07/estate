'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  ImageOff,
  Calendar,
  Car,
  Check,
  Compass,
  DoorOpen,
  Hammer,
  Landmark,
  Layers,
  Loader2,
  MapPin,
  Maximize2,
  Repeat,
  Ruler,
  Sofa,
  Sparkles,
  Tag,
  SearchX,
  X,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
});

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]';

const fieldBase =
  'w-full rounded-xl border border-[#000000]/15 bg-[#F3F0E8]/60 px-4 py-3 font-sans text-sm text-[#000000] outline-none transition placeholder:text-[#52685B]/60 hover:border-[#000000]/30 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#FFCD39]/30 disabled:opacity-60';
const labelBase = 'mb-1.5 block text-sm text-[#000000]';
const card =
  'rounded-3xl border border-[#000000]/10 bg-white shadow-[0_18px_45px_-30px_rgba(0,0,0,0.35)]';

const scrollToInquiry = () => {
  const el = document.getElementById('inquiry');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ---------- Price in words (Indian system) ---------- */
const ONES = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const belowHundred = (n) =>
  n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`;

// 4500000 -> "Forty Five Lakh"
function numberToWords(num) {
  let n = Math.floor(Number(num));
  if (!Number.isFinite(n) || n < 0) return '';
  if (n === 0) return 'Zero';

  const parts = [];
  const crore = Math.floor(n / 1e7); n %= 1e7;
  const lakh = Math.floor(n / 1e5); n %= 1e5;
  const thousand = Math.floor(n / 1e3); n %= 1e3;
  const hundred = Math.floor(n / 100);
  const rest = n % 100;

  if (crore) parts.push(`${numberToWords(crore)} Crore`);
  if (lakh) parts.push(`${belowHundred(lakh)} Lakh`);
  if (thousand) parts.push(`${belowHundred(thousand)} Thousand`);
  if (hundred) parts.push(`${ONES[hundred]} Hundred`);
  if (rest) parts.push(belowHundred(rest));
  return parts.join(' ');
}

// 12500000 -> "1.25 Crore", 4500000 -> "45 Lakh", 25000 -> "25 Thousand"
function formatPriceShort(n) {
  const trim = (x) => Number(x.toFixed(2)).toString();
  if (n >= 1e7) return `${trim(n / 1e7)} Crore`;
  if (n >= 1e5) return `${trim(n / 1e5)} Lakh`;
  if (n >= 1e3) return `${trim(n / 1e3)} Thousand`;
  return String(n);
}

/* ---------------------------------------------------------------
   LIGHTBOX
---------------------------------------------------------------- */
function Lightbox({ images, index, setIndex, onClose, title }) {
  const total = images.length;
  const go = useCallback((dir) => setIndex((p) => (p + dir + total) % total), [total, setIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (total > 1 && e.key === 'ArrowLeft') go(-1);
      if (total > 1 && e.key === 'ArrowRight') go(1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose, total]);

  const nav =
    'absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#FAF9F6]/10 text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 backdrop-blur transition hover:bg-[#F5D77A] hover:text-[#000000] ' +
    focusRing;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Property image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/95 p-4 sm:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF9F6]/10 text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition hover:bg-[#F5D77A] hover:text-[#000000] ${focusRing}`}
      >
        <X size={20} aria-hidden="true" />
      </button>

      <img
        src={images[index].url}
        alt={`${title || 'Property'} – image ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
      />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous image"
            className={`${nav} left-3 sm:left-6`}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next image"
            className={`${nav} right-3 sm:right-6`}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#000000]/70 px-4 py-1.5 font-sans text-xs text-[#FAF9F6] ring-1 ring-[#D4AF37]/30">
            {index + 1} / {total}
          </span>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   IMAGE GALLERY
---------------------------------------------------------------- */
function ImageGallery({ images = [], title, overlay }) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const total = images.length;

  const go = useCallback((dir) => setCurrent((p) => (p + dir + total) % total), [total]);
  const close = useCallback(() => setOpen(false), []);

  if (!total) {
    return (
      <div className="relative flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-3xl border border-[#000000]/10 bg-white text-[#52685B]">
        {overlay && <div className="absolute left-4 top-5 flex flex-wrap gap-2">{overlay}</div>}
        <ImageOff size={32} strokeWidth={1.4} aria-hidden="true" />
        <span className="font-sans text-sm">No images available</span>
      </div>
    );
  }

  const arrow =
    'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#FAF9F6]/90 text-[#000000] shadow-md backdrop-blur transition hover:bg-[#F5D77A] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 ' +
    focusRing;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Property images"
      onKeyDown={(e) => {
        if (total < 2) return;
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
    >
      <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#000000] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)] ring-1 ring-[#D4AF37]/30">
        <img
          key={current}
          src={images[current].url}
          alt={`${title || 'Property'} – image ${current + 1}`}
          className="h-full w-full animate-[fadeIn_0.4s_ease-out] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
        />
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#000000]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#000000]/35 to-transparent" />
        <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />

        {/* Badges overlay */}
        {overlay && <div className="absolute left-4 top-5 flex flex-wrap items-center gap-2 sm:left-5">{overlay}</div>}

        {/* Expand */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="View image full screen"
          className={`absolute right-4 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF9F6]/90 text-[#000000] shadow-md backdrop-blur transition hover:bg-[#F5D77A] sm:right-5 ${focusRing}`}
        >
          <Maximize2 size={16} aria-hidden="true" />
        </button>

        {total > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${arrow} left-4`}>
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${arrow} right-4`}>
              <ChevronRight size={20} aria-hidden="true" />
            </button>
            <span className="absolute bottom-4 right-4 rounded-full bg-[#000000]/70 px-3 py-1 font-sans text-xs text-[#FAF9F6] ring-1 ring-[#D4AF37]/30 backdrop-blur">
              {current + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === current}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${focusRing} ${
                i === current
                  ? 'border-[#D4AF37] opacity-100 shadow-[0_6px_16px_-6px_rgba(212,175,55,0.7)]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {open && <Lightbox images={images} index={current} setIndex={setCurrent} onClose={close} title={title} />}
    </div>
  );
}

/* ---------------------------------------------------------------
   SAVE BUTTON
---------------------------------------------------------------- */
function SaveButton({ propertyId, dark = false, iconOnly = false }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/saved?property_id=${propertyId}`)
      .then((r) => r.json())
      .then((d) => setSaved(!!d.saved))
      .catch(() => {});
  }, [session, propertyId]);

  const toggle = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: propertyId }),
      });
      const data = await res.json();
      setSaved(!!data.saved);
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  const idle = dark
    ? 'border-[#FAF9F6]/25 text-[#FAF9F6] hover:border-[#D4AF37] hover:text-[#F5D77A]'
    : 'border-[#000000]/20 bg-white text-[#52685B] hover:border-[#D4AF37] hover:text-[#000000]';

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save property'}
      className={`inline-flex items-center justify-center gap-2 rounded-full border font-sans text-sm transition ${focusRing} disabled:cursor-not-allowed disabled:opacity-60 ${
        iconOnly ? 'h-11 w-11 shrink-0' : 'px-5 py-3'
      } ${saved ? 'border-red-300 bg-red-50 text-red-500' : idle}`}
    >
      <Heart size={16} className={saved ? 'fill-red-500' : ''} aria-hidden="true" />
      {!iconOnly && (saved ? 'Saved' : 'Save')}
    </button>
  );
}

/* ---------------------------------------------------------------
   INQUIRY FORM
---------------------------------------------------------------- */
function InquiryForm({ propertyId }) {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (session?.user) {
      setForm((p) => ({
        ...p,
        name: session.user.name || p.name,
        email: session.user.email || p.email,
      }));
    }
  }, [session]);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMsg('Name, email and message are required.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, property_id: propertyId }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setForm((p) => ({ ...p, phone: '', message: '' }));
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div aria-live="polite" className={`${card} relative overflow-hidden p-8 text-center`}>
        <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[#000000] ${goldBg}`}>
          <CheckCircle2 size={26} aria-hidden="true" />
        </span>
        <p className="mt-5 text-2xl text-[#000000]">Inquiry sent</p>
        <p className="mt-2 font-sans text-sm text-[#52685B]">We will contact you shortly.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className={`mt-5 font-sans text-sm text-[#52685B] underline underline-offset-4 transition hover:text-[#000000] ${focusRing}`}
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const loading = status === 'loading';

  return (
    <div className={`${card} relative overflow-hidden p-6 sm:p-7`}>
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
      <h2 className="text-2xl text-[#000000]">Send an inquiry</h2>
      <span aria-hidden="true" className={`mt-3 block h-[3px] w-12 rounded-full ${goldBg}`} />
      <p className="mt-3 font-sans text-sm text-[#52685B]">We usually reply within a day.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="inq-name" className={labelBase}>Your name *</label>
          <input id="inq-name" type="text" autoComplete="name" placeholder="e.g. John Smith" value={form.name} onChange={set('name')} disabled={loading} className={fieldBase} />
        </div>
        <div>
          <label htmlFor="inq-email" className={labelBase}>Email *</label>
          <input id="inq-email" type="email" autoComplete="email" placeholder="john@example.com" value={form.email} onChange={set('email')} disabled={loading} className={fieldBase} />
        </div>
        <div>
          <label htmlFor="inq-phone" className={labelBase}>Phone (optional)</label>
          <input id="inq-phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} disabled={loading} className={fieldBase} />
        </div>
        <div>
          <label htmlFor="inq-msg" className={labelBase}>Message *</label>
          <textarea
            id="inq-msg"
            rows={4}
            placeholder="I'm interested in this property, please contact me."
            value={form.message}
            onChange={set('message')}
            disabled={loading}
            className={`${fieldBase} resize-y`}
          />
        </div>

        {status === 'error' && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`group relative inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#000000] py-2.5 pl-6 pr-2.5 text-[15px] text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#000000] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] ${focusRing} disabled:cursor-not-allowed disabled:opacity-70`}
        >
          <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100" />
          <span className="relative z-10">{loading ? 'Sending…' : 'Send inquiry'}</span>
          <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#000000] transition-all duration-500 group-hover:bg-none group-hover:bg-[#000000] group-hover:text-[#F5D77A]">
            {loading ? (
              <Loader2 size={17} className="animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight size={16} className="transition-transform duration-500 group-hover:-rotate-45" aria-hidden="true" />
            )}
          </span>
        </button>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------
   SMALL PIECES
---------------------------------------------------------------- */
// Badges sit on top of the gallery image, so they need to stay readable on photos
const TYPE_BADGE = {
  buy: 'bg-[#000000]/85 text-[#F5D77A] ring-1 ring-[#D4AF37]/50 backdrop-blur',
  sell: `${goldBg} text-[#000000] shadow-md`,
  rent: 'bg-white/95 text-[#000000] shadow-md',
};

function PriceCard({ property, price, perSqft, propertyId, as: Heading = 'h2', className = '' }) {
  const priceWords = numberToWords(property.price);
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-[#000000] p-6 text-[#FAF9F6] shadow-[0_28px_60px_-28px_rgba(0,0,0,0.7)] ring-1 ring-[#D4AF37]/30 sm:p-7 ${className}`}
    >
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[#D4AF37]/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-24 h-48 w-48 rounded-full bg-[#F5D77A]/10 blur-3xl" />

      <Heading className="relative text-2xl leading-tight sm:text-3xl">{property.title}</Heading>
      <span aria-hidden="true" className={`relative mt-4 block h-[3px] w-14 rounded-full ${goldBg}`} />

      <p className="relative mt-5 font-sans text-sm text-[#FAF9F6]/60">
        {property.type === 'rent' ? 'Monthly rent' : 'Price'}
      </p>

      <p className="relative mt-1 bg-gradient-to-r from-[#F5D77A] via-[#FFCD39] to-[#F5D77A] bg-clip-text text-4xl leading-tight text-transparent sm:text-5xl">
        ₹{price}
        {property.type === 'rent' && (
          <span className="font-sans text-base text-[#FAF9F6]/60"> /mo</span>
        )}
      </p>

      {priceWords && (
        <p className="relative mt-2 font-sans text-[13px] leading-snug text-[#FAF9F6]/70">
          {priceWords} Rupees{property.type === 'rent' ? ' per month' : ' only'}
        </p>
      )}

      {perSqft && (
        <p className="relative mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#FAF9F6]/10 px-3 py-1 font-sans text-xs text-[#FAF9F6]/80">
          <Ruler size={12} className="text-[#F5D77A]" aria-hidden="true" />
          ₹{perSqft} / sq ft
        </p>
      )}

      <span aria-hidden="true" className="relative mt-5 block h-px w-full bg-gradient-to-r from-[#D4AF37]/60 via-[#D4AF37]/20 to-transparent" />

      <div className="relative mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={scrollToInquiry}
          className={`group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 font-sans text-sm text-[#000000] shadow-[0_10px_26px_-10px_rgba(255,205,57,0.7)] transition hover:brightness-105 ${goldBg} ${focusRing}`}
        >
          Send inquiry
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
        {/* <SaveButton propertyId={propertyId} dark iconOnly /> */}
      </div>
    </div>
  );
}

function Section({ title, children, className = '' }) {
  return (
    <section className={`${card} p-6 sm:p-8 ${className}`}>
      <h2 className="text-2xl">{title}</h2>
      <span aria-hidden="true" className={`mt-3 block h-[3px] w-14 rounded-full ${goldBg}`} />
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TagSection({ title, icon: Icon, items }) {
  return (
    <Section title={title} className="mt-6">
      <ul className="flex flex-wrap gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#F3F0E8]/70 px-4 py-2 font-sans text-sm text-[#000000] transition hover:border-[#D4AF37] hover:bg-[#F5D77A]/25"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#000000] text-[#F5D77A]">
              <Icon size={11} aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl animate-pulse gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="aspect-[16/10] rounded-3xl bg-[#52685B]/15" />
        <div className="mt-6 h-8 w-2/3 rounded-full bg-[#52685B]/15" />
        <div className="mt-3 h-4 w-1/3 rounded-full bg-[#52685B]/10" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-[#52685B]/10" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-40 rounded-3xl bg-[#52685B]/10" />
        <div className="h-96 rounded-3xl bg-[#52685B]/10" />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center px-6 py-28 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#B8902F] ring-1 ring-[#D4AF37]/40">
        <SearchX size={34} strokeWidth={1.3} aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-3xl text-[#000000]">Property not found</h1>
      <span aria-hidden="true" className={`mt-4 block h-[3px] w-14 rounded-full ${goldBg}`} />
      <p className="mt-4 max-w-sm font-sans text-sm text-[#52685B]">
        This property does not exist or has been removed.
      </p>
      <Link
        href="/properties"
        className={`mt-7 inline-flex items-center gap-2 rounded-full bg-[#000000] px-6 py-3 font-sans text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition hover:bg-[#52685B] ${focusRing}`}
      >
        <ChevronLeft size={16} aria-hidden="true" /> Back to properties
      </Link>
    </div>
  );
}

/* ---------------------------------------------------------------
   PAGE
---------------------------------------------------------------- */
export default function PropertyDetailPage() {
  const { id } = useParams();
  const reduce = useReducedMotion();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [options, setOptions] = useState(null);

  // Dropdown labels from backend (value -> label mapping)
  useEffect(() => {
    fetch('/api/properties/options')
      .then((r) => r.json())
      .then(setOptions)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setProperty(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const shell = `${marcellus.variable} min-h-screen bg-[#F3F0E8] font-[family-name:var(--font-marcellus)] font-normal text-[#000000]`;

  if (loading) return <div className={shell}><LoadingSkeleton /></div>;
  if (notFound || !property) return <div className={shell}><NotFound /></div>;

  const priceNum = Number(property.price);
  const price = Number.isFinite(priceNum) ? formatPriceShort(priceNum) : property.price;
  const perSqft =
    property.area && Number.isFinite(priceNum)
      ? Math.round(priceNum / Number(property.area)).toLocaleString('en-IN')
      : null;
  const images = property.images || [];
  const isActive = property.status === 'active';

  // value -> label (from backend options), fallback to raw value
  const label = (group, value) => options?.[group]?.find((o) => o.value === value)?.label || value;

  // Headline numbers shown right under the title
  const keyStats = [
    property.bedrooms && { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms },
    property.bathrooms && { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    property.area && { icon: Ruler, label: 'Area', value: `${property.area} sq ft` },
  ].filter(Boolean);

  // Everything else goes in the overview list
  const facts = [
    property.balcony != null && { icon: DoorOpen, label: 'Balconies', value: property.balcony },
    property.total_floors != null && { icon: Layers, label: 'Total floors', value: property.total_floors },
    property.property_type && { icon: Building2, label: 'Property type', value: property.property_type },
    property.type && { icon: Tag, label: 'Listing', value: `For ${property.type}` },
    property.transaction_type && { icon: Repeat, label: 'Transaction type', value: label('transaction_type', property.transaction_type) },
    property.age_of_property && { icon: Calendar, label: 'Age of property', value: label('age_of_property', property.age_of_property) },
    property.furnishing && { icon: Sofa, label: 'Furnishing', value: label('furnishing', property.furnishing) },
    property.parking && { icon: Car, label: 'Parking', value: label('parking', property.parking) },
    property.facing && { icon: Compass, label: 'Facing', value: label('facing', property.facing) },
    property.construction_type && { icon: Hammer, label: 'Construction', value: label('construction_type', property.construction_type) },
  ].filter(Boolean);

  const highlights = property.property_highlights || [];
  const amenities = property.amenities || [];
  const landmarks = property.nearby_landmarks || [];

  // Badges that sit on top of the main image
  const badges = (
    <>
      {property.type && (
        <span className={`rounded-full px-3.5 py-1.5 text-xs capitalize ${TYPE_BADGE[property.type] || TYPE_BADGE.rent}`}>
          For {property.type}
        </span>
      )}
      {property.status && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs capitalize shadow-md ${
            isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-600' : 'bg-red-500'}`} />
          {isActive ? 'Available' : property.status}
        </span>
      )}
    </>
  );

  return (
    <div className={shell}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-7xl px-5 pb-32 pt-8 sm:px-8 lg:pb-20"
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 font-sans text-[13px] text-[#52685B]">
          <Link href="/" className="transition hover:text-[#000000]">Home</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <Link href="/properties" className="transition hover:text-[#000000]">Properties</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page" className="line-clamp-1 text-[#000000]">{property.title}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          {/* ===== LEFT ===== */}
          <div className="min-w-0">
            <ImageGallery images={images} title={property.title} overlay={badges} />

            {/* Title block */}
            <div className="mt-8">
              <p className="inline-flex items-start gap-2 rounded-full border border-[#D4AF37]/30 bg-white px-4 py-2 font-sans text-[15px] text-[#52685B]">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#B8902F]" aria-hidden="true" />
                <span>
                  {property.location}
                  {property.city ? `, ${property.city}` : ''}
                </span>
              </p>
            </div>

            {/* Price (mobile / tablet) */}
            <PriceCard
              property={property}
              price={price}
              perSqft={perSqft}
              propertyId={id}
              className="mt-6 lg:hidden"
            />

            {/* Key stats */}
            {keyStats.length > 0 && (
              <ul
                className={`${card} mt-6 grid divide-x divide-[#000000]/10 overflow-hidden`}
                style={{ gridTemplateColumns: `repeat(${keyStats.length}, minmax(0, 1fr))` }}
              >
                {keyStats.map(({ icon: Icon, label: l, value }) => (
                  <li key={l} className="flex flex-col items-center gap-2 px-2 py-6 text-center sm:flex-row sm:justify-center sm:gap-4 sm:text-left">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#000000] text-[#F5D77A] ring-1 ring-[#D4AF37]/50">
                      <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-2xl leading-tight">{value}</span>
                      <span className="block font-sans text-xs text-[#52685B]">{l}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Overview */}
            {facts.length > 0 && (
              <Section title="Overview" className="mt-6">
                <dl className="grid gap-3 sm:grid-cols-2">
                  {facts.map(({ icon: Icon, label: l, value }) => (
                    <div
                      key={l}
                      className="flex items-center gap-3 rounded-2xl border border-[#000000]/5 bg-[#F3F0E8]/60 px-4 py-3.5 transition hover:border-[#D4AF37]/50 hover:bg-[#F3F0E8]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#B8902F] ring-1 ring-[#D4AF37]/30">
                        <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                      </span>
                      <dt className="flex-1 font-sans text-sm text-[#52685B]">{l}</dt>
                      <dd className="text-right text-[15px] capitalize">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            )}

            {/* Description */}
            {property.description && (
              <Section title="About this property" className="mt-6">
                <p className="max-w-[72ch] whitespace-pre-line font-sans text-[15px] leading-[1.85] text-[#000000]/85">
                  {property.description}
                </p>
              </Section>
            )}

            {highlights.length > 0 && <TagSection title="Property highlights" icon={Sparkles} items={highlights} />}
            {amenities.length > 0 && <TagSection title="Amenities" icon={Check} items={amenities} />}
            {landmarks.length > 0 && <TagSection title="Nearby landmarks" icon={Landmark} items={landmarks} />}
          </div>

          {/* ===== RIGHT ===== */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
            <PriceCard
              property={property}
              price={price}
              perSqft={perSqft}
              propertyId={id}
              as="h1"
              className="hidden lg:block"
            />
            {!isActive && (
              <div role="status" className="flex items-start gap-2.5 rounded-3xl border border-red-200 bg-red-50 p-5 font-sans text-sm text-red-700">
                <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                <p>
                  This property is currently <strong className="capitalize">{property.status}</strong>. You can still
                  send an inquiry for similar properties.
                </p>
              </div>
            )}
            <div id="inquiry" className="scroll-mt-24">
              <InquiryForm propertyId={id} />
            </div>
          </aside>
        </div>
      </motion.div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#D4AF37]/30 bg-[#000000]/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <p className="text-2xl leading-tight text-[#F5D77A]">
            ₹{price}
            {property.type === 'rent' && <span className="font-sans text-xs text-[#FAF9F6]/60"> /mo</span>}
          </p>
          <div className="flex items-center gap-2.5">
            {/* <SaveButton propertyId={id} dark iconOnly /> */}
            <button
              type="button"
              onClick={scrollToInquiry}
              className={`inline-flex h-11 items-center gap-2 rounded-full px-5 font-sans text-sm text-[#000000] ${goldBg} ${focusRing}`}
            >
              Send inquiry <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}