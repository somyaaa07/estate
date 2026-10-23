// "use client";
// import Link from "next/link";
// import { motion, useReducedMotion } from "framer-motion";
// import { Marcellus } from "next/font/google";
// import {
//   FiArrowRight,
//   FiAward,
//   FiCheck,
//   FiHome,
//   FiMapPin,
//   FiUsers,
// } from "react-icons/fi";

// const marcellus = Marcellus({
//   subsets: ["latin"],
//   weight: "400",
//   display: "swap",
// });
// const serif = `${marcellus.className} font-normal`;

// /* ---------------- DATA ---------------- */
// const ABOUT_IMAGE = {
//   src: "/banner/about.webp",
//   alt: "Luxury living room with floor-to-ceiling windows",
// };

// const points = [
//   "Wide range of residential & commercial properties",
//   "Expert market insights and personalized guidance",
//   "Transparent process with verified listings",
//   "Dedicated support from search to settlement",
// ];

// // "Years of Experience" image badge me hai, isliye yahan 3 stats
// // const stats = [
// //   { icon: FiHome, value: "500+", label: "Properties Listed" },
// //   { icon: FiUsers, value: "300+", label: "Happy Clients" },
// //   { icon: FiMapPin, value: "10+", label: "Cities Covered" },
// // ];

// const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

// /* ---------------- BUTTON (same as About / Home hero) ---------------- */
// const BtnDark = ({ href, children }) => (
//   <Link
//     href={href}
//     className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#000000] py-2.5 pl-6 pr-2.5 text-sm font-normal text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#000000] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
//   >
//     <span
//       aria-hidden="true"
//       className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] transition-transform duration-500 ease-out group-hover:scale-x-100"
//     />
//     <span
//       aria-hidden="true"
//       className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
//     />
//     <span className="relative z-10">{children}</span>
//     <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] text-[#000000] transition-all duration-500 group-hover:bg-none group-hover:bg-[#000000] group-hover:text-[#F5D77A]">
//       <FiArrowRight
//         size={14}
//         className="transition-transform duration-500 group-hover:-rotate-45"
//         aria-hidden="true"
//       />
//     </span>
//   </Link>
// );

// /* ---------------- COMPONENT ---------------- */
// export default function AboutSection() {
//   const reduce = useReducedMotion();

//   const reveal = (delay = 0) => ({
//     initial: reduce ? false : { opacity: 0, y: 24 },
//     whileInView: { opacity: 1, y: 0 },
//     viewport: { once: true, margin: "-60px" },
//     transition: { duration: 0.65, delay, ease: "easeOut" },
//   });

//   return (
//     <section
//       className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-24"
//       aria-labelledby="about-heading"
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
//           {/* ===== Image side ===== */}
//           <motion.div
//             {...reveal()}
//             className="relative order-2 min-w-0 lg:order-1"
//           >
//             {/* offset gold frame */}
//             <span
//               aria-hidden="true"
//               className="absolute -left-3 -top-3 hidden h-full w-full rounded-t-[220px] rounded-b-3xl border border-[#D4AF37]/50 lg:block"
//             />
//             <div
//               className="relative
//               w-[98%] sm:w-[80%] md:w-[98%] lg:w-full
//               aspect-[4/3.5] md:aspect-[4/3.8] lg:aspect-[4/4.4]
//               mx-auto lg:mx-0
//               overflow-hidden rounded-3xl bg-[#f3f0E8]
//               shadow-[0_25px_60px_-30px_rgba(26,42,34,0.5)]
//               lg:rounded-b-3xl lg:rounded-t-[220px]"
//             >
//               <img
//                 src="https://i.pinimg.com/736x/df/4f/3c/df4f3cff511a1ba9edb0de5023b8f683.jpg"
//                 alt={ABOUT_IMAGE.alt}
//                 loading="lazy"
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#000000]/40 to-transparent" />
//             </div>

//             {/* Experience badge */}
//             <div className="absolute -bottom-6 right-4 flex items-center gap-4 rounded-2xl bg-[#000000] px-6 py-4 text-[#faf9f6] shadow-xl ring-1 ring-[#D4AF37]/40 sm:right-8 lg:-right-6">
//               <FiAward
//                 size={26}
//                 className="text-[#F5D77A]"
//                 aria-hidden="true"
//               />
//               <div>
//                 <p className={`${serif} text-3xl leading-none text-[#F5D77A]`}>
//                   3+
//                 </p>
//                 <p className="mt-1 text-xs text-[#faf9f6]/75">
//                   Years of Experience
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           {/* ===== Text side ===== */}
//           <motion.div {...reveal(0.1)} className="order-1 min-w-0 lg:order-2">
//             <h2
//               id="about-heading"
//               className={`${serif} text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.1] tracking-tight text-[#000000]`}
//             >
//               Why Choose to Bringo
//             </h2>
//             <span
//               aria-hidden="true"
//               className={`mt-5 block h-[3px] w-16 rounded-full ${goldBg}`}
//             />

