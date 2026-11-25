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
      {
        label: "Buy",
        desc: "Homes & plots for sale",
        href: "/properties?type=buy",
        icon: FiHome,
      },
      {
        label: "Rent",
        desc: "Properties available to rent",
        href: "/properties?type=rent",
        icon: FiKey,
      },
      {
        label: "Sell",
        desc: "List your property with us",
        href: "/properties/sell",
        icon: FiTag,
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const ring =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A10D] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

/* Removes the grey tap flash and double-tap zoom delay on touch devices */
const touch = "touch-manipulation [-webkit-tap-highlight-color:transparent]";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

/* FIX: the old logo used h-35 (140px) inside a 56px bar. Now sized per breakpoint. */
function Logo({ small }) {
  return (
    <Link
      href="/"
      aria-label="Estate – Home"
      className={`shrink-0 rounded-lg ${touch} ${ring}`}
    >
      <img
        src="/uploads/logo.png"
        alt="Estate"
        className={`w-auto max-w-[140px] object-contain transition-all duration-300 sm:max-w-none ${
          small ? "h-25 sm:h-25 lg:h-30" : "h-25 sm:h-25 lg:h-30"
        }`}
      />
    </Link>
  );
}

function RowLabel({ active, children }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
          active ? "scale-100 bg-[#E2A10D]" : "scale-0 bg-transparent"
        }`}
      />
      {children}
    </span>
  );
}

/* ───────────────────────── Desktop dropdown ───────────────────────── */
function DesktopDropdown({
  label,
  href,
  active,
  items,
  isActive,
  linkClass,
  underline,
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(null);
  const timer = useRef(null);

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

  return (
    <li
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) closeSoon();
      }}
      onKeyDown={(e) => e.key === "Escape" && setShow(false)}
    >
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        aria-haspopup="true"
        aria-expanded={show}
        className={linkClass}
      >
        {label}
        <motion.span
          aria-hidden="true"
          animate={{ rotate: show ? 180 : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 26 }
          }
          className={`inline-flex ${show ? "text-[#E2A10D]" : ""}`}
        >
          <FiChevronDown size={16} />
        </motion.span>
        {active && underline}
      </Link>

      <AnimatePresence>
        {show && (
          <motion.div
            style={{ x: "-50%", transformOrigin: "top center" }}
            initial={
              reduce
                ? false
                : { opacity: 0, y: -12, scale: 0.94, filter: "blur(6px)" }
            }
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: -8,
                    scale: 0.97,
                    filter: "blur(4px)",
                    transition: { duration: 0.16 },
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 30, mass: 0.8 }
            }
            className="absolute left-1/2 top-full z-50 pt-4"
          >
            <div className="relative w-[320px] rounded-2xl border border-white/15 bg-neutral-950/95 p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(224,192,122,0.08)] backdrop-blur-xl">
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
                    <motion.li
                      key={c.href}
                      variants={itemVariants}
                      className="relative"
                    >
                      {hot && (
                        <motion.span
                          layoutId="dd-hover"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/15 to-white/5"
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 500, damping: 38 }
                          }
                        />
                      )}
                      <Link
                        href={c.href}
                        aria-current={ca ? "page" : undefined}
                        onMouseEnter={() => setHovered(c.href)}
                        onFocus={() => setHovered(c.href)}
                        className={`relative z-10 flex items-center gap-3.5 rounded-xl px-3 py-3 ${ring}`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[#E2A10D] transition-colors duration-200">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-base leading-tight ${
                              ca
                                ? "font-extrabold text-[#E2A10D]"
                                : "font-bold text-white"
                            }`}
                          >
                            {c.label}
                          </span>
                          <span className="mt-0.5 block text-sm font-medium text-[#d9d4c4]">
                            {c.desc}
                          </span>
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
  const panelRef = useRef(null);

  const isAdmin = session?.user?.role?.toLowerCase() === "admin";
  const allLinks = isAdmin
    ? [...links, { label: "Admin", href: "/admin" }]
    : links;
  const firstName = session?.user?.name?.split(" ")[0];
  const initial = session?.user?.name?.charAt(0).toUpperCase();

  const isActive = (href) => {
    const [path, query] = href.split("?");
    if (path === "/") return pathname === "/";
    if (query) {
      const [k, v] = query.split("=");
      return pathname === path && searchParams.get(k) === v;
    }
    if (path === "/properties")
      return pathname === path && !searchParams.get("type");
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

  /* Scroll lock, Escape to close, auto-close when resizing/rotating to desktop */
  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      document.body.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
      panelRef.current?.focus();
    }
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      html.style.overscrollBehavior = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const desktopLink = (active) =>
    `relative inline-flex items-center gap-1.5 py-2 text-base tracking-wide transition-colors ${ring} ${
      active
        ? "font-bold text-white"
        : "font-semibold text-[#f1ede2] hover:text-[#E2A10D]"
    }`;

  const underline = (
    <motion.span
      layoutId="nav-underline"
      className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-[#E2A10D]"
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    />
  );

  /* Mobile row: 48px touch target (WCAG / Apple HIG recommend 44px+), 16px text */
  const mobileRow = (active, size = "text-base") =>
    `flex min-h-[48px] items-center justify-between rounded-xl px-4 ${size} transition active:bg-white/10 ${touch} ${ring} ${
      active
        ? "bg-white/[0.07] font-bold text-[#E2A10D]"
        : "font-semibold text-white hover:bg-white/10"
    }`;

  const logoutBtn = (extra = "") => (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/50 px-4 py-2.5 text-sm font-bold text-white transition hover:border-red-400 hover:bg-red-500/20 hover:text-red-200 ${touch} ${ring} ${extra}`}
    >
      <FiLogOut size={16} aria-hidden="true" /> Logout
    </button>
  );

  const dashboardChip = (extra = "") => (
    <Link
      href={isAdmin ? "/admin" : "/dashboard"}
      className={`inline-flex items-center gap-2 rounded-lg bg-white/15 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-white/25 ${touch} ${ring} ${extra}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E2A10D] text-xs font-extrabold text-black">
        {initial}
      </span>
      <span className="truncate">{firstName}</span>
    </Link>
  );

  const enquiryBtn = (extra = "", onClick = () => setEnquiry(true)) => (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] font-extrabold tracking-wide text-black shadow-lg shadow-[#E2A10D]/20 transition hover:bg-white active:scale-[0.98] ${touch} ${ring} ${extra}`}
    >
      Enquire Now
      <FiArrowRight
        className="transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      />
    </button>
  );

  return (
    <>
      <header
        className={`${jost.className} sticky top-0 z-50 overflow-x-clip border-b border-white/20 bg-black/95 pt-[env(safe-area-inset-top)] backdrop-blur transition-shadow ${
          scrolled ? "shadow-[0_8px_28px_-10px_rgba(0,0,0,0.9)]" : ""
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 transition-all duration-300 min-[400px]:px-4 sm:gap-4 sm:px-6 lg:h-20 lg:px-8"
        >
          <Logo small={scrolled} />

          {/* Desktop links */}
          <ul className="hidden items-center gap-6 lg:flex xl:gap-11">
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
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={desktopLink(active)}
                  >
                    {label}
                    {active && underline}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {enquiryBtn("px-5 py-3 text-sm xl:px-6")}
            {session && (
              <>
                {!isAdmin && dashboardChip("max-w-[170px]")}
                {logoutBtn()}
              </>
            )}
          </div>

          {/* Mobile / tablet right side: quick Enquire (sm+) + menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
        
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/50 text-white transition hover:bg-white/10 active:bg-white/20 ${touch} ${ring}`}
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
                  {open ? (
                    <FiX size={22} aria-hidden="true" />
                  ) : (
                    <FiMenu size={22} aria-hidden="true" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Mobile drawer over a dimmed overlay */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="overlay"
              aria-hidden="true"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full h-[calc(100dvh-3.5rem-env(safe-area-inset-top))] bg-black/70 backdrop-blur-[2px] lg:hidden"
            />
          )}
          {open && (
            <motion.div
              key="panel"
              id="mobile-menu"
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-label="Menu"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              /* swipe right to dismiss */
              drag={reduce ? false : "x"}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80 || info.velocity.x > 500) setOpen(false);
              }}
              className="absolute right-0 top-full flex h-[calc(100dvh-3.5rem-env(safe-area-inset-top))] w-[88%] max-w-sm flex-col border-l border-white/15 bg-black outline-none sm:w-[360px]"
            >
              <motion.ul
                variants={listVariants}
                initial={reduce ? false : "hidden"}
                animate="show"
                className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 pb-3 pt-3 min-[400px]:px-4"
              >
                {allLinks.map(({ label, href, children }) => {
                  if (children) {
                    const active = isParentActive(href);
                    return (
                      <motion.li key={href} variants={itemVariants}>
                        <div className="flex items-stretch gap-1.5">
                          <Link
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={`min-w-0 flex-1 ${mobileRow(active)}`}
                          >
                            <RowLabel active={active}>{label}</RowLabel>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setSubOpen((s) => !s)}
                            aria-expanded={subOpen}
                            aria-label={
                              subOpen
                                ? "Collapse property types"
                                : "Expand property types"
                            }
                            className={`flex w-12 shrink-0 items-center justify-center rounded-xl border text-white transition-colors ${touch} ${
                              subOpen
                                ? "border-[#E2A10D] text-[#E2A10D]"
                                : "border-white/40"
                            } ${ring}`}
                          >
                            <motion.span
                              animate={{ rotate: subOpen ? 180 : 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 26,
                              }}
                              className="flex"
                            >
                              <FiChevronDown size={20} aria-hidden="true" />
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
                                  height: {
                                    duration: 0.3,
                                    ease: [0.22, 1, 0.36, 1],
                                  },
                                  opacity: { duration: 0.2 },
                                  staggerChildren: 0.06,
                                  delayChildren: 0.05,
                                },
                              }}
                              exit={{
                                height: 0,
                                opacity: 0,
                                transition: {
                                  duration: 0.22,
                                  ease: [0.4, 0, 1, 1],
                                },
                              }}
                              className="ml-3 mt-1.5 space-y-1 overflow-hidden border-l-[3px] border-[#E2A10D] pl-2.5"
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
                                    transition={{
                                      duration: 0.25,
                                      ease: [0.22, 1, 0.36, 1],
                                    }}
                                  >
                                    <Link
                                      href={c.href}
                                      aria-current={ca ? "page" : undefined}
                                      className={`${mobileRow(ca, "text-[15px]")} py-2`}
                                    >
                                      <span className="flex min-w-0 items-center gap-3">
                                        <span
                                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                            ca
                                              ? "bg-[#E2A10D]/15 text-[#E2A10D]"
                                              : "bg-white/10 text-[#E2A10D]"
                                          }`}
                                        >
                                          <Icon size={16} aria-hidden="true" />
                                        </span>
                                        <span className="min-w-0">
                                          {c.label}
                                          <span
                                            className={`block text-xs font-medium leading-snug ${
                                              ca
                                                ? "text-[#E2A10D]/80"
                                                : "text-[#d9d4c4]"
                                            }`}
                                          >
                                            {c.desc}
                                          </span>
                                        </span>
                                      </span>
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
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={mobileRow(active)}
                      >
                        <RowLabel active={active}>{label}</RowLabel>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* Pinned footer; respects the iPhone home-indicator safe area */}
              <div className="space-y-2.5 border-t border-white/20 bg-black px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 min-[400px]:px-4">
                {session && (
                  <div className="grid grid-cols-2 gap-2">
                    {!isAdmin ? (
                      dashboardChip("min-h-[44px] justify-center")
                    ) : (
                      <span />
                    )}
                    {logoutBtn("min-h-[44px]")}
                  </div>
                )}
                {enquiryBtn("min-h-[48px] w-full px-5 text-base", () => {
                  setOpen(false);
                  setEnquiry(true);
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* FIX: modal lives outside <header>. The header's backdrop-blur creates a
          containing block that would trap any position:fixed modal inside the bar. */}
      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} />
    </>
  );
}

/* useSearchParams needs a Suspense boundary in the App Router */
export default function Navbar() {
  return (
    <Suspense
      fallback={
        <div className="sticky top-0 z-50 h-14 border-b border-white/20 bg-black lg:h-20" />
      }
    >
      <NavbarInner />
    </Suspense>
  );
}