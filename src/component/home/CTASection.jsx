// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
// import { Marcellus } from "next/font/google";
// import { FaWhatsapp } from "react-icons/fa";
// import {
//   FiPhone,
//   FiArrowRight,
//   FiCheck,
//   FiAlertCircle,
//   FiLock,
//   FiUser,
//   FiMapPin,
//   FiChevronDown,
// } from "react-icons/fi";
// import { CgSpinner } from "react-icons/cg";

// const marcellus = Marcellus({
//   subsets: ["latin"],
//   weight: "400",
//   display: "swap",
// });
// const serif = `${marcellus.className} font-normal`;

// const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

// // TODO: replace with your real details
// const PHONE = "+91 9999300301";
// const PHONE_HREF = "tel:+919999300301";
// const WHATSAPP_URL = "https://wa.me/919999300301";

// const contactLinks = [
//   { icon: FiPhone, label: "Call us", value: PHONE, href: PHONE_HREF },
//   {
//     icon: FaWhatsapp,
//     label: "WhatsApp",
//     value: "Chat with our team",
//     href: WHATSAPP_URL,
//     external: true,
//   },
// ];

// /* ---------- Form options ---------- */
// const INTENTS = ["Buy", "Rent", "Invest"];

// const PROPERTY_TYPES = [
//   "Flat / Apartment",
//   "Villa / House",
//   "Plot / Land",
//   "Commercial",
//   "Other",
// ];

// const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];

// const BUY_BUDGETS = [
//   "Under ₹50 Lakh",
//   "₹50 Lakh – ₹1 Cr",
//   "₹1 Cr – ₹2 Cr",
//   "₹2 Cr – ₹5 Cr",
//   "Above ₹5 Cr",
// ];

// const RENT_BUDGETS = [
//   "Under ₹15,000 / month",
//   "₹15,000 – ₹30,000 / month",
//   "₹30,000 – ₹60,000 / month",
//   "Above ₹60,000 / month",
// ];

// const CALL_TIMES = ["Morning", "Afternoon", "Evening", "Anytime"];

// const initialForm = {
//   name: "",
//   phone: "",
//   intent: "Buy",
//   propertyType: "Flat / Apartment",
//   bhk: "",
//   budget: "",
//   location: "",
//   callTime: "Anytime",
//   notes: "",
// };

// /* ---------- Shared classes ---------- */
// const fieldClass =
//   "w-full rounded-xl border border-[#000000]/12 bg-[#f3f0E8]/50 py-3 pl-12 pr-4 text-[15px] text-[#000000] placeholder:text-[#52685B]/60 transition duration-300 hover:border-[#000000]/25 focus:border-[#D4AF37] focus:bg-[#faf9f6] focus:outline-none focus:ring-4 focus:ring-[#ffcd39]/25 disabled:opacity-60";
// const selectClass = `${fieldClass} appearance-none pr-11`;
// const labelClass = "mb-1.5 block text-[13px] tracking-wide text-[#000000]";
// const fieldIcon =
//   "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B] transition-colors group-focus-within:text-[#E2A10D]";

// /* ---------- Chip group (radio buttons styled as pills / segmented) ---------- */
// function ChipGroup({
//   legend,
//   name,
//   options,
//   value,
//   onChange,
//   disabled,
//   segmented = false,
// }) {
//   return (
//     <fieldset disabled={disabled} className="min-w-0">
//       <legend className={labelClass}>{legend}</legend>
//       <div
//         className={
//           segmented
//             ? "grid gap-1 rounded-full border border-[#000000]/12 bg-[#f3f0E8]/60 p-1"
//             : "flex flex-wrap gap-1.5"
//         }
//         style={
//           segmented
//             ? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }
//             : undefined
//         }
//       >
//         {options.map((opt) => {
//           const checked = value === opt;
//           return (
//             <label key={opt} className="cursor-pointer">
//               <input
//                 type="radio"
//                 name={name}
//                 value={opt}
//                 checked={checked}
//                 onChange={onChange}
//                 className="peer sr-only"
//               />
//               <span
//                 className={`flex items-center justify-center gap-1.5 transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-[#D4AF37] peer-focus-visible:ring-offset-2 ${
//                   segmented
//                     ? "rounded-full px-1 py-2.5 text-[13px] sm:text-sm"
//                     : "rounded-full border px-3.5 py-1.5 text-[13px] sm:text-sm"
//                 } ${
//                   checked
//                     ? `text-[#000000] shadow-[0_6px_16px_-6px_rgba(212,175,55,0.7)] ${goldBg} ${
//                         segmented ? "" : "border-transparent"
//                       }`
//                     : segmented
//                     ? "text-[#000000]/70 hover:text-[#000000]"
//                     : "border-[#000000]/12 bg-[#f3f0E8]/50 text-[#000000] hover:border-[#D4AF37] hover:bg-[#faf9f6]"
//                 }`}
//               >
//                 {checked && !segmented && (
//                   <FiCheck size={13} strokeWidth={3} aria-hidden="true" />
//                 )}
//                 {opt}
//               </span>
//             </label>
//           );
//         })}
//       </div>
//     </fieldset>
//   );
// }

// export default function CTACallback({ image = null }) {
//   const reduce = useReducedMotion();
//   const [form, setForm] = useState(initialForm);
//   const [status, setStatus] = useState("idle");
//   const [errorMsg, setErrorMsg] = useState("");

//   const isRent = form.intent === "Rent";
//   const showBhk = ["Flat / Apartment", "Villa / House"].includes(
//     form.propertyType
//   );
//   const budgetOptions = isRent ? RENT_BUDGETS : BUY_BUDGETS;

//   const showBhkFor = (type) =>
//     ["Flat / Apartment", "Villa / House"].includes(type);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => {
//       const next = { ...p, [name]: value };
//       // Buy/Invest and Rent use different budget scales, so reset on switch
//       if (name === "intent" && (value === "Rent") !== (p.intent === "Rent")) {
//         next.budget = "";
//       }
//       // BHK only applies to flats and villas
//       if (name === "propertyType" && !showBhkFor(value)) {
//         next.bhk = "";
//       }
//       return next;
//     });
//   };

//   const buildMessage = () => {
//     const lines = [
//       "Customer requested a callback from the website.",
//       `Looking to: ${form.intent}`,
//       `Property type: ${form.propertyType}`,
//       form.bhk && `Configuration: ${form.bhk}`,
//       form.budget && `Budget: ${form.budget}`,
//       form.location.trim() && `Preferred location: ${form.location.trim()}`,
//       `Best time to call: ${form.callTime}`,
//       form.notes.trim() && `Notes: ${form.notes.trim()}`,
//     ];
//     return lines.filter(Boolean).join("\n");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setStatus("loading");
//     setErrorMsg("");

//     try {
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: form.name,
//           phone: form.phone,
//           email: "",
//           enquiryType: "Callback Request",
//           intent: form.intent,
//           propertyType: form.propertyType,
//           bhk: form.bhk,
//           budget: form.budget,
//           location: form.location,
//           callTime: form.callTime,
//           message: buildMessage(),
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Something went wrong.");
//       }

//       setStatus("success");
//       setForm(initialForm);
//     } catch (error) {
//       console.error("Callback request error:", error);
//       setErrorMsg(
//         error.message || "Unable to submit callback request. Please try again."
//       );
//       setStatus("error");
//     }
//   };

//   const loading = status === "loading";