//             <p className="mt-6 max-w-xl text-base leading-relaxed text-[#52685B]">
//               Bringo Real Estate Services is committed to making property
//               decisions simple, transparent and rewarding. Whether you are
//               looking for your dream home, a commercial space, or a smart
//               investment, our expert team is here to guide you at every step.
//             </p>

//             <ul className="mt-7 space-y-3.5">
//               {points.map((point) => (
//                 <li key={point} className="flex items-start gap-3">
//                   <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#000000] text-[#F5D77A]">
//                     <FiCheck size={13} strokeWidth={3} aria-hidden="true" />
//                   </span>
//                   <span className="text-base text-[#000000]">{point}</span>
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-9">
//               <BtnDark href="/about">Learn More About Us</BtnDark>
//             </div>
//           </motion.div>
//         </div>

//         {/* ===== Stats band ===== */}
//         {/* <motion.dl
//           {...reveal()}
//           className="relative mt-20 grid grid-cols-1 overflow-hidden rounded-3xl bg-[#000000] px-6 py-8 text-[#faf9f6] sm:grid-cols-3 sm:px-4 lg:mt-24"
//         >
//           <span
//             aria-hidden="true"
//             className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`}
//           />
//           {stats.map(({ icon: Icon, value, label }, i) => (
//             <div
//               key={label}
//               className={`flex items-center justify-center gap-4 py-4 sm:py-2 ${
//                 i !== 0
//                   ? "border-t border-[#faf9f6]/15 sm:border-l sm:border-t-0"
//                   : ""
//               }`}
//             >
//               <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#faf9f6]/10 text-[#F5D77A]">
//                 <Icon size={22} aria-hidden="true" />
//               </span>
//               <div>
//                 <dd className={`${serif} text-3xl leading-none text-[#F5D77A]`}>
//                   {value}
//                 </dd>
//                 <dt className="mt-1.5 text-sm text-[#faf9f6]/70">{label}</dt>
//               </div>
//             </div>
//           ))}
//         </motion.dl> */}
//       </div>
//     </section>
//   );
// }

"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Marcellus } from "next/font/google";
import {
  FiArrowRight,
  FiAward,
  FiCheck,
  FiHome,
  FiKey,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const serif = `${marcellus.className} font-normal`;

/* ---------------- DATA ---------------- */
const points = [
  "Wide range of residential & commercial properties",
  "Expert market insights and personalized guidance",
  "Transparent process with verified listings",
  "Dedicated support from search to settlement",
];

// "Years of Experience" image badge me hai, isliye yahan 3 stats
// const stats = [
//   { icon: FiHome, value: "500+", label: "Properties Listed" },
//   { icon: FiUsers, value: "300+", label: "Happy Clients" },
//   { icon: FiMapPin, value: "10+", label: "Cities Covered" },
// ];

const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

/* ---------------- BUTTON (same as About / Home hero) ---------------- */
const BtnDark = ({ href, children }) => (
  <Link
    href={href}
    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#000000] py-2.5 pl-6 pr-2.5 text-sm font-normal text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#000000] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
  >
    <span
      aria-hidden="true"
      className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] transition-transform duration-500 ease-out group-hover:scale-x-100"
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
    />
    <span className="relative z-10">{children}</span>
    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] text-[#000000] transition-all duration-500 group-hover:bg-none group-hover:bg-[#000000] group-hover:text-[#F5D77A]">
      <FiArrowRight
        size={14}
        className="transition-transform duration-500 group-hover:-rotate-45"
        aria-hidden="true"
      />
    </span>
  </Link>
);

/* ---------------- ANIMATED HOUSE ILLUSTRATION ---------------- */
const SKYLINE = [
  { x: 24, w: 38, h: 70 },
  { x: 66, w: 30, h: 110 },
  { x: 304, w: 32, h: 95 },
  { x: 340, w: 38, h: 65 },
];

