
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Marcellus } from "next/font/google";
import { PHONE_HREF } from "@/data/contactData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const Eyebrow = ({ children }) => (
  <motion.div
    variants={fadeUp}
    className="flex items-center gap-3"
  >
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="h-px w-10 origin-left bg-gradient-to-r from-[#D4AF37] to-[#FFCD39]"
    />
    <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#E2A10D]">
      {children}
    </span>
  </motion.div>
);

const BtnDark = ({ href, children }) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.97 }}
    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-black py-2.5 pl-6 pr-2.5 text-sm font-medium text-white ring-1 ring-[#D4AF37]/50 transition duration-300 hover:text-black"
  >
    <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 group-hover:scale-x-100" />

    <span className="relative z-10">{children}</span>

    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-black">
      <ArrowRight
        size={15}
        className="transition-transform duration-300 group-hover:-rotate-45"
      />
    </span>
  </motion.a>
);

export default function ContactHero() {
  return (
    <section
      aria-labelledby="contact-hero"
      className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-black lg:min-h-[580px]"
    >
      {/* Animated Background Image */}
      <motion.div
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/image/contact.png"
          alt="Luxury modern property at sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center]"
        />
      </motion.div>

      {/* Desktop Black Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 via-35% to-black/10" />

      {/* Mobile Black Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/30 md:hidden" />

      {/* Animated Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:py-16"
      >
        <div className="max-w-xl text-white">
          <Eyebrow>Get in Touch</Eyebrow>

          <motion.h1
            id="contact-hero"
            variants={fadeUp}
            className={`${marcellus.className} mt-5 text-4xl font-normal leading-[1.08] sm:text-5xl lg:text-6xl`}
          >
            Let’s Start a
            <br />
            <span className="text-[#E2A10D]">
              Conversation
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-sm leading-7 text-white/85 sm:text-base"
          >
            Have a question, project idea, or need expert guidance? Our team is
            here to help you with the right information and support. Reach out
            and we’ll get back to you with the right guidance.
          </motion.p>

          {/* Animated Buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <BtnDark href="#enquiry-form">
              Send an Enquiry
            </BtnDark>

            <motion.a
              href={PHONE_HREF}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
            >
              <Phone size={16} />
              Call Us
            </motion.a>
          </motion.div>

          {/* Animated Highlights */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center gap-6 sm:gap-8"
          >
            <div className="shrink-0">
              <p className={`${marcellus.className} text-4xl text-white sm:text-5xl`}>
                24/7
              </p>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                We’re Here to Help
              </p>
            </div>

            <span className="h-12 w-px bg-white/30" />

            <p className={`${marcellus.className} text-xl leading-tight text-white/90 sm:text-2xl`}>
              Quick Replies,
              <br />
              Real Guidance
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
