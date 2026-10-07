"use client";

import { Marcellus } from "next/font/google";
import {
  ArrowUpRight,
  Building2,
  Factory,
  Home,
  Landmark,
  Handshake,
  ShieldCheck,
  Wrench,
  BriefcaseBusiness,
} from "lucide-react";
import { motion } from "framer-motion";

// ============================================================
// MARCELLUS FONT
// ============================================================

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
});

// ============================================================
// MAIN BUSINESS VERTICALS
// ============================================================

const mainVerticals = [
  {
    icon: Home,
    title: "Residential Properties",
    text: "Buy, sell or rent homes in Noida, Greater Noida and the Yamuna Expressway.",
  },
  {
    icon: Factory,
    title: "Industry Sales",
    text: "Industrial properties, factories, plots and warehouses to buy, sell or lease in the same areas.",
  },
  {
    icon: Building2,
    title: "Commercial Co-Leasing",
    text: "Commercial buildings you can share and lease with other businesses.",
  },
  {
    icon: Wrench,
    title: "Construction & Interiors",
    text: "Building, interior and renovation work for homes, offices and plants.",
  },
];

// ============================================================
// ADDITIONAL SUPPORT SERVICES
// ============================================================

const supportServices = [
  {
    icon: Handshake,
    title: "Builder Liaisoning",
    text: "We handle all builder paperwork for new and existing deals.",
  },
  {
    icon: Landmark,
    title: "Government Liaisoning",
    text: "We manage approvals and paperwork with state and central authorities.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Corporate Solutions",
    text: "A dedicated team for leading industries, covering land, new buildings, approvals and staff accommodation.",
  },
];

// ============================================================
// COMING SOON
// ============================================================

const comingSoon = {
  icon: ShieldCheck,
  title: "Bringo Validator",
  text: "Digitise property documents and verify records, so deals start only after the paperwork checks out.",
};

// ============================================================
// COMPONENT
// ============================================================

export default function WhatWeDo() {
  return (
    <section
      id="what-we-do"
      aria-labelledby="what-we-do-title"
      className="bg-[#FAF9F6] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* ==================================================
            SECTION HEADER
        ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            What We Do
          </p>

          <h2
            id="what-we-do-title"
            className={`${marcellus.className} mt-4 text-3xl font-normal leading-tight text-[#1A2A22] sm:text-5xl lg:text-6xl`}
          >
            More Than Property.
            <span className="mt-1 block whitespace-nowrap">
              Complete Real Estate Solutions.
            </span>
          </h2>
        </motion.div>

        {/* ==================================================
            MAIN VERTICALS
        ================================================== */}

        <div className="mt-14">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#1A2A22]/10" />

            <h3
              className={`${marcellus.className} whitespace-nowrap text-lg font-normal text-[#1A2A22]`}
            >
              Our Core Verticals
            </h3>

            <span className="h-px flex-1 bg-[#1A2A22]/10" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {mainVerticals.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group relative overflow-hidden border border-[#1A2A22]/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-xl"
                >
                  {/* Number */}
                  <span className="absolute right-5 top-5 text-xs font-medium text-[#1A2A22]/20">
                    0{index + 1}
                  </span>

                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center bg-[#1A2A22] text-[#D4AF37] transition-colors duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#1A2A22]">
                    <Icon size={22} strokeWidth={1.6} />
                  </div>

                  {/* Title */}
                  <h4
                    className={`${marcellus.className} mt-7 text-xl font-normal text-[#1A2A22]`}
                  >
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-6 text-[#52685B]">
                    {item.text}
                  </p>

                  {/* Gold hover line */}
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            ADDITIONAL SUPPORT
        ================================================== */}

        <div className="mt-16">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#1A2A22]/10" />

            <h3
              className={`${marcellus.className} whitespace-nowrap text-lg font-normal text-[#1A2A22]`}
            >
              Additional Support
            </h3>

            <span className="h-px flex-1 bg-[#1A2A22]/10" />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {supportServices.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group flex gap-5 border border-[#1A2A22]/10 bg-[#F3F0E8] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-lg"
                >
                  {/* Icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#1A2A22] text-[#D4AF37] transition-colors duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#1A2A22]">
                    <Icon size={20} strokeWidth={1.6} />
                  </div>

                  <div>
                    {/* Title */}
                    <h4
                      className={`${marcellus.className} text-lg font-normal text-[#1A2A22]`}
                    >
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-6 text-[#52685B]">
                      {item.text}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            COMING SOON — BRINGO VALIDATOR
        ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 overflow-hidden border border-[#1A2A22]/15 bg-[#1A2A22]"
        >
          <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">

            <div className="flex items-start gap-5">

              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37]">
                <comingSoon.icon size={22} strokeWidth={1.5} />
              </div>

              <div>

                {/* Badge */}
                <div className="mb-2 inline-flex items-center border border-[#D4AF37]/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                  Coming Soon
                </div>

                {/* Title */}
                <h3
                  className={`${marcellus.className} text-2xl font-normal text-[#FAF9F6]`}
                >
                  {comingSoon.title}
                </h3>

                {/* Description */}
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#FAF9F6]/65">
                  {comingSoon.text}
                </p>

              </div>
            </div>

            {/* Arrow */}
            <ArrowUpRight
              size={26}
              className="hidden shrink-0 text-[#D4AF37] sm:block"
            />

          </div>
        </motion.div>

      </div>
    </section>
  );
}