//   return (
//     <section
//       className="relative bg-[#f3f0E8] py-16 sm:py-20 lg:py-28"
//       aria-labelledby="cta-callback-heading"
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={reduce ? false : { opacity: 0, y: 28 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="relative overflow-hidden rounded-[28px] bg-[#000000] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] ring-1 ring-[#D4AF37]/20 sm:rounded-[32px]"
//         >
//           {/* top gold line */}
//           <span
//             aria-hidden="true"
//             className={`absolute inset-x-0 top-0 z-10 h-[3px] ${goldBg}`}
//           />
//           {image && (
//             <>
//               <img
//                 src={image}
//                 alt=""
//                 aria-hidden="true"
//                 className="absolute inset-0 h-full w-full object-cover opacity-25"
//               />
//               <div className="absolute inset-0 bg-[#000000]/80" />
//             </>
//           )}

//           {/* ambient glows */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#e2a10d]/15 blur-3xl"
//           />
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffcd39]/10 blur-3xl"
//           />
//           {/* fine grid texture */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0 opacity-[0.05]"
//             style={{
//               backgroundImage:
//                 "linear-gradient(#faf9f6 1px, transparent 1px), linear-gradient(90deg, #faf9f6 1px, transparent 1px)",
//               backgroundSize: "56px 56px",
//               maskImage:
//                 "radial-gradient(ellipse at 20% 30%, black 0%, transparent 70%)",
//               WebkitMaskImage:
//                 "radial-gradient(ellipse at 20% 30%, black 0%, transparent 70%)",
//             }}
//           />

//           <div className="relative grid items-start gap-10 p-5 sm:p-10 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16 lg:p-14">
//             {/* ===== LEFT: message + contact ===== */}
//             <motion.div
//               initial={reduce ? false : { opacity: 0, x: -24 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
//               className="min-w-0 lg:sticky lg:top-24 lg:self-center"
//             >
//               <h2
//                 id="cta-callback-heading"
//                 className={`${serif} text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.08] tracking-tight text-[#faf9f6]`}
//               >
//                 Let Us Call You Back
//               </h2>
//               <span
//                 aria-hidden="true"
//                 className={`mt-6 block h-[3px] w-20 rounded-full ${goldBg}`}
//               />
//               <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-[#faf9f6]/70 sm:text-base">
//                 Tell us what you are looking for. Our team will call with
//                 honest, no-pressure guidance and shortlist properties that match
//                 your budget and preferences.
//               </p>

//               <ul className="mt-10 space-y-3">
//                 {contactLinks.map(({ icon: Icon, label, value, href, external }) => {
//                   const content = (
//                     <>
//                       <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#faf9f6]/10 text-[#E2A10D] ring-1 ring-[#faf9f6]/10 transition duration-300 group-hover:bg-gradient-to-br group-hover:from-[#E2A10D] group-hover:to-[#FFCD39] group-hover:text-[#000000] group-hover:ring-transparent">
//                         <Icon size={20} aria-hidden="true" />
//                       </span>
//                       <span className="min-w-0 flex-1">
//                         <span className="block text-xs text-[#faf9f6]/55">
//                           {label}
//                         </span>
//                         <span className="mt-0.5 block break-words text-base text-[#faf9f6]">
//                           {value}
//                         </span>
//                       </span>
//                       {href && (
//                         <FiArrowRight
//                           size={16}
//                           aria-hidden="true"
//                           className="shrink-0 text-[#faf9f6]/40 transition duration-300 group-hover:translate-x-1 group-hover:text-[#E2A10D]"
//                         />
//                       )}
//                     </>
//                   );
//                   const rowClass =
//                     "group flex items-center gap-4 rounded-2xl border border-[#faf9f6]/10 bg-[#faf9f6]/[0.04] p-3.5 transition duration-300 hover:border-[#E2A10D]/50 hover:bg-[#faf9f6]/[0.07]";
//                   return (
//                     <li key={label}>
//                       {href ? (
//                         <a
//                           href={href}
//                           {...(external && {
//                             target: "_blank",
//                             rel: "noopener noreferrer",
//                           })}
//                           className={`${rowClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39]`}
//                         >
//                           {content}
//                         </a>
//                       ) : (
//                         <div className={rowClass}>{content}</div>
//                       )}
//                     </li>
//                   );
//                 })}
//               </ul>
//             </motion.div>

//             {/* ===== RIGHT: form card ===== */}
//             <motion.div
//               initial={reduce ? false : { opacity: 0, x: 24 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
//               className="relative min-w-0 overflow-hidden rounded-3xl bg-[#faf9f6] p-5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] ring-1 ring-[#D4AF37]/30 sm:p-7"
//             >
//               <span
//                 aria-hidden="true"
//                 className={`absolute inset-x-0 top-0 h-[2px] ${goldBg}`}
//               />

//               {status === "success" ? (
//                 <div aria-live="polite" className="py-10 text-center">
//                   <motion.span
//                     initial={reduce ? false : { scale: 0.6, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ type: "spring", stiffness: 260, damping: 18 }}
//                     className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[#000000] shadow-[0_12px_30px_-8px_rgba(212,175,55,0.7)] ${goldBg}`}
//                   >
//                     <FiCheck size={28} strokeWidth={2.5} aria-hidden="true" />
//                   </motion.span>
//                   <h3
//                     className={`${serif} mt-6 text-2xl text-[#000000] sm:text-3xl`}
//                   >
//                     Request received
//                   </h3>
//                   <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#52685B]">
//                     Thank you! We’ll call you back shortly with options that
//                     match your requirements.
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => setStatus("idle")}
//                     className="mt-7 text-sm text-[#52685B] underline underline-offset-4 transition hover:text-[#000000]"
//                   >
//                     Send another request
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <h3
//                     className={`${serif} text-2xl text-[#000000] sm:text-3xl`}
//                   >
//                     Request a Callback
//                   </h3>
//                   <p className="mt-2 max-w-md text-sm leading-relaxed text-[#52685B]">
//                     Name and phone are required. The rest helps us prepare
//                     better options for you.
//                   </p>
//                   <span
//                     aria-hidden="true"
//                     className="mt-4 block h-px w-full bg-gradient-to-r from-[#D4AF37]/50 via-[#000000]/10 to-transparent"
//                   />

//                   <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//                     {/* Name + Phone */}
//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <div>
//                         <label htmlFor="cta-name" className={labelClass}>
//                           Full name
//                         </label>
//                         <div className="group relative">
//                           <FiUser size={17} className={fieldIcon} aria-hidden="true" />
//                           <input
//                             id="cta-name"
//                             name="name"
//                             type="text"
//                             required
//                             autoComplete="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             disabled={loading}
//                             placeholder="Your full name"
//                             className={fieldClass}
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label htmlFor="cta-phone" className={labelClass}>
//                           Phone number
//                         </label>
//                         <div className="group relative">
//                           <FiPhone size={17} className={fieldIcon} aria-hidden="true" />
//                           <input
//                             id="cta-phone"
//                             name="phone"
//                             type="tel"
//                             required
//                             autoComplete="tel"
//                             inputMode="tel"
//                             pattern="[0-9+\-\s]{10,15}"
//                             title="Enter a valid phone number"
//                             value={form.phone}
//                             onChange={handleChange}
//                             disabled={loading}
//                             placeholder="+91 00000 00000"
//                             className={fieldClass}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Intent + Budget */}
//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <ChipGroup
//                         legend="I want to"
//                         name="intent"
//                         options={INTENTS}
//                         value={form.intent}
//                         onChange={handleChange}
//                         disabled={loading}
//                         segmented
//                       />

//                       <div>
//                         <label htmlFor="cta-budget" className={labelClass}>
//                           {isRent ? "Monthly budget" : "Budget"}
//                         </label>
//                         <div className="group relative">
//                           <span
//                             aria-hidden="true"
//                             className={`${fieldIcon} text-base leading-none`}
//                           >
//                             ₹
//                           </span>
//                           <select
//                             id="cta-budget"
//                             name="budget"
//                             value={form.budget}
//                             onChange={handleChange}
//                             disabled={loading}
//                             className={selectClass}
//                           >
//                             <option value="">Select a range</option>
//                             {budgetOptions.map((b) => (
//                               <option key={b} value={b}>
//                                 {b}
//                               </option>
//                             ))}
//                           </select>
//                           <FiChevronDown
//                             size={17}
//                             aria-hidden="true"
//                             className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#52685B]"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Property type */}
//                     <ChipGroup
//                       legend="Property type"
//                       name="propertyType"
//                       options={PROPERTY_TYPES}
//                       value={form.propertyType}
//                       onChange={handleChange}
//                       disabled={loading}
//                     />

