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

/* Shared motion variants for staggered dropdown items */
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

function Logo({ small }) {
  return (
    <Link
      href="/"
      aria-label="Estate – Home"
      className={`shrink-0 rounded-lg ${ring}`}
    >
      <img
        src="/uploads/logo.png"
        alt="Estate"
        className={`w-auto object-contain transition-all duration-300 ${
          small ? "h-35 lg:h-35" : "h-35 lg:h-35"
        }`}
      />
    </Link>
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
  // Small close delay = forgiving hover (no flicker when the cursor crosses the gap)
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
              {/* caret notch pointing at the trigger */}
              <span
                aria-hidden="true"
                className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-white/15 bg-neutral-950"
              />
              {/* gold hairline along the top edge */}
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
                      {/* sliding hover highlight shared between rows */}
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

              {/* footer link */}
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

  const mobileRow = (active) =>
    `flex min-h-[42px] items-center justify-between rounded-lg px-3.5 text-[15px] transition ${ring} ${
      active
        ? "bg-[#E2A10D] font-bold text-black"
        : "font-semibold text-white hover:bg-white/10"
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
      className={`group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] font-extrabold tracking-wide text-black shadow-lg shadow-[#E2A10D]/20 transition hover:bg-white active:scale-[0.98] ${ring} ${extra}`}
    >
      Enquiry Now
      <FiArrowRight
        className="transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      />
    </button>
  );

  return (
    <header
      className={`${jost.className} sticky top-0 z-50 overflow-x-clip border-b border-white/20 bg-black/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_8px_28px_-10px_rgba(0,0,0,0.9)]" : ""
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "h-14 lg:h-16" : "h-14 lg:h-20"
        }`}
      >
        <Logo small={scrolled} />

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 lg:flex xl:gap-11">
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
          className={`flex h-10 w-10 items-center justify-center rounded-lg border border-white/50 text-white transition hover:bg-white/10 lg:hidden ${ring}`}
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
                <FiX size={20} aria-hidden="true" />
              ) : (
                <FiMenu size={20} aria-hidden="true" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile menu: right-to-left drawer over a dimmed overlay */}
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
            className="absolute inset-x-0 top-full h-[calc(100dvh-3.5rem)] bg-black/60 lg:hidden"
          />
        )}
        {open && (
          <motion.div
            key="panel"
            id="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full flex h-[calc(100dvh-3.5rem)] w-[82%] max-w-[320px] flex-col border-l border-white/15 bg-black lg:hidden"
          >
            <motion.ul
              variants={listVariants}
              initial={reduce ? false : "hidden"}
              animate="show"
              className="flex-1 space-y-1 overflow-y-auto px-4 pb-3 pt-3"
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
                          className={`flex-1 ${mobileRow(active)}`}
                        >
                          {label}
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
                          className={`flex w-10 items-center justify-center rounded-lg border text-white transition-colors ${
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
                            <FiChevronDown size={18} aria-hidden="true" />
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
                            className="ml-3 mt-1.5 space-y-1.5 overflow-hidden border-l-[3px] border-[#E2A10D] pl-3"
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
                                    className={mobileRow(ca).replace(
                                      "text-[15px]",
                                      "text-sm",
                                    )}
                                  >
                                    <span className="flex items-center gap-3">
                                      <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                          ca
                                            ? "bg-black/15 text-black"
                                            : "bg-white/10 text-[#E2A10D]"
                                        }`}
                                      >
                                        <Icon size={15} aria-hidden="true" />
                                      </span>
                                      <span>
                                        {c.label}
                                        <span
                                          className={`block text-xs font-medium ${
                                            ca
                                              ? "text-black/80"
                                              : "text-[#d9d4c4]"
                                          }`}
                                        >
                                          {c.desc}
                                        </span>
                                      </span>
                                    </span>
                                    <FiArrowRight
                                      aria-hidden="true"
                                      className={
                                        ca ? "text-black" : "text-[#E2A10D]"
                                      }
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
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={mobileRow(active)}
                    >
                      {label}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>

            <div className="space-y-2 border-t border-white/20 bg-black px-4 pb-4 pt-3">
              {session && (
                <div className="flex flex-col gap-2">
                  {!isAdmin && dashboardChip("justify-center py-2")}
                  {logoutBtn("py-2")}
                </div>
              )}
              {enquiryBtn("w-full px-5 py-2.5 text-sm", () => {
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
    <Suspense
      fallback={
        <div className="sticky top-0 z-50 h-14 border-b border-white/20 bg-black lg:h-20" />
      }
    >
      <NavbarInner />
    </Suspense>
  );
}