const PARTICLES = [
  { cx: 70, cy: 120, d: 0 },
  { cx: 330, cy: 150, d: 0.8 },
  { cx: 120, cy: 70, d: 1.6 },
  { cx: 290, cy: 90, d: 0.4 },
  { cx: 50, cy: 230, d: 1.2 },
  { cx: 355, cy: 250, d: 2 },
];

const CHIPS = [
  { icon: FiCheck, pos: "left-[7%] top-[30%]", delay: 0, amp: 8 },
  { icon: FiMapPin, pos: "right-[7%] top-[42%]", delay: 0.9, amp: 10 },
  { icon: FiKey, pos: "left-[12%] bottom-[16%]", delay: 1.7, amp: 7 },
];

function HouseScene({ reduce }) {
  const draw = (delay = 0, duration = 1.1) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration, delay, ease: "easeInOut" },
  });

  const strokeProps = {
    fill: "none",
    stroke: "url(#houseGold)",
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <>
      {/* ambient glow behind house */}
      <motion.div
        aria-hidden="true"
        animate={
          reduce ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-[52%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e2a10d]/20 blur-3xl"
      />

      <svg
        viewBox="0 0 400 440"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Animated illustration of a luxury home"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient
            id="houseGold"
            gradientUnits="userSpaceOnUse"
            x1="90"
            y1="140"
            x2="310"
            y2="360"
          >
            <stop offset="0%" stopColor="#e2a10d" />
            <stop offset="50%" stopColor="#ffcd39" />
            <stop offset="100%" stopColor="#e2a10d" />
          </linearGradient>
          <linearGradient id="windowGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffcd39" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#e2a10d" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* orbit rings */}
        <g style={{ transformOrigin: "200px 235px" }}>
          <motion.g
            style={{ transformOrigin: "200px 235px" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="200"
              cy="235"
              r="150"
              fill="none"
              stroke="#D4AF37"
              strokeOpacity="0.25"
              strokeDasharray="2 8"
              strokeLinecap="round"
            />
            <circle cx="350" cy="235" r="4" fill="#ffcd39" />
          </motion.g>
          <motion.g
            style={{ transformOrigin: "200px 235px" }}
            animate={reduce ? undefined : { rotate: -360 }}
            transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="200"
              cy="235"
              r="188"
              fill="none"
              stroke="#faf9f6"
              strokeOpacity="0.1"
              strokeDasharray="1 10"
              strokeLinecap="round"
            />
            <circle cx="200" cy="47" r="3" fill="#F5D77A" />
          </motion.g>
        </g>

        {/* skyline */}
        {SKYLINE.map((b, i) => (
          <motion.rect
            key={i}
            x={b.x}
            y={360 - b.h}
            width={b.w}
            height={b.h}
            rx="3"
            fill="#faf9f6"
            fillOpacity="0.06"
            stroke="#faf9f6"
            strokeOpacity="0.12"
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.9,
              delay: 0.2 + i * 0.12,
              ease: "easeOut",
            }}
          />
        ))}

        {/* particles */}
        {PARTICLES.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r="2"
            fill="#ffcd39"
            animate={
              reduce
                ? { opacity: 0.4 }
                : { opacity: [0.1, 0.9, 0.1], y: [0, -10, 0] }
            }
            transition={{
              duration: 4,
              delay: p.d,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* ground */}
        <motion.path
          d="M50 360 H350"
          {...strokeProps}
          strokeOpacity="0.6"
          {...draw(0, 0.9)}
        />

        {/* window light fill */}
        {[
          { x: 130, y: 252 },
          { x: 230, y: 252 },
        ].map((w, i) => (
          <motion.rect
            key={i}
            x={w.x}
            y={w.y}
            width="40"
            height="40"
            rx="2"
            fill="url(#windowGlow)"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={
              reduce ? { opacity: 0.85 } : { opacity: [0, 1, 0.65, 1, 0.8] }
            }
            viewport={{ once: true }}
            transition={{
              duration: 2.2,
              delay: 2.1 + i * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* door glow */}
        <motion.path
          d="M186 360 V318 A14 14 0 0 1 214 318 V360 Z"
          fill="#ffcd39"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 0.18 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 2.4 }}
        />

        {/* house line art */}
        <motion.path
          d="M115 228 V360 H285 V228"
          {...strokeProps}
          {...draw(0.3)}
        />
        <motion.path
          d="M90 228 L200 140 L310 228"
          {...strokeProps}
          {...draw(0.9, 1.2)}
        />
        <motion.path
          d="M245 180 V150 H268 V192"
          {...strokeProps}
          {...draw(1.6, 0.7)}
        />
        <motion.path
          d="M186 360 V318 A14 14 0 0 1 214 318 V360"
          {...strokeProps}
          {...draw(1.4, 0.8)}
        />
        <motion.path
          d="M130 252 H170 V292 H130 Z M150 252 V292 M130 272 H170"
          {...strokeProps}
          strokeWidth="2.5"
          {...draw(1.7, 0.9)}
        />
        <motion.path
          d="M230 252 H270 V292 H230 Z M250 252 V292 M230 272 H270"
          {...strokeProps}
          strokeWidth="2.5"
          {...draw(1.9, 0.9)}
        />
        <motion.circle
          cx="200"
          cy="198"
          r="13"
          {...strokeProps}
          strokeWidth="2.5"
          {...draw(2, 0.7)}
        />
        <motion.circle
          cx="207"
          cy="340"
          r="1.8"
          fill="#ffcd39"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.4 }}
        />

        {/* chimney smoke */}
        {!reduce &&
          [0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx="256"
              cy="146"
              r="5"
              fill="#faf9f6"
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{
                opacity: [0, 0.3, 0],
                y: -50,
                x: 10 + i * 4,
                scale: 1.8,
              }}
              transition={{
                duration: 3.6,
                delay: 2.6 + i * 1.2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
      </svg>

      {/* floating icon chips */}
      {CHIPS.map(({ icon: Icon, pos, delay, amp }, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 2.2 + delay * 0.3 }}
          className={`absolute ${pos}`}
        >
          <motion.span
            animate={reduce ? undefined : { y: [0, -amp, 0] }}
            transition={{
              duration: 5,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf9f6]/10 text-[#F5D77A] shadow-lg ring-1 ring-[#D4AF37]/40 backdrop-blur-sm sm:h-12 sm:w-12"
          >
            <Icon size={18} />
          </motion.span>
        </motion.span>
      ))}
    </>
  );
}

/* ---------------- COMPONENT ---------------- */
export default function AboutSection() {
  const reduce = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.65, delay, ease: "easeOut" },
  });

  return (
    <section
      className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* ===== Animated visual side ===== */}
          <motion.div
            {...reveal()}
            className="relative order-2 min-w-0 lg:order-1"
          >
            {/* offset gold frame */}
            <span
              aria-hidden="true"
              className="absolute -left-3 -top-3 hidden h-full w-full rounded-t-[220px] rounded-b-3xl border border-[#D4AF37]/50 lg:block"
            />
            <div
              className="relative 
              w-[98%] sm:w-[80%] md:w-[98%] lg:w-full
              aspect-[4/3.5] md:aspect-[4/3.8] lg:aspect-[4/4.4]
              mx-auto lg:mx-0
              overflow-hidden rounded-3xl bg-[#000000] ring-1 ring-[#D4AF37]/30
              shadow-[0_25px_60px_-30px_rgba(26,42,34,0.5)]
              lg:rounded-b-3xl lg:rounded-t-[220px]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#e2a10d]/10 to-transparent"
              />
              <HouseScene reduce={reduce} />
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-6 right-4 flex items-center gap-4 rounded-2xl bg-[#000000] px-6 py-4 text-[#faf9f6] shadow-xl ring-1 ring-[#D4AF37]/40 sm:right-8 lg:-right-6">
              <FiAward
                size={26}
                className="text-[#F5D77A]"
                aria-hidden="true"
              />
              <div>
                <p className={`${serif} text-3xl leading-none text-[#F5D77A]`}>
                  3+
                </p>
                <p className="mt-1 text-xs text-[#faf9f6]/75">
                  Years of Experience
                </p>
              </div>
            </div>
          </motion.div>

          {/* ===== Text side ===== */}
          <motion.div {...reveal(0.1)} className="order-1 min-w-0 lg:order-2">
            <h2
              id="about-heading"
              className={`${serif} text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.1] tracking-tight text-[#000000]`}
            >
              Why Choose to Bringo
            </h2>
            <span
              aria-hidden="true"
              className={`mt-5 block h-[3px] w-16 rounded-full ${goldBg}`}
            />

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#52685B]">
              Bringo Real Estate Services is committed to making property
              decisions simple, transparent and rewarding. Whether you are
              looking for your dream home, a commercial space, or a smart
              investment, our expert team is here to guide you at every step.
            </p>

            <ul className="mt-7 space-y-3.5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#000000] text-[#F5D77A]">
                    <FiCheck size={13} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-base text-[#000000]">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <BtnDark href="/about">Learn More About Us</BtnDark>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