//                     {/* BHK (flat / villa only) */}
//                     <AnimatePresence initial={false}>
//                       {showBhk && (
//                         <motion.div
//                           key="bhk"
//                           initial={reduce ? false : { opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: "auto" }}
//                           exit={{ opacity: 0, height: 0 }}
//                           transition={{ duration: 0.3, ease: "easeOut" }}
//                           className="overflow-hidden"
//                         >
//                           <ChipGroup
//                             legend="Configuration"
//                             name="bhk"
//                             options={BHK_OPTIONS}
//                             value={form.bhk}
//                             onChange={handleChange}
//                             disabled={loading}
//                           />
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     {/* Location + Best time to call */}
//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <div>
//                         <label htmlFor="cta-location" className={labelClass}>
//                           Preferred location
//                         </label>
//                         <div className="group relative">
//                           <FiMapPin size={17} className={fieldIcon} aria-hidden="true" />
//                           <input
//                             id="cta-location"
//                             name="location"
//                             type="text"
//                             value={form.location}
//                             onChange={handleChange}
//                             disabled={loading}
//                             placeholder="Area or city"
//                             className={fieldClass}
//                           />
//                         </div>
//                       </div>

//                       <div className="relative">
//                         <label htmlFor="cta-calltime" className={labelClass}>
//                           Best time to call
//                         </label>
//                         <div className="group relative">
//                           <FiPhone size={17} className={fieldIcon} aria-hidden="true" />
//                           <select
//                             id="cta-calltime"
//                             name="callTime"
//                             value={form.callTime}
//                             onChange={handleChange}
//                             disabled={loading}
//                             className={selectClass}
//                           >
//                             {CALL_TIMES.map((t) => (
//                               <option key={t} value={t}>
//                                 {t}
//                               </option>
//                             ))}
//                           </select>
//                           <FiChevronDown
//                             size={17}
//                             aria-hidden="true"
//                             className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#52685B]"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Notes */}
//                     <div>
//                       <label htmlFor="cta-notes" className={labelClass}>
//                         Anything else we should know?
//                       </label>
//                       <textarea
//                         id="cta-notes"
//                         name="notes"
//                         rows={2}
//                         maxLength={500}
//                         value={form.notes}
//                         onChange={handleChange}
//                         disabled={loading}
//                         placeholder="Possession timeline, parking, near a metro, loan needed..."
//                         className="w-full resize-none rounded-xl border border-[#000000]/12 bg-[#f3f0E8]/50 px-4 py-3 text-[15px] text-[#000000] placeholder:text-[#52685B]/60 transition duration-300 hover:border-[#000000]/25 focus:border-[#D4AF37] focus:bg-[#faf9f6] focus:outline-none focus:ring-4 focus:ring-[#ffcd39]/25 disabled:opacity-60"
//                       />
//                     </div>

//                     <div className="space-y-3 pt-1">
//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className="group relative inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#000000] py-2.5 pl-7 pr-2.5 text-base text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#000000] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
//                       >
//                         <span
//                           aria-hidden="true"
//                           className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] transition-transform duration-500 ease-out group-hover:scale-x-100"
//                         />
//                         <span
//                           aria-hidden="true"
//                           className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
//                         />
//                         <span className="relative z-10 text-nowrap">
//                           {loading ? "Sending..." : "Request Callback"}
//                         </span>
//                         <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] text-[#000000] transition-all duration-500 group-hover:bg-none group-hover:bg-[#000000] group-hover:text-[#F5D77A]">
//                           {loading ? (
//                             <CgSpinner size={20} className="animate-spin" aria-hidden="true" />
//                           ) : (
//                             <FiArrowRight
//                               size={16}
//                               className="transition-transform duration-500 group-hover:-rotate-45"
//                               aria-hidden="true"
//                             />
//                           )}
//                         </span>
//                       </button>

//                       <p className="flex items-center justify-center gap-2 text-xs text-[#52685B]">
//                         <FiLock size={13} aria-hidden="true" />
//                         Your details stay private. We never share your number.
//                       </p>
//                     </div>

//                     <div aria-live="polite">
//                       {status === "error" && (
//                         <p
//                           role="alert"
//                           className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//                         >
//                           <FiAlertCircle
//                             size={18}
//                             className="mt-0.5 shrink-0"
//                             aria-hidden="true"
//                           />
//                           {errorMsg}
//                         </p>
//                       )}
//                     </div>
//                   </form>
//                 </>
//               )}
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
// import { Marcellus } from "next/font/google";
// import { FaWhatsapp } from "react-icons/fa";
// import {
//   FiPhone,
//   FiArrowRight,
//   FiCheck,
//   FiAlertCircle,
//   FiLock,
//   FiUser,
//   FiMapPin,
//   FiChevronDown,
//   FiHome,
//   FiKey,
// } from "react-icons/fi";
// import { CgSpinner } from "react-icons/cg";

// const marcellus = Marcellus({
//   subsets: ["latin"],
//   weight: "400",
//   display: "swap",
// });
// const serif = `${marcellus.className} font-normal`;

// const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

// // TODO: replace with your real details
// const PHONE = "+91 9999300301";
// const PHONE_HREF = "tel:+919999300301";
// const WHATSAPP_URL = "https://wa.me/919999300301";

// const contactLinks = [
//   { icon: FiPhone, label: "Call us", value: PHONE, href: PHONE_HREF },
//   {
//     icon: FaWhatsapp,
//     label: "WhatsApp",
//     value: "Chat with our team",
//     href: WHATSAPP_URL,
//     external: true,
//   },
// ];

// /* ---------- Form options ---------- */
// const INTENTS = ["Buy", "Rent", "Invest"];

// const PROPERTY_TYPES = [
//   "Flat / Apartment",
//   "Villa / House",
//   "Plot / Land",
//   "Commercial",
//   "Other",
// ];

// const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];

// const BUY_BUDGETS = [
//   "Under ₹50 Lakh",
//   "₹50 Lakh – ₹1 Cr",
//   "₹1 Cr – ₹2 Cr",
//   "₹2 Cr – ₹5 Cr",
//   "Above ₹5 Cr",
// ];

// const RENT_BUDGETS = [
//   "Under ₹15,000 / month",
//   "₹15,000 – ₹30,000 / month",
//   "₹30,000 – ₹60,000 / month",
//   "Above ₹60,000 / month",
// ];

// const CALL_TIMES = ["Morning", "Afternoon", "Evening", "Anytime"];

// const initialForm = {
//   name: "",
//   phone: "",
//   intent: "Buy",
//   propertyType: "Flat / Apartment",
//   bhk: "",
//   budget: "",
//   location: "",
//   callTime: "Anytime",
//   notes: "",
// };

// /* ---------- Shared classes ---------- */
// const fieldClass =
//   "w-full rounded-xl border border-[#000000]/12 bg-[#f3f0E8]/50 py-3 pl-12 pr-4 text-[15px] text-[#000000] placeholder:text-[#52685B]/60 transition duration-300 hover:border-[#000000]/25 focus:border-[#D4AF37] focus:bg-[#faf9f6] focus:outline-none focus:ring-4 focus:ring-[#ffcd39]/25 disabled:opacity-60";
// const selectClass = `${fieldClass} appearance-none pr-11`;
// const labelClass = "mb-1.5 block text-[13px] tracking-wide text-[#000000]";
// const fieldIcon =
//   "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B] transition-colors group-focus-within:text-[#E2A10D]";

