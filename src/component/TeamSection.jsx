"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Marcellus } from "next/font/google";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

/* One shared, silky ease-out curve (expo-style) used for every motion */
const EASE = [0.22, 1, 0.36, 1];

/*
  Scroll-reveal props, with reduced-motion support.
  - Only animates opacity + transform (GPU friendly)
  - Triggers a bit before the element hits the viewport edge
*/
function useReveal(y = 24, x = 0) {
  const reduce = useReducedMotion();
  return (delay = 0, duration = 0.9) => ({
    initial: reduce ? false : { opacity: 0, y, x },
    whileInView: { opacity: 1, y: 0, x: 0 },
    viewport: { once: true, margin: "0px 0px -12% 0px" },
    transition: { duration, delay, ease: EASE },
  });
}

/* Random placeholder portrait (fixed per index, so no hydration mismatch) */
const placeholder = (index) =>
  `https://randomuser.me/api/portraits/${index % 2 === 0 ? "men" : "women"}/${(index * 7 + 3) % 90}.jpg`;

/* Photo: real image -> random placeholder -> initials */
function TeamPhoto({ name = "", photo, index = 0, className = "" }) {
  const [stage, setStage] = useState(0); // 0 = real, 1 = placeholder, 2 = initials

  const initials = name
    .replace("Ms. ", "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const sources = [photo || placeholder(index), placeholder(index)];

  if (stage >= 2) {
    return (
      <div
        aria-label={name}
        className="flex h-full w-full items-center justify-center bg-[#000000] text-[28px] text-[#F5D77A]"
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      key={stage}
      src={sources[stage]}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setStage((s) => s + 1)}
      className={className}
    />
  );
}

/* Round avatar with thin gold ring */
function Avatar({ name, photo, index, large = false }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border-2 border-[#D4AF37] bg-[#E5E5E5] ${
        large
          ? "h-[80px] w-[80px] sm:h-[96px] sm:w-[96px] lg:h-[104px] lg:w-[104px]"
          : "h-[72px] w-[72px] sm:h-[88px] sm:w-[88px] lg:h-[96px] lg:w-[96px]"
      }`}
    >
      <TeamPhoto
        name={name}
        photo={photo}
        index={index}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function MemberCard({ member, index }) {
  const reveal = useReveal(28);
  return (
    <motion.li
      {...reveal((index % 2) * 0.12)}
      /* NOTE: only border-color + box-shadow are CSS-transitioned.
         A plain `transition` also transitions opacity/transform and
         fights with Framer Motion, which was the main cause of jank. */
      className="relative z-10 flex min-h-[110px] items-center gap-4 rounded-[18px] border border-[#000000]/10 bg-[#FFFFFF] px-5 py-4 transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#D4AF37]/70 hover:shadow-[0_12px_30px_-14px_rgba(0,0,0,0.3)] sm:gap-5 sm:px-7 lg:h-[140px] lg:gap-5 lg:px-8"
    >
      <Avatar name={member.name} photo={member.photo} index={index + 1} />

      <div className="min-w-0">
        <h3 className="font-[family-name:var(--font-marcellus)] text-[17px] font-normal leading-tight text-[#000000] sm:text-[19px] lg:text-[20px]">
          {member.name}
        </h3>
        <p className="mt-1 font-[family-name:var(--font-marcellus)] text-[13px] leading-snug text-[#6B6B6B] sm:text-[14px]">
          {member.role}
        </p>
      </div>
    </motion.li>
  );
}

/* Leadership card: big square photo -> circle on hover */
function LeaderCard({ person, index }) {
  const reveal = useReveal(32);
  return (
    <motion.li
      {...reveal((index % 3) * 0.12)}
      className="group flex flex-col items-center text-center"
    >
      {/*
        Smooth square -> circle:
        - radius goes 12% -> 50% (both percentages, so it interpolates
          linearly the whole way). The old 24px -> 9999px jumped at the
          very end because 9999px is clamped by the browser.
        - only the properties that change are transitioned (no transition-all)
        - transform-gpu + isolate keep the clipped image on its own layer
      */}
      <div className="aspect-square w-full transform-gpu overflow-hidden rounded-[12%] border-2 border-transparent bg-[#E5E5E5] shadow-[0_14px_36px_-18px_rgba(0,0,0,0.35)] isolate transition-[border-radius,border-color,box-shadow] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rounded-[50%] group-hover:border-[#D4AF37] group-hover:shadow-[0_20px_44px_-16px_rgba(212,175,55,0.55)]">
        <TeamPhoto
          name={person.name}
          photo={person.photo}
          index={index + 3}
          className="h-full w-full transform-gpu object-cover grayscale will-change-transform transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
        />
      </div>

      <h3 className="mt-5 font-[family-name:var(--font-marcellus)] text-[20px] font-normal leading-tight text-[#000000] sm:text-[22px]">
        {person.name}
      </h3>
      <p className="mt-1.5 max-w-[280px] font-[family-name:var(--font-marcellus)] text-[14px] leading-snug text-[#6B6B6B] sm:text-[15px]">
        {person.role}
      </p>
      {/* scaleX instead of width: animates on the GPU, no layout thrash */}
      <span
        aria-hidden="true"
        className="mt-3 block h-[2px] w-12 origin-center scale-x-0 rounded-full bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
    </motion.li>
  );
}

/* =====================================================================
   FOUNDER SECTION (separate section, place it anywhere on the page)

   Usage:
   <FounderSection
     founder={{
       name: "Your Name",
       role: "Founder & CEO",
       photo: "/team/founder.jpg",
       bio: ["First paragraph...", "Second paragraph..."], // string or array
       quote: "A short line in the founder's own words.",
       socials: [
         { label: "LinkedIn", href: "https://linkedin.com/in/..." },
         { label: "Instagram", href: "https://instagram.com/..." },
       ],
     }}
   />
   ===================================================================== */
export function FounderSection({ founder }) {
  const revealPhoto = useReveal(0, -40);
  const revealText = useReveal(0, 40);
  const revealQuote = useReveal(20);

  if (!founder) return null;

  const paragraphs = Array.isArray(founder.bio)
    ? founder.bio
    : founder.bio
      ? [founder.bio]
      : [];

  return (
    <section
      id="founder"
      aria-labelledby="founder-title"
      className={`${marcellus.variable} bg-[#FFFFFF] px-4 py-14 sm:px-6 lg:py-24`}
    >
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-20">
        {/* ---------- Photo with offset gold frame ---------- */}
        <motion.div
          {...revealPhoto(0, 1)}
          className="relative mx-auto w-full max-w-[420px] lg:max-w-none"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 -right-4 h-full w-full rounded-[24px] border-2 border-[#D4AF37] sm:-bottom-5 sm:-right-5"
          />
          <div className="group relative isolate aspect-[4/5] transform-gpu overflow-hidden rounded-[24px] bg-[#E5E5E5] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)]">
            <TeamPhoto
              name={founder.name}
              photo={founder.photo}
              index={0}
              className="h-full w-full transform-gpu object-cover grayscale will-change-transform transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
            />
          </div>
        </motion.div>

        {/* ---------- Text ---------- */}
        <motion.div {...revealText(0.1, 1)} className="text-center lg:text-left">
          <h2
            id="founder-title"
            className="font-[family-name:var(--font-marcellus)] text-[32px] font-normal leading-tight text-[#000000] sm:text-[42px] lg:text-[48px]"
          >
            Meet the Founder
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-4 block h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] lg:mx-0"
          />

          <h3 className="mt-8 font-[family-name:var(--font-marcellus)] text-[24px] font-normal leading-tight text-[#000000] sm:text-[28px]">
            {founder.name}
          </h3>
          <p className="mt-1.5 font-[family-name:var(--font-marcellus)] text-[15px] leading-snug text-[#B8860B] sm:text-[16px]">
            {founder.role}
          </p>

          {paragraphs.length > 0 && (
            <div className="mx-auto mt-6 max-w-[560px] space-y-4 font-[family-name:var(--font-marcellus)] text-[15px] leading-[1.75] text-[#4A4A4A] sm:text-[16px] lg:mx-0">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {founder.quote && (
            <motion.blockquote
              {...revealQuote(0.2, 0.9)}
              className="mx-auto mt-8 max-w-[560px] border-[#D4AF37] font-[family-name:var(--font-marcellus)] text-[18px] leading-snug text-[#000000] sm:text-[20px] lg:mx-0 lg:border-l-[3px] lg:pl-5"
            >
              &ldquo;{founder.quote}&rdquo;
            </motion.blockquote>
          )}

          {/* {founder.socials?.length > 0 && (
            <ul className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {founder.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-[#000000]/15 px-5 py-2 font-[family-name:var(--font-marcellus)] text-[14px] text-[#000000] transition-[border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#D4AF37] hover:bg-[#FAF9F6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )} */}
        </motion.div>
      </div>
    </section>
  );
}

export default function TeamSection({ founder, teamMembers = [], leadership }) {
  const revealTitle = useReveal(20);
  const revealFounder = useReveal(28);
  const revealLeadTitle = useReveal(20);

  // Pass your own `leadership` array, or it uses founder + team members
  const leaders = leadership || [founder, ...teamMembers].filter(Boolean);

  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className={`${marcellus.variable} bg-[#FAF9F6] px-4 py-14 sm:px-6 lg:py-20`}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* ============ PEOPLE BEHIND BRINGO ============ */}
        <motion.div {...revealTitle(0, 1)} className="text-center">
          <h2
            id="team-title"
            className="font-[family-name:var(--font-marcellus)] text-[32px] font-normal leading-tight text-[#000000] sm:text-[42px] lg:text-[48px]"
          >
            The People Behind Bringo
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-4 block h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]"
          />
        </motion.div>

        <div className="relative mt-10 lg:mt-12">
          {/* Gold bracket (desktop only) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[10px] left-[6.3%] right-[6.3%] top-[70px] z-0 hidden rounded-t-[40px] border-2 border-[#D4AF37] lg:block"
          />

          {/* Founder */}
          {founder && (
            <motion.article
              {...revealFounder(0, 1)}
              className="relative z-10 mx-auto flex min-h-[110px] w-full items-center gap-4 rounded-[18px] bg-[#000000] px-5 py-4 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)] sm:gap-5 sm:px-7 lg:h-[140px] lg:w-[40%] lg:px-8"
            >
              <Avatar
                name={founder.name}
                photo={founder.photo}
                index={0}
                large
              />

              <div className="min-w-0">
                <h3 className="font-[family-name:var(--font-marcellus)] text-[19px] font-normal leading-tight text-[#FAF9F6] sm:text-[22px] lg:text-[24px]">
                  {founder.name}
                </h3>
                <p className="mt-1 font-[family-name:var(--font-marcellus)] text-[13px] leading-snug text-[#F5D77A] sm:text-[14px]">
                  {founder.role}
                </p>
              </div>
            </motion.article>
          )}

          {/* One shared grid: both columns stay aligned */}
          <ul className="mt-6 grid grid-cols-1 gap-5 lg:mt-8 lg:grid-cols-2 lg:gap-x-[20%] lg:gap-y-8">
            {teamMembers.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} />
            ))}
          </ul>
        </div>

        {/* ============ LEADERSHIP TEAM (bottom of team) ============ */}
        <div
          className="mt-20 lg:mt-28"
          aria-labelledby="leadership-title"
          role="region"
        >
          <motion.div {...revealLeadTitle(0, 1)} className="text-center">
            <h2
              id="leadership-title"
              className="font-[family-name:var(--font-marcellus)] text-[32px] font-normal leading-tight text-[#000000] sm:text-[42px] lg:text-[48px]"
            >
              Leadership Team
            </h2>
            <span
              aria-hidden="true"
              className="mx-auto mt-4 block h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]"
            />
          </motion.div>

          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {leaders.map((person, i) => (
              <LeaderCard key={person.name} person={person} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}