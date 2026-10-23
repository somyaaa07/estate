"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Jost } from "next/font/google";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiArrowRight,
  FiHome,
  FiKey,
  FiTag,
} from "react-icons/fi";
import EnquiryModal from "@/component/EnquiryModal";

const jost = Jost({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

/* Colours: white = active, #f1ede2 = inactive (high contrast), #E2A10D = gold accent */
const links = [
  { label: "Home", href: "/" },
  {
    label: "All Properties",
    href: "/properties",
    children: [
      { label: "Buy", desc: "Homes & plots for sale", href: "/properties?type=buy", icon: FiHome },
      { label: "Rent", desc: "Properties available to rent", href: "/properties?type=rent", icon: FiKey },
      { label: "Sell", desc: "List your property with us", href: "/properties/sell", icon: FiTag },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const ring =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A10D] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};

/* Logo scales with the screen: 320px phones -> 4K monitors.
   Tweak the heights below if your logo file needs more/less room. */
function Logo({ small }) {
  return (
    <Link href="/" aria-label="Estate – Home" className={`shrink-0 rounded-lg ${ring}`}>
      <img
        src="/uploads/logo.png"
        alt="Estate"
        className={`w-auto max-w-[44vw] object-contain transition-all duration-300 sm:max-w-none ${
          small
            ? "h-30 sm:h-30 lg:h-30 xl:h-30"
            : "h-30 sm:h-30 lg:h-30 xl:h-30"
        }`}
      />
    </Link>
  );
}

/* ───────────────────────── Desktop dropdown ───────────────────────── */
function DesktopDropdown({ label, href, active, items, isActive, linkClass, underline }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(null);
  const timer = useRef(null);
  const wrapRef = useRef(null);

  const openNow = () => {
    clearTimeout(timer.current);
    setShow(true);
  };
  const closeSoon = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setShow(false);
      setHovered(null);
    }, 140);
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => setShow(false), [pathname]);

  // Touch devices (iPad landscape, touch laptops): tap outside closes the dropdown
  useEffect(() => {
    if (!show) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShow(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [show]);

  return (
    <li
      ref={wrapRef}
      className="relative flex items-center"
      // Hover only for real mouse pointers; touch uses the chevron button below
      onPointerEnter={(e) => e.pointerType === "mouse" && openNow()}
      onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
      onFocus={(e) => e.target.matches(":focus-visible") && openNow()}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) closeSoon();
      }}
      onKeyDown={(e) => e.key === "Escape" && setShow(false)}
    >
      <Link href={href} aria-current={active ? "page" : undefined} className={linkClass}>
        {label}
        {active && underline}
      </Link>

      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-haspopup="true"
        aria-expanded={show}
        aria-label={`${show ? "Close" : "Open"} ${label} menu`}
        className={`-mr-1 ml-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#f1ede2] transition-colors hover:text-[#E2A10D] ${ring} ${
          show ? "text-[#E2A10D]" : ""
        }`}
      >
        <motion.span
          aria-hidden="true"
          animate={{ rotate: show ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 26 }}
          className="inline-flex"
        >
          <FiChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            style={{ x: "-50%", transformOrigin: "top center" }}
            initial={reduce ? false : { opacity: 0, y: -12, scale: 0.94, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.16 } }
            }
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30, mass: 0.8 }}
            className="absolute left-1/2 top-full z-50 pt-4"
          >
            <div className="relative w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-neutral-950/95 p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(224,192,122,0.08)] backdrop-blur-xl">
              <span
                aria-hidden="true"
                className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-white/15 bg-neutral-950"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#E2A10D] to-transparent"
              />

              <motion.ul
                variants={listVariants}
                initial={reduce ? false : "hidden"}
                animate="show"
                className="relative space-y-0.5"
                onMouseLeave={() => setHovered(null)}
              >
                {items.map((c) => {
                  const ca = isActive(c.href);
                  const hot = hovered === c.href;
                  const Icon = c.icon;
                  return (
                    <motion.li key={c.href} variants={itemVariants} className="relative">
                      {hot && (
                        <motion.span
                          layoutId="dd-hover"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/15 to-white/5"
                          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                        />
                      )}
                      <Link
                        href={c.href}
                        aria-current={ca ? "page" : undefined}
                        onMouseEnter={() => setHovered(c.href)}
                        onFocus={() => setHovered(c.href)}
                        className={`relative z-10 flex items-center gap-3.5 rounded-xl px-3 py-3 ${ring}`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[#E2A10D]">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-base leading-tight ${
                              ca ? "font-extrabold text-[#E2A10D]" : "font-bold text-white"
                            }`}
                          >
                            {c.label}
                          </span>
                          <span className="mt-0.5 block text-sm font-medium text-[#d9d4c4]">{c.desc}</span>
                        </span>
                        <motion.span
                          aria-hidden="true"
                          animate={{ x: hot ? 0 : -6, opacity: hot ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="shrink-0 text-[#E2A10D]"
                        >
                          <FiArrowRight size={18} />
                        </motion.span>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="mt-2 border-t border-white/10 px-1 pt-2"
              >
                <Link
                  href={href}
                  className={`group/all flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold text-[#f1ede2] transition-colors hover:text-[#E2A10D] ${ring}`}
                >
                  Browse all properties
                  <FiArrowRight
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/all:translate-x-1"
                  />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ───────────────────────── Navbar ───────────────────────── */
function NavbarInner() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
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

  /* Desktop link: tighter text at 1024px, roomier on wide screens */
  const desktopLink = (active) =>
    `relative inline-flex items-center gap-1.5 whitespace-nowrap py-2 text-[15px] tracking-wide transition-colors xl:text-base ${ring} ${
      active ? "font-bold text-white" : "font-semibold text-[#f1ede2] hover:text-[#E2A10D]"
    }`;

  const underline = (
    <motion.span
      layoutId="nav-underline"
      className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-[#E2A10D]"
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    />
  );

  /* Mobile rows: 48px min touch target on small phones, 56px from sm up */
  const mobileRow = (active) =>
    `flex min-h-[52px] items-center justify-between rounded-xl px-4 text-lg transition sm:min-h-[56px] sm:text-xl ${ring} ${
      active ? "bg-[#E2A10D] font-semibold text-black" : "font-semibold text-white hover:bg-white/10"
    }`;

  /* Below xl the label is hidden (icon only) so the action row never overflows */
  const logoutBtn = (extra = "", compact = false) => ( 
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      aria-label="Logout"
      className={`inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/50 text-sm font-semibold text-white transition lg:font-bold hover:border-red-400 hover:bg-red-500/20 hover:text-red-200 ${ring} ${
        compact ? "h-10 w-10 xl:h-auto xl:w-auto xl:px-4 xl:py-2.5" : "px-4 py-2.5"
      } ${extra}`}
    >
      <FiLogOut size={16} aria-hidden="true" />
      <span className={compact ? "hidden xl:inline" : ""}>Logout</span>
    </button>
  );

  const dashboardChip = (extra = "", compact = false) => (
    <Link
      href={isAdmin ? "/admin" : "/dashboard"}
      aria-label="Dashboard"
      className={`inline-flex items-center gap-2 rounded-lg bg-white/15 text-sm font-semibold text-white transition lg:font-bold hover:bg-white/25 ${ring} ${
        compact ? "p-1.5 xl:px-3.5 xl:py-2" : "px-3.5 py-2"
      } ${extra}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E2A10D] text-xs font-extrabold text-black">
        {initial}
      </span>
      <span className={`truncate ${compact ? "hidden xl:inline" : ""}`}>{firstName}</span>
    </Link>
  );

  const enquiryBtn = (extra = "", onClick = () => setEnquiry(true)) => (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] font-semibold tracking-wide text-black shadow-lg shadow-[#E2A10D]/20 transition lg:font-extrabold hover:bg-white active:scale-[0.98] ${ring} ${extra}`}
    >
      Enquiry Now
      <FiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </button>
  );

  return (
    <>
      <header
        className={`${jost.className} sticky top-0 z-50 border-b border-white/20 bg-black/95 pt-[env(safe-area-inset-top)] backdrop-blur transition-shadow ${
          scrolled ? "shadow-[0_8px_28px_-10px_rgba(0,0,0,0.9)]" : ""
        }`}
      >
        <nav
          aria-label="Main navigation"
          className={`mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 transition-all duration-300 min-[400px]:px-4 sm:gap-4 sm:px-6 lg:gap-5 lg:px-8 2xl:max-w-[1440px] ${
            scrolled ? "h-16" : "h-16 lg:h-20"
          }`}
        >
          <Logo small={scrolled} />

          {/* Desktop links (lg+). Gaps grow with the screen so 1024px never overflows */}
          <ul className="hidden items-center gap-4 lg:flex lg:gap-5 xl:gap-9 2xl:gap-11">
            {allLinks.map(({ label, href, children }) => {
              const active = children ? isParentActive(href) : isActive(href);
              if (children) {
                return (
                  <DesktopDropdown
                    key={href}
                    label={label}
                    href={href}
                    active={active}
                    items={children}
                    isActive={isActive}
                    linkClass={desktopLink(active)}
                    underline={underline}
                  />
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

          {/* Right side: tablet shows a compact Enquiry button next to the burger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 lg:flex xl:gap-3">
              {enquiryBtn("px-4 py-2.5 text-sm xl:px-6 xl:py-3")}
              {session && (
                <>
                  {!isAdmin && dashboardChip("max-w-[170px]", true)}
                  {logoutBtn("", true)}
                </>
              )}
            </div>

            {/* Tablet only (sm → lg): quick Enquiry access without opening the menu */}
            <div className="hidden sm:block lg:hidden">
              {enquiryBtn("px-4 py-2.5 text-sm")}
            </div>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-white/50 text-white transition hover:bg-white/10 sm:h-12 sm:w-12 lg:hidden ${ring}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="flex"
                >
                  {open ? <FiX size={24} aria-hidden="true" /> : <FiMenu size={24} aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu lives OUTSIDE the header on purpose: the header's backdrop-blur
          creates a containing block that would break `position: fixed` children. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`${jost.className} fixed inset-x-0 bottom-0 top-[calc(4rem+env(safe-area-inset-top))] z-40 flex flex-col bg-black lg:hidden`}
          >
            <motion.ul
              variants={listVariants}
              initial={reduce ? false : "hidden"}
              animate="show"
              className="mx-auto w-full max-w-2xl flex-1 space-y-1.5 overflow-y-auto overscroll-contain px-4 pb-4 pt-4 sm:px-6 sm:pt-5"
            >
              {allLinks.map(({ label, href, children }) => {
                if (children) {
                  const active = isParentActive(href);
                  return (
                    <motion.li key={href} variants={itemVariants}>
                      <div className="flex items-stretch gap-1.5">
                        <Link href={href} aria-current={active ? "page" : undefined} className={`flex-1 ${mobileRow(active)}`}>
                          {label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSubOpen((s) => !s)}
                          aria-expanded={subOpen}
                          aria-label={subOpen ? "Collapse property types" : "Expand property types"}
                          className={`flex w-12 items-center justify-center rounded-xl border-2 text-white transition-colors sm:w-2 ${
                            subOpen ? "border-[#E2A10D] text-[#E2A10D]" : "border-white/40"
                          } ${ring}`}
                        >
                          <motion.span
                            animate={{ rotate: subOpen ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 26 }}
                            className="flex"
                          >
                            <FiChevronDown size={22} aria-hidden="true" />
                          </motion.span>
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {subOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              transition: {
                                height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                                opacity: { duration: 0.2 },
                                staggerChildren: 0.06,
                                delayChildren: 0.05,
                              },
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
                            }}
                            className="ml-2 mt-1.5 space-y-1.5 overflow-hidden border-l-[3px] border-[#E2A10D] pl-2.5 sm:ml-3 sm:pl-3"
                          >
                            {children.map((c) => {
                              const ca = isActive(c.href);
                              const Icon = c.icon;
                              return (
                                <motion.li
                                  key={c.href}
                                  variants={{
                                    hidden: { opacity: 0, x: -14 },
                                    show: { opacity: 1, x: 0 },
                                  }}
                                  initial="hidden"
                                  animate="show"
                                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                >
                                  <Link
                                    href={c.href}
                                    aria-current={ca ? "page" : undefined}
                                    className={`${mobileRow(ca)} !text-base sm:!text-lg`}
                                  >
                                    <span className="flex min-w-0 items-center gap-3">
                                      <span
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${
                                          ca ? "bg-black/15 text-black" : "bg-white/10 text-[#E2A10D]"
                                        }`}
                                      >
                                        <Icon size={18} aria-hidden="true" />
                                      </span>
                                      <span className="min-w-0">
                                        {c.label}
                                        <span
                                          className={`block truncate text-[13px] font-medium sm:text-sm ${
                                            ca ? "text-black/80" : "text-[#d9d4c4]"
                                          }`}
                                        >
                                          {c.desc}
                                        </span>
                                      </span>
                                    </span>
                                    <FiArrowRight
                                      aria-hidden="true"
                                      className={`ml-2 shrink-0 ${ca ? "text-black" : "text-[#E2A10D]"}`}
                                    />
                                  </Link>
                                </motion.li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                }
                const active = isActive(href);
                return (
                  <motion.li key={href} variants={itemVariants}>
                    <Link href={href} aria-current={active ? "page" : undefined} className={mobileRow(active)}>
                      {label}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>

            {/* Pinned footer: respects iPhone home-indicator safe area */}
            <div className="border-t border-white/20 bg-black px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pt-4">
              <div className="mx-auto w-full max-w-2xl space-y-3">
                {session && (
                  <div className="flex flex-col gap-3 min-[420px]:flex-row">
                    {!isAdmin && dashboardChip("flex-1 justify-center py-3")}
                    {logoutBtn("flex-1 py-3")}
                  </div>
                )}
                {enquiryBtn("w-full px-5 py-3.5 text-base sm:py-4 sm:text-lg", () => {
                  setOpen(false);
                  setEnquiry(true);
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} />
    </>
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