// /* ---------- Chip group (radio buttons styled as pills / segmented) ---------- */
// function ChipGroup({
//   legend,
//   name,
//   options,
//   value,
//   onChange,
//   disabled,
//   segmented = false,
// }) {
//   return (
//     <fieldset disabled={disabled} className="min-w-0">
//       <legend className={labelClass}>{legend}</legend>
//       <div
//         className={
//           segmented
//             ? "grid gap-1 rounded-full border border-[#000000]/12 bg-[#f3f0E8]/60 p-1"
//             : "flex flex-wrap gap-1.5"
//         }
//         style={
//           segmented
//             ? {
//                 gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
//               }
//             : undefined
//         }
//       >
//         {options.map((opt) => {
//           const checked = value === opt;
//           return (
//             <label key={opt} className="cursor-pointer">
//               <input
//                 type="radio"
//                 name={name}
//                 value={opt}
//                 checked={checked}
//                 onChange={onChange}
//                 className="peer sr-only"
//               />
//               <span
//                 className={`flex items-center justify-center gap-1.5 transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-[#D4AF37] peer-focus-visible:ring-offset-2 ${
//                   segmented
//                     ? "rounded-full px-1 py-2.5 text-[13px] sm:text-sm"
//                     : "rounded-full border px-3.5 py-1.5 text-[13px] sm:text-sm"
//                 } ${
//                   checked
//                     ? `text-[#000000] shadow-[0_6px_16px_-6px_rgba(212,175,55,0.7)] ${goldBg} ${
//                         segmented ? "" : "border-transparent"
//                       }`
//                     : segmented
//                       ? "text-[#000000]/70 hover:text-[#000000]"
//                       : "border-[#000000]/12 bg-[#f3f0E8]/50 text-[#000000] hover:border-[#D4AF37] hover:bg-[#faf9f6]"
//                 }`}
//               >
//                 {checked && !segmented && (
//                   <FiCheck size={13} strokeWidth={3} aria-hidden="true" />
//                 )}
//                 {opt}
//               </span>
//             </label>
//           );
//         })}
//       </div>
//     </fieldset>
//   );
// }

// /* ---------- Animated "we're calling you" visual (left column filler) ---------- */
// const ORBIT_ICONS = [
//   { icon: FiHome, angle: 0 },
//   { icon: FiMapPin, angle: 120 },
//   { icon: FiKey, angle: 240 },
// ];

// const SKYLINE_BARS = [
//   { w: 26, h: 34 },
//   { w: 20, h: 54 },
//   { w: 30, h: 40 },
//   { w: 22, h: 66 },
//   { w: 28, h: 46 },
//   { w: 20, h: 58 },
//   { w: 30, h: 36 },
//   { w: 22, h: 50 },
//   { w: 26, h: 62 },
//   { w: 20, h: 40 },
// ];

// function CallVisual({ reduce }) {
//   return (
//     <div
//       aria-hidden="true"
//       className="relative mt-8 hidden min-h-[170px] flex-1 overflow-hidden rounded-2xl border border-[#faf9f6]/10 bg-[#faf9f6]/[0.03] lg:block"
//     >
//       {/* soft glow */}
//       <motion.span
//         animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
//         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e2a10d]/20 blur-3xl"
//       />

//       {/* skyline silhouette */}
//       <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 px-3">
//         {SKYLINE_BARS.map((b, i) => (
//           <motion.span
//             key={i}
//             initial={reduce ? false : { scaleY: 0 }}
//             whileInView={{ scaleY: 1 }}
//             viewport={{ once: true }}
//             transition={{
//               duration: 0.8,
//               delay: 0.3 + i * 0.06,
//               ease: "easeOut",
//             }}
//             style={{ width: b.w, height: b.h, transformOrigin: "bottom" }}
//             className="rounded-t-[3px] border border-b-0 border-[#D4AF37]/25 bg-[#faf9f6]/[0.05]"
//           />
//         ))}
//       </div>
//       <span className={`absolute inset-x-0 bottom-0 h-[2px] ${goldBg}`} />

//       {/* orbit */}
//       <motion.div
//         animate={reduce ? undefined : { rotate: 360 }}
//         transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
//         className="absolute left-1/2 top-1/2 aspect-square h-[78%] max-h-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#D4AF37]/30"
//       >
//         {ORBIT_ICONS.map(({ icon: Icon, angle }, i) => {
//           const rad = (angle * Math.PI) / 180;
//           return (
//             <span
//               key={i}
//               className="absolute"
//               style={{
//                 left: `${50 + 50 * Math.sin(rad)}%`,
//                 top: `${50 - 50 * Math.cos(rad)}%`,
//                 transform: "translate(-50%, -50%)",
//               }}
//             >
//               <motion.span
//                 animate={reduce ? undefined : { rotate: -360 }}
//                 transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
//                 className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#000000] text-[#F5D77A] ring-1 ring-[#D4AF37]/50"
//               >
//                 <Icon size={16} />
//               </motion.span>
//             </span>
//           );
//         })}
//       </motion.div>

//       {/* ripples + ringing phone */}
//       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
//         {!reduce &&
//           [0, 1, 2].map((i) => (
//             <motion.span
//               key={i}
//               initial={{ opacity: 0, scale: 1 }}
//               animate={{ opacity: [0.55, 0], scale: [1, 2.6] }}
//               transition={{
//                 duration: 3,
//                 delay: i * 1,
//                 repeat: Infinity,
//                 ease: "easeOut",
//               }}
//               className="absolute inset-0 rounded-full border border-[#ffcd39]/60"
//             />
//           ))}
//         <motion.span
//           animate={
//             reduce ? undefined : { rotate: [0, -14, 14, -10, 10, 0, 0, 0] }
//           }
//           transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
//           className={`relative flex h-14 w-14 items-center justify-center rounded-full text-[#000000] shadow-[0_10px_30px_-6px_rgba(212,175,55,0.7)] ${goldBg}`}
//         >
//           <FiPhone size={22} />
//         </motion.span>
//       </div>
//     </div>
//   );
// }

// export default function CTACallback({ image = null }) {
//   const reduce = useReducedMotion();
//   const [form, setForm] = useState(initialForm);
//   const [status, setStatus] = useState("idle");
//   const [errorMsg, setErrorMsg] = useState("");

//   const isRent = form.intent === "Rent";
//   const showBhk = ["Flat / Apartment", "Villa / House"].includes(
//     form.propertyType,
//   );
//   const budgetOptions = isRent ? RENT_BUDGETS : BUY_BUDGETS;

//   const showBhkFor = (type) =>
//     ["Flat / Apartment", "Villa / House"].includes(type);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => {
//       const next = { ...p, [name]: value };
//       // Buy/Invest and Rent use different budget scales, so reset on switch
//       if (name === "intent" && (value === "Rent") !== (p.intent === "Rent")) {
//         next.budget = "";
//       }
//       // BHK only applies to flats and villas
//       if (name === "propertyType" && !showBhkFor(value)) {
//         next.bhk = "";
//       }
//       return next;
//     });
//   };

//   const buildMessage = () => {
//     const lines = [
//       "Customer requested a callback from the website.",
//       `Looking to: ${form.intent}`,
//       `Property type: ${form.propertyType}`,
//       form.bhk && `Configuration: ${form.bhk}`,
//       form.budget && `Budget: ${form.budget}`,
//       form.location.trim() && `Preferred location: ${form.location.trim()}`,
//       `Best time to call: ${form.callTime}`,
//       form.notes.trim() && `Notes: ${form.notes.trim()}`,
//     ];
//     return lines.filter(Boolean).join("\n");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setStatus("loading");
//     setErrorMsg("");

//     try {
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: form.name,
//           phone: form.phone,
//           email: "",
//           enquiryType: "Callback Request",
//           intent: form.intent,
//           propertyType: form.propertyType,
//           bhk: form.bhk,
//           budget: form.budget,
//           location: form.location,
//           callTime: form.callTime,
//           message: buildMessage(),
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Something went wrong.");
//       }

//       setStatus("success");
//       setForm(initialForm);
//     } catch (error) {
//       console.error("Callback request error:", error);
//       setErrorMsg(
//         error.message || "Unable to submit callback request. Please try again.",
//       );
//       setStatus("error");
//     }
//   };

//   const loading = status === "loading";

