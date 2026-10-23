"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Marcellus } from "next/font/google";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

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
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: "easeOut" }}
      className="relative z-10 flex min-h-[110px] items-center gap-4 rounded-[18px] border border-[#000000]/10 bg-[#FFFFFF] px-5 py-4 transition duration-300 hover:border-[#D4AF37]/70 hover:shadow-[0_12px_30px_-14px_rgba(0,0,0,0.3)] sm:gap-5 sm:px-7 lg:h-[140px] lg:gap-5 lg:px-8"
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
  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: "easeOut" }}
      className="group flex flex-col items-center text-center"
    >
      <div className="aspect-square w-full overflow-hidden rounded-[24px] border-2 border-transparent bg-[#E5E5E5] shadow-[0_14px_36px_-18px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out group-hover:rounded-full group-hover:border-[#D4AF37] group-hover:shadow-[0_20px_44px_-16px_rgba(212,175,55,0.55)]">
        <TeamPhoto
          name={person.name}
          photo={person.photo}
          index={index + 3}
          className="h-full w-full object-cover grayscale transition duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <h3 className="mt-5 font-[family-name:var(--font-marcellus)] text-[20px] font-normal leading-tight text-[#000000] sm:text-[22px]">
        {person.name}
      </h3>
      <p className="mt-1.5 max-w-[280px] font-[family-name:var(--font-marcellus)] text-[14px] leading-snug text-[#6B6B6B] sm:text-[15px]">
        {person.role}
      </p>
      <span
        aria-hidden="true"
        className="mt-3 block h-[2px] w-0 rounded-full bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] transition-all duration-500 group-hover:w-12"
      />
    </motion.li>
  );
}

export default function TeamSection({ founder, teamMembers = [], leadership }) {
  // Pass your own `leadership` array, or it uses founder + team members
  const leaders = leadership || [founder, ...teamMembers].filter(Boolean);

  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className={`${marcellus.variable} bg-[#FAF9F6] px-4 py-14 sm:px-6 lg:py-20`}
    >
      <div className="mx-auto max-w-[1100px]">
        {/* ============ PEOPLE BEHIND BRINGO ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
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
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
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
