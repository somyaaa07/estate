'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  Building2,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
];

const isActive = (pathname, href) =>
  href === '/admin'
    ? pathname === '/admin'
    : pathname === href || pathname.startsWith(href + '/');

/* ---------------------------------------------------------------
   BRAND MARK
---------------------------------------------------------------- */
function BrandMark({ size = 40 }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-xl bg-[#1A2A22] text-[#F5D77A] ring-1 ring-[#D4AF37]/50"
    >
      <Building2 size={size * 0.5} strokeWidth={1.5} />
    </span>
  );
}

/* ---------------------------------------------------------------
   SIDEBAR
---------------------------------------------------------------- */
function SidebarContent({ pathname, user, onNavigate }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'A';

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#1A2A22] text-[#FAF9F6]">
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
      

      {/* Brand */}
      <div className="relative px-6 pb-6 pt-8">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          <BrandMark />
          <span className="min-w-0">
            <span className={`${marcellus.className} block text-xl leading-tight`}>
              Bringo Real Estates
            </span>
            <span className="mt-0.5 block font-sans text-xs text-[#F5D77A]">Admin panel</span>
          </span>
        </Link>
      </div>

      <div aria-hidden="true" className="mx-6 h-px bg-[#D4AF37]/20" />

      {/* Navigation */}
      <nav aria-label="Admin navigation" className="relative flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-1.5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                    active
                      ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#FAF9F6]/[0.04] text-[#FAF9F6] ring-1 ring-[#D4AF37]/30'
                      : 'text-[#FAF9F6]/60 hover:bg-[#FAF9F6]/5 hover:text-[#FAF9F6]'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                      active
                        ? 'bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22]'
                        : 'bg-[#FAF9F6]/5 group-hover:text-[#F5D77A]'
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className={marcellus.className}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-[#FAF9F6]/15 px-4 py-3 font-sans text-sm text-[#FAF9F6]/60 transition hover:border-[#D4AF37]/50 hover:text-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
        >
          <ExternalLink size={16} strokeWidth={1.7} aria-hidden="true" />
          View website
        </Link>
      </nav>

      {/* User + logout */}
      <div className="relative p-4">
        <div className="rounded-2xl border border-[#FAF9F6]/10 bg-[#FAF9F6]/[0.04] p-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={`${marcellus.className} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base text-[#1A2A22] ${goldBg}`}
            >
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{user?.name || 'Admin'}</p>
              {user?.email && (
                <p className="truncate font-sans text-xs text-[#FAF9F6]/50">{user.email}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              aria-label="Log out"
              title="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#FAF9F6]/60 transition hover:bg-red-500/15 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              <LogOut size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   STATUS SCREEN (loading / redirecting)
---------------------------------------------------------------- */
function StatusScreen({ text, reduce }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#FAF9F6]">
      <motion.span
        animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A2A22] text-[#F5D77A] ring-1 ring-[#D4AF37]/50"
      >
        <Building2 size={26} strokeWidth={1.5} aria-hidden="true" />
      </motion.span>
      <p role="status" className={`${marcellus.className} text-base text-[#52685B]`}>
        {text}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------
   ADMIN LAYOUT
---------------------------------------------------------------- */
export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Login and signup pages render without the admin shell
  const isAdminLoginPage = pathname === '/admin/login' || pathname === '/admin/signup';

  // Lowercase so "admin" and "ADMIN" both work
  const userRole = session?.user?.role?.toLowerCase();
  const isAdmin = status === 'authenticated' && userRole === 'admin';

  /* Auth redirect */
  useEffect(() => {
    if (isAdminLoginPage || status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
      return;
    }
    if (status === 'authenticated' && userRole !== 'admin') {
      router.replace('/admin/login');
    }
  }, [status, userRole, router, isAdminLoginPage]);

  /* Close drawer on route change */
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  /* Drawer: lock scroll + close with Escape */
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  if (isAdminLoginPage) return <>{children}</>;
  if (status === 'loading') return <StatusScreen text="Loading your workspace…" reduce={reduce} />;
  if (!isAdmin) return <StatusScreen text="Redirecting to login…" reduce={reduce} />;

  const user = session.user;
  const currentPage = navLinks.find((l) => isActive(pathname, l.href))?.label || 'Admin';
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A2A22] lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent pathname={pathname} user={user} />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#1A2A22]/10 bg-[#FAF9F6]/95 px-4 py-3 backdrop-blur lg:hidden">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            <BrandMark size={34} />
            <span className={`${marcellus.className} text-lg`}>
              Bringo <span className="text-[#B8902F]">Admin</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1A2A22]/15 bg-white transition hover:bg-[#F3F0E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </header>

        {/* Desktop top bar */}
        <div className="sticky top-0 z-30 hidden items-center justify-between border-b border-[#1A2A22]/10 bg-[#FAF9F6]/90 px-10 py-4 backdrop-blur lg:flex">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className={`h-6 w-[3px] rounded-full ${goldBg}`} />
            <p className={`${marcellus.className} text-lg`}>{currentPage}</p>
          </div>
          <div className="flex items-center gap-5 font-sans text-sm text-[#52685B]">
            <span>{today}</span>
            <span className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#1A2A22]">
              <ShieldCheck size={14} className="text-[#B8902F]" aria-hidden="true" />
              Admin
            </span>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <div
              className="fixed inset-0 z-50 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Admin menu"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDrawerOpen(false)}
                className="absolute inset-0 bg-[#1A2A22]/60 backdrop-blur-[2px]"
                aria-hidden="true"
              />
              <motion.div
                initial={reduce ? { opacity: 0 } : { x: '-100%' }}
                animate={reduce ? { opacity: 1 } : { x: 0 }}
                exit={reduce ? { opacity: 0 } : { x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 w-80 max-w-[88vw] shadow-2xl"
              >
                <SidebarContent
                  pathname={pathname}
                  user={user}
                  onNavigate={() => setDrawerOpen(false)}
                />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="absolute right-3 top-4 flex h-10 w-10 items-center justify-center rounded-full text-[#FAF9F6]/70 transition hover:bg-[#FAF9F6]/10 hover:text-[#FAF9F6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <motion.main
          key={pathname}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="px-4 py-8 sm:px-8 lg:px-10 lg:py-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}