//   return (
//     <section
//       className="relative bg-[#f3f0E8] py-16 sm:py-20 lg:py-28"
//       aria-labelledby="cta-callback-heading"
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={reduce ? false : { opacity: 0, y: 28 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="relative overflow-hidden rounded-[28px] bg-[#000000] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] ring-1 ring-[#D4AF37]/20 sm:rounded-[32px]"
//         >
//           {/* top gold line */}
//           <span
//             aria-hidden="true"
//             className={`absolute inset-x-0 top-0 z-10 h-[3px] ${goldBg}`}
//           />
//           {image && (
//             <>
//               <img
//                 src={image}
//                 alt=""
//                 aria-hidden="true"
//                 className="absolute inset-0 h-full w-full object-cover opacity-25"
//               />
//               <div className="absolute inset-0 bg-[#000000]/80" />
//             </>
//           )}

//           {/* ambient glows */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#e2a10d]/15 blur-3xl"
//           />
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffcd39]/10 blur-3xl"
//           />
//           {/* fine grid texture */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0 opacity-[0.05]"
//             style={{
//               backgroundImage:
//                 "linear-gradient(#faf9f6 1px, transparent 1px), linear-gradient(90deg, #faf9f6 1px, transparent 1px)",
//               backgroundSize: "56px 56px",
//               maskImage:
//                 "radial-gradient(ellipse at 20% 30%, black 0%, transparent 70%)",
//               WebkitMaskImage:
//                 "radial-gradient(ellipse at 20% 30%, black 0%, transparent 70%)",
//             }}
//           />

//           <div className="relative grid items-start gap-10 p-5 sm:p-10 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16 lg:p-14">
//             {/* ===== LEFT: message + contact ===== */}
//             <motion.div
//               initial={reduce ? false : { opacity: 0, x: -24 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
//               className="flex min-w-0 flex-col lg:self-stretch"
//             >
//               <h2
//                 id="cta-callback-heading"
//                 className={`${serif} text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.08] tracking-tight text-[#faf9f6]`}
//               >
//                 Let Us Call You Back
//               </h2>
//               <span
//                 aria-hidden="true"
//                 className={`mt-6 block h-[3px] w-20 rounded-full ${goldBg}`}
//               />
//               <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-[#faf9f6]/70 sm:text-base">
//                 Tell us what you are looking for. Our team will call with
//                 honest, no-pressure guidance and shortlist properties that match
//                 your budget and preferences.
//               </p>

//               <ul className="mt-10 space-y-3">
//                 {contactLinks.map(
//                   ({ icon: Icon, label, value, href, external }) => {
//                     const content = (
//                       <>
//                         <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#faf9f6]/10 text-[#E2A10D] ring-1 ring-[#faf9f6]/10 transition duration-300 group-hover:bg-gradient-to-br group-hover:from-[#E2A10D] group-hover:to-[#FFCD39] group-hover:text-[#000000] group-hover:ring-transparent">
//                           <Icon size={20} aria-hidden="true" />
//                         </span>
//                         <span className="min-w-0 flex-1">
//                           <span className="block text-xs text-[#faf9f6]/55">
//                             {label}
//                           </span>
//                           <span className="mt-0.5 block break-words text-base text-[#faf9f6]">
//                             {value}
//                           </span>
//                         </span>
//                         {href && (
//                           <FiArrowRight
//                             size={16}
//                             aria-hidden="true"
//                             className="shrink-0 text-[#faf9f6]/40 transition duration-300 group-hover:translate-x-1 group-hover:text-[#E2A10D]"
//                           />
//                         )}
//                       </>
//                     );
//                     const rowClass =
//                       "group flex items-center gap-4 rounded-2xl border border-[#faf9f6]/10 bg-[#faf9f6]/[0.04] p-3.5 transition duration-300 hover:border-[#E2A10D]/50 hover:bg-[#faf9f6]/[0.07]";
//                     return (
//                       <li key={label}>
//                         {href ? (
//                           <a
//                             href={href}
//                             {...(external && {
//                               target: "_blank",
//                               rel: "noopener noreferrer",
//                             })}
//                             className={`${rowClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39]`}
//                           >
//                             {content}
//                           </a>
//                         ) : (
//                           <div className={rowClass}>{content}</div>
//                         )}
//                       </li>
//                     );
//                   },
//                 )}
//               </ul>

//               <CallVisual reduce={reduce} />
//             </motion.div>

//             {/* ===== RIGHT: form card ===== */}
//             <motion.div
//               initial={reduce ? false : { opacity: 0, x: 24 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
//               className="relative min-w-0 overflow-hidden rounded-3xl bg-[#faf9f6] p-5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] ring-1 ring-[#D4AF37]/30 sm:p-7"
//             >
//               <span
//                 aria-hidden="true"
//                 className={`absolute inset-x-0 top-0 h-[2px] ${goldBg}`}
//               />

//               {status === "success" ? (
//                 <div aria-live="polite" className="py-10 text-center">
//                   <motion.span
//                     initial={reduce ? false : { scale: 0.6, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ type: "spring", stiffness: 260, damping: 18 }}
//                     className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[#000000] shadow-[0_12px_30px_-8px_rgba(212,175,55,0.7)] ${goldBg}`}
//                   >
//                     <FiCheck size={28} strokeWidth={2.5} aria-hidden="true" />
//                   </motion.span>
//                   <h3
//                     className={`${serif} mt-6 text-2xl text-[#000000] sm:text-3xl`}
//                   >
//                     Request received
//                   </h3>
//                   <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#52685B]">
//                     Thank you! We’ll call you back shortly with options that
//                     match your requirements.
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => setStatus("idle")}
//                     className="mt-7 text-sm text-[#52685B] underline underline-offset-4 transition hover:text-[#000000]"
//                   >
//                     Send another request
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <h3
//                     className={`${serif} text-2xl text-[#000000] sm:text-3xl`}
//                   >
//                     Request a Callback
//                   </h3>
//                   <p className="mt-2 max-w-md text-sm leading-relaxed text-[#52685B]">
//                     Name and phone are required. The rest helps us prepare
//                     better options for you.
//                   </p>
//                   <span
//                     aria-hidden="true"
//                     className="mt-4 block h-px w-full bg-gradient-to-r from-[#D4AF37]/50 via-[#000000]/10 to-transparent"
//                   />

//                   <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//                     {/* Name + Phone */}
//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <div>
//                         <label htmlFor="cta-name" className={labelClass}>
//                           Full name
//                         </label>
//                         <div className="group relative">
//                           <FiUser
//                             size={17}
//                             className={fieldIcon}
//                             aria-hidden="true"
//                           />
//                           <input
//                             id="cta-name"
//                             name="name"
//                             type="text"
//                             required
//                             autoComplete="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             disabled={loading}
//                             placeholder="Your full name"
//                             className={fieldClass}
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label htmlFor="cta-phone" className={labelClass}>
//                           Phone number
//                         </label>
//                         <div className="group relative">
//                           <FiPhone
//                             size={17}
//                             className={fieldIcon}
//                             aria-hidden="true"
//                           />
//                           <input
//                             id="cta-phone"
//                             name="phone"
//                             type="tel"
//                             required
//                             autoComplete="tel"
//                             inputMode="tel"
//                             pattern="[0-9+\-\s]{10,15}"
//                             title="Enter a valid phone number"
//                             value={form.phone}
//                             onChange={handleChange}
//                             disabled={loading}
//                             placeholder="+91 00000 00000"
//                             className={fieldClass}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Intent + Budget */}
//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <ChipGroup
//                         legend="I want to"
//                         name="intent"
//                         options={INTENTS}
//                         value={form.intent}
//                         onChange={handleChange}
//                         disabled={loading}
//                         segmented
//                       />

