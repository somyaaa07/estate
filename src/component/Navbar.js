"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Jost } from "next/font/google";
import { FiMenu, FiX, FiLogOut, FiChevronDown, FiArrowRight } from "react-icons/fi";
import EnquiryModal from "@/component/EnquiryModal";

const jost = Jost({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

/* Colours: white = active, #f1ede2 = inactive (high contrast), #e0c07a = gold accent */
const links = [
  { label: "Home", href: "/" },
  {
    label: "All Properties",
    href: "/properties",
    children: [
      { label: "Buy", desc: "Homes & plots for sale", href: "/properties?type=buy" },
      { label: "Rent", desc: "Properties available to rent", href: "/properties?type=rent" },
      { label: "Sell", desc: "List your property with us", href: "/properties/sell" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const ring =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e0c07a] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

function Logo({ small }) {
  return (
    <Link href="/" aria-label="Estate – Home" className={`shrink-0 rounded-lg ${ring}`}>
      <img
        src="/uploads/logo.png"
        alt="Estate"
        className={`w-auto object-contain transition-all duration-300 ${
          small ? "h-10 lg:h-35" : "h-35 lg:h-35"
        }`}
      />
    </Link>
  );
}

function NavbarInner() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [enquiry, setEnquiry] = useState(false);

  const isAdmin = session?.user?.role?.toLowerCase() === "admin";
  const allLinks = isAdmin ? [...links, { label: "Admin", href: "/admin" }] : links;
  const firstName = session?.user?.name?.split(" ")[0];
  const initial = session?.user?.name?.charAt(0).toUpperCase();

  const isActive = (href) => {
    const [path, query] = href.split("?");
    if (path === "/") return pathname === "/";
    if (query) {
      const [k, v] = query.split("=");
      return pathname === path && searchParams.get(k) === v;
    }
    if (path === "/properties") return pathname === path && !searchParams.get("type");
    return pathname === path || pathname.startsWith(path + "/");
  };
  const isParentActive = (href) => pathname.startsWith(href);

  // Close on navigation, auto-expand submenu on property pages
  useEffect(() => {
    setOpen(false);
    setSubOpen(pathname.startsWith("/properties"));
  }, [pathname, searchParams]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const desktopLink = (active) =>
    `relative inline-flex items-center gap-1.5 py-2 text-base tracking-wide transition-colors ${ring} ${
      active ? "font-bold text-white" : "font-semibold text-[#f1ede2] hover:text-[#e0c07a]"
    }`;

  const underline = (
    <motion.span
      layoutId="nav-underline"
      className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-[#e0c07a]"
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    />
  );

  const mobileRow = (active) =>
    `flex min-h-[56px] items-center justify-between rounded-xl px-4 text-xl transition ${ring} ${
      active ? "bg-[#e0c07a] font-extrabold text-black" : "font-bold text-white hover:bg-white/10"
    }`;

  const logoutBtn = (extra = "") => (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/50 px-4 py-2.5 text-sm font-bold text-white transition hover:border-red-400 hover:bg-red-500/20 hover:text-red-200 ${ring} ${extra}`}
    >
      <FiLogOut size={16} aria-hidden="true" /> Logout
    </button>
  );

  const dashboardChip = (extra = "") => (
    <Link
      href={isAdmin ? "/admin" : "/dashboard"}
      className={`inline-flex items-center gap-2 rounded-lg bg-white/15 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-white/25 ${ring} ${extra}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e0c07a] text-xs font-extrabold text-black">
        {initial}
      </span>
      <span className="truncate">{firstName}</span>
    </Link>
  );

  const enquiryBtn = (extra = "", onClick = () => setEnquiry(true)) => (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] font-extrabold tracking-wide text-black shadow-lg shadow-[#e0c07a]/20 transition hover:bg-white active:scale-[0.98] ${ring} ${extra}`}
    >
      Enquiry Now
      <FiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </button>
  );

  return (
    <header
      className={`${jost.className} sticky top-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_8px_28px_-10px_rgba(0,0,0,0.9)]" : ""
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "h-16" : "h-16 lg:h-20"
        }`}
      >
        <Logo small={scrolled} />

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 lg:flex xl:gap-11">
          {allLinks.map(({ label, href, children }) => {
            const active = children ? isParentActive(href) : isActive(href);
            if (children) {
              return (
                <li key={href} className="group relative">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup="true"
                    className={desktopLink(active)}
                  >
                    {label}
                    <FiChevronDown
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                    />
                    {active && underline}
                  </Link>

                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="w-[280px] overflow-hidden rounded-2xl border border-white/25 bg-black p-2 shadow-2xl">
                      {children.map((c) => {
                        const ca = isActive(c.href);
                        return (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              aria-current={ca ? "page" : undefined}
                              className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors ${ring} ${
                                ca ? "bg-white/15" : "hover:bg-white/10"
                              }`}
                            >
                              <span>
                                <span className={`block text-base ${ca ? "font-extrabold text-[#e0c07a]" : "font-bold text-white"}`}>
                                  {c.label}
                                </span>
                                <span className="block text-sm font-medium text-[#d9d4c4]">{c.desc}</span>
                              </span>
                              <FiArrowRight className="shrink-0 text-[#e0c07a]" aria-hidden="true" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            }
            return (
              <li key={href}>
                <Link href={href} aria-current={active ? "page" : undefined} className={desktopLink(active)}>
                  {label}
                  {active && underline}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {enquiryBtn("px-6 py-3 text-sm")}
          {session && (
            <>
              {!isAdmin && dashboardChip("max-w-[170px]")}
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
          className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white/50 text-white transition hover:bg-white/10 lg:hidden ${ring}`}
        >
          {open ? <FiX size={26} aria-hidden="true" /> : <FiMenu size={26} aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu: full-height panel, Enquiry button pinned at the bottom */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-16 flex flex-col bg-black lg:hidden"
          >
            <ul className="flex-1 space-y-1.5 overflow-y-auto px-4 pb-4 pt-5 sm:px-6">
              {allLinks.map(({ label, href, children }) => {
                if (children) {
                  const active = isParentActive(href);
                  return (
                    <li key={href}>
                      <div className="flex items-stretch gap-1.5">
                        <Link href={href} aria-current={active ? "page" : undefined} className={`flex-1 ${mobileRow(active)}`}>
                          {label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSubOpen((s) => !s)}
                          aria-expanded={subOpen}
                          aria-label={subOpen ? "Collapse property types" : "Expand property types"}
                          className={`flex w-14 items-center justify-center rounded-xl border-2 border-white/40 text-white ${ring}`}
                        >
                          <FiChevronDown size={22} aria-hidden="true" className={`transition-transform duration-200 ${subOpen ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {subOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3 mt-1.5 space-y-1.5 overflow-hidden border-l-[3px] border-[#e0c07a] pl-3"
                          >
                            {children.map((c) => {
                              const ca = isActive(c.href);
                              return (
                                <li key={c.href}>
                                  <Link href={c.href} aria-current={ca ? "page" : undefined} className={mobileRow(ca).replace("text-xl", "text-lg")}>
                                    <span>
                                      {c.label}
                                      <span className={`block text-sm font-medium ${ca ? "text-black/80" : "text-[#d9d4c4]"}`}>{c.desc}</span>
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link href={href} aria-current={active ? "page" : undefined} className={mobileRow(active)}>
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-3 border-t border-white/20 bg-black px-4 pb-6 pt-4 sm:px-6">
              {session && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  {!isAdmin && dashboardChip("flex-1 justify-center py-3")}
                  {logoutBtn("flex-1 py-3")}
                </div>
              )}
              {enquiryBtn("w-full px-5 py-4 text-lg", () => {
                setOpen(false);
                setEnquiry(true);
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} />
    </header>
  );
}

/* useSearchParams needs a Suspense boundary in the App Router */
export default function Navbar() {
  return (
    <Suspense fallback={<div className="sticky top-0 z-50 h-16 border-b border-white/20 bg-black lg:h-20" />}>
      <NavbarInner />
    </Suspense>
  );
}