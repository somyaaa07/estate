"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Marcellus, Jost } from "next/font/google";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import EnquiryModal from "@/component/EnquiryModal";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "All Properties", href: "/properties" },
  { label: "Buy", href: "/properties?type=buy" },
  { label: "Sell", href: "/properties?type=sell" },
  { label: "Rent", href: "/properties?type=rent" },
  { label: "Contact", href: "/contact" },
];

/* ---------- Logo ---------- */
function Logo() {
  return (
    <Link
      href="/"
      aria-label="Estate – Home"
      className="flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52685B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f6]"
    >
      <img
        src="/uploads/logo.png"
        alt="Estate"
        className="h-28 w-auto object-contain sm:h-30"
      />
    </Link>
  );
}

/* ---------- Main ---------- */
function NavbarInner() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  // Automatically open enquiry modal after 2 minutes
useEffect(() => {
  const timer = setTimeout(() => {
    setIsEnquiryOpen(true);
  },  2000);

  return () => clearTimeout(timer);
}, []);



  const isAdmin = session?.user?.role?.toLowerCase() === "admin";
  const allLinks = isAdmin
    ? [...links, { label: "Admin", href: "/admin" }]
    : links;
  const firstName = session?.user?.name?.split(" ")[0];
  const initial = session?.user?.name?.charAt(0).toUpperCase();

  // Active state (handles ?type=buy/sell/rent)
  const isActive = (href) => {
    const [path, query] = href.split("?");
    if (path === "/") return pathname === "/";
    if (query) {
      const [k, v] = query.split("=");
      return pathname === path && searchParams.get(k) === v;
    }
    if (path === "/properties")
      return pathname.startsWith(path) && !searchParams.get("type");
    return pathname === path || pathname.startsWith(path + "/");
  };

  // Close menu on route change
  useEffect(() => setOpen(false), [pathname, searchParams]);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + Esc to close
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52685B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f6]";

  const logoutBtn = (extra = "") => (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#1a2a22]/15 px-4 py-2 text-sm font-medium text-[#52685B] transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 ${focusRing} ${extra}`}
    >
      <FiLogOut size={15} aria-hidden="true" />
      Logout
    </button>
  );

  const dashboardChip = (extra = "") => (
    <Link
      href={isAdmin ? "/admin" : "/dashboard"}
      className={`inline-flex items-center gap-2 rounded-lg bg-[#f3f0E8] px-3.5 py-2 text-sm font-medium text-[#1a2a22] transition hover:bg-[#1a2a22]/10 ${focusRing} ${extra}`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2a22] text-xs font-bold text-[#faf9f6]">
        {initial}
      </span>
      <span className="truncate">{firstName}</span>
    </Link>
  );

  return (
    <header
      className={`${jost.className} sticky top-0 z-50 border-b border-[#1a2a22]/10 bg-[#faf9f6]/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_4px_20px_-10px_rgba(26,42,34,0.25)]" : ""
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8"
      >
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {allLinks.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b-2 py-1 text-sm transition-colors ${focusRing} ${
                    active
                      ? "border-[#1a2a22] font-semibold text-[#1a2a22]"
                      : "border-transparent font-normal text-[#52685B] hover:text-[#1a2a22]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <button
            type="button"
            onClick={() => setIsEnquiryOpen(true)}
            className={`rounded-lg bg-[#1a2a22] px-5 py-2.5 text-sm font-medium text-[#faf9f6] transition hover:bg-[#52685b] ${focusRing}`}
          >
            Enquiry Now
          </button>
          {session && (
            <>
              {dashboardChip("max-w-[160px]")}
              {logoutBtn()}
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={`flex h-11 w-11 items-center justify-center rounded-lg border border-[#1a2a22]/15 text-[#1a2a22] transition hover:bg-[#f3f0E8] lg:hidden ${focusRing}`}
        >
          {open ? (
            <FiX size={22} aria-hidden="true" />
          ) : (
            <FiMenu size={22} aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-x-0 bottom-0 top-16 bg-[#1a2a22]/40 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-[#1a2a22]/10 bg-[#faf9f6] shadow-xl lg:hidden"
            >
              <ul className="mx-auto max-w-7xl space-y-1 px-4 pb-2 pt-4 sm:px-6">
                {allLinks.map(({ label, href }) => {
                  const active = isActive(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-base transition ${focusRing} ${
                          active
                            ? "bg-[#f3f0E8] font-semibold text-[#1a2a22]"
                            : "font-normal text-[#52685B] hover:bg-[#f3f0E8]/70 hover:text-[#1a2a22]"
                        }`}
                      >
                        {label}
                        {active && (
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-[#1a2a22]"
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="px-4 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setIsEnquiryOpen(true);
                  }}
                  className="w-full rounded-lg bg-[#1a2a22] px-5 py-3 text-sm font-medium text-[#faf9f6] transition hover:bg-[#52685b]"
                >
                  Enquiry Now
                </button>
              </div>

              {session && (
                <div className="mx-auto max-w-7xl border-t border-[#1a2a22]/10 px-4 pb-6 pt-4 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {dashboardChip("flex-1 justify-center py-3")}
                    {logoutBtn("flex-1 py-3")}
                  </div>
                </div>
              )}

              {!session && <div className="pb-4" />}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Enquiry Modal */}
      <EnquiryModal
        open={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </header>
  );
}

/* useSearchParams needs a Suspense boundary in the App Router */
export default function Navbar() {
  return (
    <Suspense
      fallback={
        <div className="sticky top-0 z-50 h-16 border-b border-[#1a2a22]/10 bg-[#faf9f6] lg:h-[72px]" />
      }
    >
      <NavbarInner />
    </Suspense>
  );
}