//                       <div>
//                         <label htmlFor="cta-budget" className={labelClass}>
//                           {isRent ? "Monthly budget" : "Budget"}
//                         </label>
//                         <div className="group relative">
//                           <span
//                             aria-hidden="true"
//                             className={`${fieldIcon} text-base leading-none`}
//                           >
//                             ₹
//                           </span>
//                           <select
//                             id="cta-budget"
//                             name="budget"
//                             value={form.budget}
//                             onChange={handleChange}
//                             disabled={loading}
//                             className={selectClass}
//                           >
//                             <option value="">Select a range</option>
//                             {budgetOptions.map((b) => (
//                               <option key={b} value={b}>
//                                 {b}
//                               </option>
//                             ))}
//                           </select>
//                           <FiChevronDown
//                             size={17}
//                             aria-hidden="true"
//                             className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#52685B]"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Property type */}
//                     <ChipGroup
//                       legend="Property type"
//                       name="propertyType"
//                       options={PROPERTY_TYPES}
//                       value={form.propertyType}
//                       onChange={handleChange}
//                       disabled={loading}
//                     />

//                     {/* BHK (flat / villa only) */}
//                     <AnimatePresence initial={false}>
//                       {showBhk && (
//                         <motion.div
//                           key="bhk"
//                           initial={reduce ? false : { opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: "auto" }}
//                           exit={{ opacity: 0, height: 0 }}
//                           transition={{ duration: 0.3, ease: "easeOut" }}
//                           className="overflow-hidden"
//                         >
//                           <ChipGroup
//                             legend="Configuration"
//                             name="bhk"
//                             options={BHK_OPTIONS}
//                             value={form.bhk}
//                             onChange={handleChange}
//                             disabled={loading}
//                           />
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     {/* Location + Best time to call */}
//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <div>
//                         <label htmlFor="cta-location" className={labelClass}>
//                           Preferred location
//                         </label>
//                         <div className="group relative">
//                           <FiMapPin
//                             size={17}
//                             className={fieldIcon}
//                             aria-hidden="true"
//                           />
//                           <input
//                             id="cta-location"
//                             name="location"
//                             type="text"
//                             value={form.location}
//                             onChange={handleChange}
//                             disabled={loading}
//                             placeholder="Area or city"
//                             className={fieldClass}
//                           />
//                         </div>
//                       </div>

//                       <div className="relative">
//                         <label htmlFor="cta-calltime" className={labelClass}>
//                           Best time to call
//                         </label>
//                         <div className="group relative">
//                           <FiPhone
//                             size={17}
//                             className={fieldIcon}
//                             aria-hidden="true"
//                           />
//                           <select
//                             id="cta-calltime"
//                             name="callTime"
//                             value={form.callTime}
//                             onChange={handleChange}
//                             disabled={loading}
//                             className={selectClass}
//                           >
//                             {CALL_TIMES.map((t) => (
//                               <option key={t} value={t}>
//                                 {t}
//                               </option>
//                             ))}
//                           </select>
//                           <FiChevronDown
//                             size={17}
//                             aria-hidden="true"
//                             className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#52685B]"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Notes */}
//                     <div>
//                       <label htmlFor="cta-notes" className={labelClass}>
//                         Anything else we should know?
//                       </label>
//                       <textarea
//                         id="cta-notes"
//                         name="notes"
//                         rows={2}
//                         maxLength={500}
//                         value={form.notes}
//                         onChange={handleChange}
//                         disabled={loading}
//                         placeholder="Possession timeline, parking, near a metro, loan needed..."
//                         className="w-full resize-none rounded-xl border border-[#000000]/12 bg-[#f3f0E8]/50 px-4 py-3 text-[15px] text-[#000000] placeholder:text-[#52685B]/60 transition duration-300 hover:border-[#000000]/25 focus:border-[#D4AF37] focus:bg-[#faf9f6] focus:outline-none focus:ring-4 focus:ring-[#ffcd39]/25 disabled:opacity-60"
//                       />
//                     </div>

//                     <div className="space-y-3 pt-1">
//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className="group relative inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#000000] py-2.5 pl-7 pr-2.5 text-base text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#000000] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
//                       >
//                         <span
//                           aria-hidden="true"
//                           className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] transition-transform duration-500 ease-out group-hover:scale-x-100"
//                         />
//                         <span
//                           aria-hidden="true"
//                           className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
//                         />
//                         <span className="relative z-10 text-nowrap">
//                           {loading ? "Sending..." : "Request Callback"}
//                         </span>
//                         <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] text-[#000000] transition-all duration-500 group-hover:bg-none group-hover:bg-[#000000] group-hover:text-[#F5D77A]">
//                           {loading ? (
//                             <CgSpinner
//                               size={20}
//                               className="animate-spin"
//                               aria-hidden="true"
//                             />
//                           ) : (
//                             <FiArrowRight
//                               size={16}
//                               className="transition-transform duration-500 group-hover:-rotate-45"
//                               aria-hidden="true"
//                             />
//                           )}
//                         </span>
//                       </button>

//                       <p className="flex items-center justify-center gap-2 text-xs text-[#52685B]">
//                         <FiLock size={13} aria-hidden="true" />
//                         Your details stay private. We never share your number.
//                       </p>
//                     </div>

//                     <div aria-live="polite">
//                       {status === "error" && (
//                         <p
//                           role="alert"
//                           className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//                         >
//                           <FiAlertCircle
//                             size={18}
//                             className="mt-0.5 shrink-0"
//                             aria-hidden="true"
//                           />
//                           {errorMsg}
//                         </p>
//                       )}
//                     </div>
//                   </form>
//                 </>
//               )}
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }



"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Marcellus } from "next/font/google";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiPhone,
  FiArrowRight,
  FiCheck,
  FiAlertCircle,
  FiLock,
  FiUser,
  FiMapPin,
  FiChevronDown,
  FiHome,
  FiKey,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const serif = `${marcellus.className} font-normal`;

const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

// TODO: replace with your real details
const PHONE = "+91 9999300301";
const PHONE_HREF = "tel:+919999300301";
const WHATSAPP_URL = "https://wa.me/919999300301";

const contactLinks = [
  { icon: FiPhone, label: "Call us", value: PHONE, href: PHONE_HREF },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: "Chat with our team",
    href: WHATSAPP_URL,
    external: true,
  },
];

/* ---------- Form options ---------- */
const INTENTS = ["Buy", "Rent", "Invest"];

const PROPERTY_TYPES = [
  "Flat / Apartment",
  "Villa / House",
  "Plot / Land",
  "Commercial",
  "Other",
];

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];

const BUY_BUDGETS = [
  "Under ₹50 Lakh",
  "₹50 Lakh – ₹1 Cr",
  "₹1 Cr – ₹2 Cr",
  "₹2 Cr – ₹5 Cr",
  "Above ₹5 Cr",
];

const RENT_BUDGETS = [
  "Under ₹15,000 / month",
  "₹15,000 – ₹30,000 / month",
  "₹30,000 – ₹60,000 / month",
  "Above ₹60,000 / month",
];

const CALL_TIMES = ["Morning", "Afternoon", "Evening", "Anytime"];

const initialForm = {
  name: "",
  phone: "",
  intent: "Buy",
  propertyType: "Flat / Apartment",
  bhk: "",
  budget: "",
  location: "",
  callTime: "Anytime",
  notes: "",
};

/* ---------- Shared classes ---------- */
const fieldClass =
  "w-full rounded-xl border border-[#000000]/12 bg-[#f3f0E8]/50 py-3 pl-12 pr-4 text-[15px] text-[#000000] placeholder:text-[#52685B]/60 transition duration-300 hover:border-[#000000]/25 focus:border-[#D4AF37] focus:bg-[#faf9f6] focus:outline-none focus:ring-4 focus:ring-[#ffcd39]/25 disabled:opacity-60";
