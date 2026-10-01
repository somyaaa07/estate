'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Inbox,
  Plus,
  Tag,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';

/* ---------------------------------------------------------------
   ANIMATED NUMBER
---------------------------------------------------------------- */
function AnimatedNumber({ value }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    if (reduce || target === 0) {
      setDisplay(target);
      return;
    }
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplay(target);
        clearInterval(interval);
      } else {
        setDisplay(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [value, reduce]);

  return <>{display.toLocaleString('en-IN')}</>;
}

const Skeleton = ({ className = '' }) => (
  <span className={`block animate-pulse rounded-lg bg-[#52685B]/15 ${className}`} />
);

/* ---------------------------------------------------------------
   DASHBOARD
---------------------------------------------------------------- */
export default function AdminDashboard() {
  const reduce = useReducedMotion();
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    properties: 0,
    available: 0,
    sold: 0,
    inquiries: 0,
    users: 0,
    newInquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      })
      .then((data) => setStats((p) => ({ ...p, ...data })))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const firstName = session?.user?.name?.split(' ')[0];

  const total = Number(stats.properties) || 0;
  const availablePct = total ? Math.round((stats.available / total) * 100) : 0;
  const soldPct = total ? Math.round((stats.sold / total) * 100) : 0;

  const actions = [
    { label: 'Add a property', hint: 'Create a new listing', href: '/admin/properties/add', icon: Plus },
    { label: 'Manage properties', hint: 'Edit or remove listings', href: '/admin/properties', icon: Building2 },
    { label: 'Review inquiries', hint: 'Reply to your clients', href: '/admin/inquiries', icon: Inbox },
  ];

  const enter = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  });

  return (
    <div className={`${marcellus.className} font-normal text-[#1A2A22]`}>
      {/* ── Header ── */}
      <motion.header
        {...enter()}
        className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-3xl leading-tight sm:text-4xl">
            {firstName ? `Welcome back, ${firstName}` : 'Dashboard'}
          </h1>
          <span aria-hidden="true" className={`mt-4 block h-[3px] w-14 rounded-full ${goldBg}`} />
          <p className="mt-4 font-sans text-sm text-[#52685B]">
            A quick look at your listings and inquiries.
          </p>
        </div>

        <Link
          href="/admin/properties/add"
          className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2 pl-6 pr-2 text-[15px] text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
          <span className="relative z-10">Add a property</span>
          <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
            <Plus size={17} aria-hidden="true" />
          </span>
        </Link>
      </motion.header>

      {error && (
        <p
          role="alert"
          className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
          Could not load the latest numbers. Please refresh the page.
        </p>
      )}

      {/* ── Top row: portfolio + inquiries ── */}
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:gap-6">
        {/* Portfolio */}
        <motion.section
          {...enter(0.1)}
          aria-labelledby="portfolio"
          className="relative overflow-hidden rounded-3xl bg-[#1A2A22] p-6 text-[#FAF9F6] sm:p-8"
        >
          <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl"
          />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h2 id="portfolio" className="font-sans text-sm text-[#FAF9F6]/70">
                Total properties
              </h2>
              {loading ? (
                <Skeleton className="mt-3 h-14 w-28 !bg-[#FAF9F6]/10" />
              ) : (
                <p className="mt-2 text-6xl leading-none sm:text-7xl">
                  <AnimatedNumber value={stats.properties} />
                </p>
              )}
            </div>
            <Link
              href="/admin/properties"
              aria-label="Open all properties"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#F5D77A] transition hover:bg-[#D4AF37]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D77A]"
            >
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>

          {/* Split bar */}
          <div className="relative mt-8">
            <div
              className="flex h-3 w-full overflow-hidden rounded-full bg-[#FAF9F6]/10"
              role="img"
              aria-label={`${stats.available} available, ${stats.sold} sold or rented, out of ${total} properties`}
            >
              <motion.span
                className={`h-full ${goldBg}`}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: loading ? 0 : `${availablePct}%` }}
                transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
              />
              <motion.span
                className="h-full bg-[#FAF9F6]/70"
                initial={reduce ? false : { width: 0 }}
                animate={{ width: loading ? 0 : `${soldPct}%` }}
                transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
              />
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#FAF9F6]/10 bg-[#FAF9F6]/[0.04] p-4">
                <dt className="flex items-center gap-2 font-sans text-sm text-[#FAF9F6]/70">
                  <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${goldBg}`} />
                  <CheckCircle2 size={15} className="text-[#F5D77A]" aria-hidden="true" />
                  Available
                </dt>
                <dd className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl leading-none">
                    {loading ? '–' : <AnimatedNumber value={stats.available} />}
                  </span>
                  {!loading && total > 0 && (
                    <span className="font-sans text-xs text-[#FAF9F6]/50">{availablePct}%</span>
                  )}
                </dd>
              </div>
              <div className="rounded-2xl border border-[#FAF9F6]/10 bg-[#FAF9F6]/[0.04] p-4">
                <dt className="flex items-center gap-2 font-sans text-sm text-[#FAF9F6]/70">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#FAF9F6]/70" />
                  <Tag size={15} className="text-[#F5D77A]" aria-hidden="true" />
                  Sold / Rented
                </dt>
                <dd className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl leading-none">
                    {loading ? '–' : <AnimatedNumber value={stats.sold} />}
                  </span>
                  {!loading && total > 0 && (
                    <span className="font-sans text-xs text-[#FAF9F6]/50">{soldPct}%</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </motion.section>

        {/* Inquiries */}
        <motion.section
          {...enter(0.2)}
          aria-labelledby="inquiries"
          className="relative flex flex-col overflow-hidden rounded-3xl border border-[#1A2A22]/10 bg-white p-6 sm:p-8"
        >
          <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />

          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A2A22] text-[#F5D77A]">
              <Inbox size={22} strokeWidth={1.6} aria-hidden="true" />
            </span>
            {stats.newInquiries > 0 && (
              <span className="rounded-full bg-red-600 px-2.5 py-1 font-sans text-[11px] font-semibold text-white">
                {stats.newInquiries} new
              </span>
            )}
          </div>

          <h2 id="inquiries" className="mt-6 font-sans text-sm text-[#52685B]">
            Inquiries
          </h2>
          {loading ? (
            <Skeleton className="mt-2 h-12 w-20" />
          ) : (
            <p className="mt-1 text-5xl leading-none">
              <AnimatedNumber value={stats.inquiries} />
            </p>
          )}

          <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-[#52685B]">
            {loading
              ? ''
              : stats.newInquiries > 0
              ? `${stats.newInquiries.toLocaleString('en-IN')} ${
                  stats.newInquiries === 1 ? 'inquiry is' : 'inquiries are'
                } waiting for a reply. Quick responses help you win more clients.`
              : 'You are all caught up. New inquiries will show up here as soon as they arrive.'}
          </p>

          <Link
            href="/admin/inquiries"
            className="group mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-gradient-to-br from-[#F5D77A] via-[#D4AF37] to-[#A67C1E] py-2 pl-6 pr-2 font-sans text-sm text-[#1A2A22] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            View inquiries
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A2A22] text-[#F5D77A]">
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:-rotate-45"
                aria-hidden="true"
              />
            </span>
          </Link>
        </motion.section>
      </div>

      {/* ── Quick actions ── */}
      <motion.section {...enter(0.3)} aria-labelledby="quick-actions" className="mt-8">
        <h2 id="quick-actions" className="text-xl sm:text-2xl">
          Quick actions
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {actions.map(({ label, hint, href, icon: Icon }) => (
            <li key={label} className="list-none">
              <Link
                href={href}
                className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-[#1A2A22]/10 bg-white p-4 transition duration-300 hover:border-[#D4AF37]/60 hover:shadow-[0_18px_40px_-18px_rgba(26,42,34,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${goldBg}`}
                />
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1A2A22]/[0.06] text-[#1A2A22] transition group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] leading-tight">{label}</span>
                  <span className="mt-0.5 block font-sans text-xs text-[#52685B]">{hint}</span>
                </span>
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="text-[#52685B]/50 transition group-hover:translate-x-1 group-hover:text-[#B8902F]"
                />
              </Link>
            </li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
}