const selectClass = `${fieldClass} appearance-none pr-11`;
const labelClass = "mb-1.5 block text-[13px] tracking-wide text-[#000000]";
const fieldIcon =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B] transition-colors group-focus-within:text-[#E2A10D]";

/* ---------- Chip group (radio buttons styled as pills / segmented) ---------- */
function ChipGroup({
  legend,
  name,
  options,
  value,
  onChange,
  disabled,
  segmented = false,
}) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className={labelClass}>{legend}</legend>
      <div
        className={
          segmented
            ? "grid gap-1 rounded-full border border-[#000000]/12 bg-[#f3f0E8]/60 p-1"
            : "flex flex-wrap gap-1.5"
        }
        style={
          segmented
            ? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }
            : undefined
        }
      >
        {options.map((opt) => {
          const checked = value === opt;
          return (
            <label key={opt} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={opt}
                checked={checked}
                onChange={onChange}
                className="peer sr-only"
              />
              <span
                className={`flex items-center justify-center gap-1.5 transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-[#D4AF37] peer-focus-visible:ring-offset-2 ${
                  segmented
                    ? "rounded-full px-1 py-2.5 text-[13px] sm:text-sm"
                    : "rounded-full border px-3.5 py-1.5 text-[13px] sm:text-sm"
                } ${
                  checked
                    ? `text-[#000000] shadow-[0_6px_16px_-6px_rgba(212,175,55,0.7)] ${goldBg} ${
                        segmented ? "" : "border-transparent"
                      }`
                    : segmented
                    ? "text-[#000000]/70 hover:text-[#000000]"
                    : "border-[#000000]/12 bg-[#f3f0E8]/50 text-[#000000] hover:border-[#D4AF37] hover:bg-[#faf9f6]"
                }`}
              >
                {checked && !segmented && (
                  <FiCheck size={13} strokeWidth={3} aria-hidden="true" />
                )}
                {opt}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ---------- Animated radar visual (left column filler) ---------- */
const SWEEP_SECONDS = 6;

const BLIPS = [
  { icon: FiMapPin, x: 30, y: 26 },
  { icon: FiHome, x: 76, y: 30 },
  { icon: FiKey, x: 80, y: 70 },
  { icon: FiMapPin, x: 24, y: 72 },
].map((b) => {
  const dx = b.x - 50;
  const dy = 50 - b.y;
  const angle = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
  return { ...b, delay: (angle / 360) * SWEEP_SECONDS };
});

const corner =
  "absolute h-4 w-4 border-[#D4AF37]/50 pointer-events-none";

function CallVisual({ reduce }) {
  return (
    <div
      aria-hidden="true"
      className="relative mt-8 hidden min-h-[220px] flex-1 overflow-hidden rounded-2xl border border-[#faf9f6]/10 bg-gradient-to-br from-[#faf9f6]/[0.06] via-[#faf9f6]/[0.02] to-transparent lg:block"
    >
      {/* dotted texture */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(#faf9f6 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      {/* corner brackets */}
      <span className={`${corner} left-3 top-3 border-l border-t`} />
      <span className={`${corner} right-3 top-3 border-r border-t`} />
      <span className={`${corner} bottom-3 left-3 border-b border-l`} />
      <span className={`${corner} bottom-3 right-3 border-b border-r`} />

      {/* square radar stage */}
      <div className="absolute left-1/2 top-1/2 aspect-square h-[88%] max-h-[300px] -translate-x-1/2 -translate-y-1/2">
        {/* glow */}
        <motion.span
          animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[18%] rounded-full bg-[#e2a10d]/20 blur-2xl"
        />

        {/* rings */}
        <span className="absolute inset-0 rounded-full border border-[#D4AF37]/35" />
        <span className="absolute inset-[17%] rounded-full border border-[#D4AF37]/20" />
        <span className="absolute inset-[34%] rounded-full border border-[#D4AF37]/20" />
        {/* crosshair */}
        <span className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D4AF37]/25 to-transparent" />
        <span className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent" />

        {/* sweep */}
        <motion.div
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: SWEEP_SECONDS, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 230deg, rgba(255,205,57,0.28) 360deg)",
          }}
        >
          <span className="absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#ffcd39] to-transparent" />
        </motion.div>

        {/* blips */}
        {BLIPS.map(({ icon: Icon, x, y, delay }, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {!reduce && (
              <motion.span
                animate={{ scale: [1, 2.6, 2.6], opacity: [0.7, 0, 0] }}
                transition={{
                  duration: SWEEP_SECONDS,
                  delay,
                  repeat: Infinity,
                  times: [0, 0.3, 1],
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full border border-[#ffcd39]"
              />
            )}
            <motion.span
              animate={
                reduce
                  ? { opacity: 1 }
                  : { scale: [0.85, 1.2, 1, 0.9], opacity: [0.35, 1, 0.85, 0.35] }
              }
              transition={{
                duration: SWEEP_SECONDS,
                delay,
                repeat: Infinity,
                times: [0, 0.05, 0.35, 1],
                ease: "easeOut",
              }}
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#000000] text-[#F5D77A] ring-1 ring-[#D4AF37]/60 sm:h-9 sm:w-9"
            >
              <Icon size={15} />
            </motion.span>
          </span>
        ))}

        {/* centre: ringing phone */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {!reduce &&
            [0, 1].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.5, 0], scale: [1, 2.2] }}
                transition={{
                  duration: 2.6,
                  delay: i * 1.3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full border border-[#ffcd39]/70"
              />
            ))}
          <motion.span
            animate={reduce ? undefined : { rotate: [0, -12, 12, -8, 8, 0, 0, 0, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`relative flex h-14 w-14 items-center justify-center rounded-full text-[#000000] shadow-[0_10px_30px_-6px_rgba(212,175,55,0.75)] ring-4 ring-[#000000] ${goldBg}`}
          >
            <FiPhone size={22} />
          </motion.span>
        </div>
      </div>
    </div>
  );
}

export default function CTACallback({ image = null }) {
  const reduce = useReducedMotion();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isRent = form.intent === "Rent";
  const showBhk = ["Flat / Apartment", "Villa / House"].includes(
    form.propertyType
  );
  const budgetOptions = isRent ? RENT_BUDGETS : BUY_BUDGETS;

  const showBhkFor = (type) =>
    ["Flat / Apartment", "Villa / House"].includes(type);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => {
      const next = { ...p, [name]: value };
      // Buy/Invest and Rent use different budget scales, so reset on switch
      if (name === "intent" && (value === "Rent") !== (p.intent === "Rent")) {
        next.budget = "";
      }
      // BHK only applies to flats and villas
      if (name === "propertyType" && !showBhkFor(value)) {
        next.bhk = "";
      }
      return next;
    });
  };

  const buildMessage = () => {
    const lines = [
      "Customer requested a callback from the website.",
      `Looking to: ${form.intent}`,
      `Property type: ${form.propertyType}`,
      form.bhk && `Configuration: ${form.bhk}`,
      form.budget && `Budget: ${form.budget}`,
      form.location.trim() && `Preferred location: ${form.location.trim()}`,
      `Best time to call: ${form.callTime}`,
      form.notes.trim() && `Notes: ${form.notes.trim()}`,
    ];
    return lines.filter(Boolean).join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: "",
          enquiryType: "Callback Request",
          intent: form.intent,
          propertyType: form.propertyType,
          bhk: form.bhk,
          budget: form.budget,
          location: form.location,
          callTime: form.callTime,
          message: buildMessage(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      console.error("Callback request error:", error);
      setErrorMsg(
        error.message || "Unable to submit callback request. Please try again."
      );
      setStatus("error");
    }
  };

  const loading = status === "loading";

  return (
    <section
      className="relative bg-[#f3f0E8] py-16 sm:py-20 lg:py-28"
      aria-labelledby="cta-callback-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[28px] bg-[#000000] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] ring-1 ring-[#D4AF37]/20 sm:rounded-[32px]"
        >
          {/* top gold line */}
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 z-10 h-[3px] ${goldBg}`}
          />
          {image && (
            <>
              <img
                src={image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-[#000000]/80" />
            </>
          )}

          {/* ambient glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#e2a10d]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffcd39]/10 blur-3xl"
          />
          {/* fine grid texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#faf9f6 1px, transparent 1px), linear-gradient(90deg, #faf9f6 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse at 20% 30%, black 0%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 20% 30%, black 0%, transparent 70%)",
            }}
          />

          <div className="relative grid items-start gap-10 p-5 sm:p-10 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16 lg:p-14">
            {/* ===== LEFT: message + contact ===== */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="flex min-w-0 flex-col lg:self-stretch"
            >
              <h2
                id="cta-callback-heading"
                className={`${serif} text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.08] tracking-tight text-[#faf9f6]`}
              >
                Let Us Call You Back
              </h2>
              <span
                aria-hidden="true"
                className={`mt-6 block h-[3px] w-20 rounded-full ${goldBg}`}
              />
              <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-[#faf9f6]/70 sm:text-base">
                Tell us what you are looking for. Our team will call with
                honest, no-pressure guidance and shortlist properties that match
                your budget and preferences.
              </p>

              <ul className="mt-10 space-y-3">
                {contactLinks.map(({ icon: Icon, label, value, href, external }) => {
                  const content = (
                    <>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#faf9f6]/10 text-[#E2A10D] ring-1 ring-[#faf9f6]/10 transition duration-300 group-hover:bg-gradient-to-br group-hover:from-[#E2A10D] group-hover:to-[#FFCD39] group-hover:text-[#000000] group-hover:ring-transparent">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-[#faf9f6]/55">
                          {label}
                        </span>
                        <span className="mt-0.5 block break-words text-base text-[#faf9f6]">
                          {value}
                        </span>
                      </span>
                      {href && (
                        <FiArrowRight
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-[#faf9f6]/40 transition duration-300 group-hover:translate-x-1 group-hover:text-[#E2A10D]"
                        />
                      )}
                    </>
                  );
                  const rowClass =
                    "group flex items-center gap-4 rounded-2xl border border-[#faf9f6]/10 bg-[#faf9f6]/[0.04] p-3.5 transition duration-300 hover:border-[#E2A10D]/50 hover:bg-[#faf9f6]/[0.07]";
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          {...(external && {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          })}
                          className={`${rowClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39]`}
                        >
                          {content}
                        </a>
                      ) : (
                        <div className={rowClass}>{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <CallVisual reduce={reduce} />
            </motion.div>

            {/* ===== RIGHT: form card ===== */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="relative min-w-0 overflow-hidden rounded-3xl bg-[#faf9f6] p-5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] ring-1 ring-[#D4AF37]/30 sm:p-7"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-[2px] ${goldBg}`}
              />

              {status === "success" ? (
                <div aria-live="polite" className="py-10 text-center">
                  <motion.span
                    initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[#000000] shadow-[0_12px_30px_-8px_rgba(212,175,55,0.7)] ${goldBg}`}
                  >
                    <FiCheck size={28} strokeWidth={2.5} aria-hidden="true" />
                  </motion.span>
                  <h3
                    className={`${serif} mt-6 text-2xl text-[#000000] sm:text-3xl`}
                  >
                    Request received
                  </h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#52685B]">
                    Thank you! We’ll call you back shortly with options that
                    match your requirements.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-7 text-sm text-[#52685B] underline underline-offset-4 transition hover:text-[#000000]"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <>
                  <h3
                    className={`${serif} text-2xl text-[#000000] sm:text-3xl`}
                  >
                    Request a Callback
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[#52685B]">
                    Name and phone are required. The rest helps us prepare
                    better options for you.
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-4 block h-px w-full bg-gradient-to-r from-[#D4AF37]/50 via-[#000000]/10 to-transparent"
                  />

                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Name + Phone */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="cta-name" className={labelClass}>
                          Full name
                        </label>
                        <div className="group relative">
                          <FiUser size={17} className={fieldIcon} aria-hidden="true" />
                          <input
                            id="cta-name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            value={form.name}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Your full name"
                            className={fieldClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cta-phone" className={labelClass}>
                          Phone number
                        </label>
                        <div className="group relative">
                          <FiPhone size={17} className={fieldIcon} aria-hidden="true" />
                          <input
                            id="cta-phone"
                            name="phone"
                            type="tel"
                            required
                            autoComplete="tel"
                            inputMode="tel"
                            pattern="[0-9+\-\s]{10,15}"
                            title="Enter a valid phone number"
                            value={form.phone}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="+91 00000 00000"
                            className={fieldClass}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Intent + Budget */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ChipGroup
                        legend="I want to"
                        name="intent"
                        options={INTENTS}
                        value={form.intent}
                        onChange={handleChange}
                        disabled={loading}
                        segmented
                      />

                      <div>
                        <label htmlFor="cta-budget" className={labelClass}>
                          {isRent ? "Monthly budget" : "Budget"}
                        </label>
                        <div className="group relative">
                          <span
                            aria-hidden="true"
                            className={`${fieldIcon} text-base leading-none`}
                          >
                            ₹
                          </span>
                          <select
                            id="cta-budget"
                            name="budget"
                            value={form.budget}
                            onChange={handleChange}
                            disabled={loading}
                            className={selectClass}
                          >
                            <option value="">Select a range</option>
                            {budgetOptions.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#52685B]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Property type */}
                    <ChipGroup
                      legend="Property type"
                      name="propertyType"
                      options={PROPERTY_TYPES}
                      value={form.propertyType}
                      onChange={handleChange}
                      disabled={loading}
                    />

                    {/* BHK (flat / villa only) */}
                    <AnimatePresence initial={false}>
                      {showBhk && (
                        <motion.div
                          key="bhk"
                          initial={reduce ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <ChipGroup
                            legend="Configuration"
                            name="bhk"
                            options={BHK_OPTIONS}
                            value={form.bhk}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Location + Best time to call */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="cta-location" className={labelClass}>
                          Preferred location
                        </label>
                        <div className="group relative">
                          <FiMapPin size={17} className={fieldIcon} aria-hidden="true" />
                          <input
                            id="cta-location"
                            name="location"
                            type="text"
                            value={form.location}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Area or city"
                            className={fieldClass}
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <label htmlFor="cta-calltime" className={labelClass}>
                          Best time to call
                        </label>
                        <div className="group relative">
                          <FiPhone size={17} className={fieldIcon} aria-hidden="true" />
                          <select
                            id="cta-calltime"
                            name="callTime"
                            value={form.callTime}
                            onChange={handleChange}
                            disabled={loading}
                            className={selectClass}
                          >
                            {CALL_TIMES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#52685B]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label htmlFor="cta-notes" className={labelClass}>
                        Anything else we should know?
                      </label>
                      <textarea
                        id="cta-notes"
                        name="notes"
                        rows={2}
                        maxLength={500}
                        value={form.notes}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Possession timeline, parking, near a metro, loan needed..."
                        className="w-full resize-none rounded-xl border border-[#000000]/12 bg-[#f3f0E8]/50 px-4 py-3 text-[15px] text-[#000000] placeholder:text-[#52685B]/60 transition duration-300 hover:border-[#000000]/25 focus:border-[#D4AF37] focus:bg-[#faf9f6] focus:outline-none focus:ring-4 focus:ring-[#ffcd39]/25 disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-3 pt-1">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#000000] py-2.5 pl-7 pr-2.5 text-base text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#000000] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] transition-transform duration-500 ease-out group-hover:scale-x-100"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
                        />
                        <span className="relative z-10 text-nowrap">
                          {loading ? "Sending..." : "Request Callback"}
                        </span>
                        <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] text-[#000000] transition-all duration-500 group-hover:bg-none group-hover:bg-[#000000] group-hover:text-[#F5D77A]">
                          {loading ? (
                            <CgSpinner size={20} className="animate-spin" aria-hidden="true" />
                          ) : (
                            <FiArrowRight
                              size={16}
                              className="transition-transform duration-500 group-hover:-rotate-45"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </button>

                      <p className="flex items-center justify-center gap-2 text-xs text-[#52685B]">
                        <FiLock size={13} aria-hidden="true" />
                        Your details stay private. We never share your number.
                      </p>
                    </div>

                    <div aria-live="polite">
                      {status === "error" && (
                        <p
                          role="alert"
                          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                          <FiAlertCircle
                            size={18}
                            className="mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          {errorMsg}
                        </p>
                      )}
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
