"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Marcellus } from "next/font/google";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import { testimonials } from "@/data/testimonialData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const goldBg = "bg-gradient-to-br from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?gs_ssp=eJzj4tVP1zc0zDHLtTRJT8ozYLRSNagwtjRITk1KMTA0Mk6xsEhKszKosACyjSwtzE2NzFPMzEzMvYSSijLz0vMVilITcxRSi0sSS1IB9PgVYA&q=bringo+real+estate&oq=bringo+re&gs_lcrp=EgZjaHJvbWUqDQgCEC4YrwEYxwEYgAQyBggAEEUYOTIGCAEQIxgnMg0IAhAuGK8BGMcBGIAEMgcIAxAAGIAEMgcIBBAAGIAEMggIBRAAGBYYHjIICAYQABgWGB4yBggHEEUYPdIBCDY1NjRqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x390cebd0123d88bf:0x81232987527d6647,1,,,,";

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const pad = (n) => String(n).padStart(2, "0");

export default function Testimonials() {
  const [[index, direction], setPage] = useState([0, 1]);
  const reduceMotion = useReducedMotion();
  const total = testimonials.length;
  const current = testimonials[index];

  const go = (dir) => setPage(([i]) => [(i + dir + total) % total, dir]);
  const goTo = (i) => setPage(([prev]) => [i, i > prev ? 1 : -1]);

  const slide = reduceMotion ? 0 : 36;
  const variants = {
    enter: (d) => ({ opacity: 0, x: d * slide }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d * -slide }),
  };

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: "easeOut" },
  });

  const arrowClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#000000]/20 bg-[#faf9f6] text-[#000000] transition duration-300 hover:border-transparent hover:bg-gradient-to-br hover:from-[#e2a10d] hover:via-[#ffcd39] hover:to-[#e2a10d] hover:shadow-[0_8px_20px_-6px_rgba(212,175,55,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f6] sm:h-12 sm:w-12";

  return (
    <section
      className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.3fr] lg:gap-x-16 lg:gap-y-0 lg:px-8">
        {/* ===== Heading + intro ===== */}
        <motion.div
          {...reveal(0)}
          className="min-w-0 text-center lg:col-start-1 lg:row-start-1 lg:self-end lg:text-left"
        >
          <h2
            id="testimonials-heading"
            className={`${marcellus.className} text-[clamp(1.9rem,4vw,3rem)] font-normal leading-tight tracking-tight text-[#000000]`}
          >
            Trusted by Families and Investors
          </h2>
          <span
            aria-hidden="true"
            className={`mx-auto mt-5 block h-[3px] w-16 rounded-full lg:mx-0 ${goldBg}`}
          />
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.8] text-[#52685B] sm:text-base lg:mx-0 lg:max-w-md">
            Real experiences from families, homebuyers, and investors who
            trusted us to find the right property. From finding a dream home to
            making a confident investment, we’re proud to be part of every
            successful property journey.
          </p>
        </motion.div>

        {/* ===== Quote card ===== */}
        <motion.div
          {...reveal(0.12)}
          className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
        >
          <div className="relative overflow-hidden rounded-[24px] bg-[#000000] p-5 shadow-[0_24px_60px_-24px_rgba(26,42,34,0.55)] ring-1 ring-[#D4AF37]/20 sm:rounded-[28px] sm:p-10 lg:p-12">
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#e2a10d]/10 blur-3xl"
            />
            {/* big faded quote mark */}
            <span
              aria-hidden="true"
              className={`${marcellus.className} pointer-events-none absolute -right-1 -top-4 select-none text-[8rem] leading-none text-[#ffcd39]/10 sm:-right-2 sm:-top-6 sm:text-[14rem]`}
            >
              ”
            </span>

            <div
              aria-live="polite"
              className="relative min-h-[320px] sm:min-h-[280px] lg:min-h-[300px]"
            >
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.figure
                  key={current.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  drag={reduceMotion ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) go(1);
                    else if (info.offset.x > 80) go(-1);
                  }}
                  className="flex min-h-[320px] cursor-grab touch-pan-y flex-col active:cursor-grabbing sm:min-h-[280px] lg:min-h-[300px]"
                >
                  <div
                    className="flex gap-1"
                    role="img"
                    aria-label={`${current.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        size={18}
                        aria-hidden="true"
                        className={
                          i < current.rating
                            ? "fill-[#ffcd39] text-[#ffcd39]"
                            : "text-[#faf9f6]/30"
                        }
                      />
                    ))}
                  </div>

                  <blockquote
                    className={`${marcellus.className} mt-5 line-clamp-6 text-[clamp(1.05rem,2.2vw,1.6rem)] font-normal leading-[1.6] text-[#faf9f6] sm:mt-6 sm:line-clamp-5 lg:line-clamp-6`}
                  >
                    {current.quote}
                  </blockquote>

                  <figcaption className="mt-auto flex items-center gap-3.5 border-t border-[#faf9f6]/10 pt-5 sm:gap-4 sm:pt-6">
                    <span
                      aria-hidden="true"
                      className={`${marcellus.className} flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base text-[#000000] ring-2 ring-[#ffcd39]/30 ring-offset-2 ring-offset-[#000000] sm:h-14 sm:w-14 sm:text-lg ${goldBg}`}
                    >
                      {getInitials(current.name)}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`${marcellus.className} truncate text-base text-[#faf9f6] sm:text-lg`}
                      >
                        {current.name}
                      </p>
                      <p className="truncate text-[13px] text-[#faf9f6]/60 sm:text-sm">
                        {current.role}
                      </p>
                    </div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

          {/* Dots */}
          <div
            className="mt-3 flex flex-wrap items-center justify-center lg:justify-start"
            role="tablist"
            aria-label="Select testimonial"
          >
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show testimonial from ${t.name}`}
                onClick={() => goTo(i)}
                className="group flex h-6 items-center px-1 focus:outline-none"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[#D4AF37] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#faf9f6] ${
                    i === index
                      ? `w-9 ${goldBg}`
                      : "w-2 bg-[#000000]/25 group-hover:bg-[#000000]/50"
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* ===== Controls + Google review ===== */}
        <motion.div
          {...reveal(0.2)}
          className="min-w-0 lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-8"
        >
          <div className="flex items-center justify-center gap-5 lg:justify-start">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className={arrowClass}
              >
                <FiChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className={arrowClass}
              >
                <FiChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
            <p
              className={`${marcellus.className} text-lg text-[#52685B]`}
              aria-hidden="true"
            >
              <span className="text-[#000000]">{pad(index + 1)}</span> /{" "}
              {pad(total)}
            </p>
          </div>

       <p className="mt-6 border-t border-[#000000]/10 pt-5 text-center text-sm leading-relaxed text-[#52685B] lg:text-left">
  Rated 4.8/5 by Our Customers. More Reviews on Our {" "}
  <a
    href={GOOGLE_REVIEW_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="font-medium text-[#000000] underline decoration-[#e2a10d] decoration-2 underline-offset-4 transition-colors duration-300 hover:text-[#e2a10d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f6]"
  >
    Google Reviews
  </a>
  .
</p>
        </motion.div>
      </div>
    </section>
  );
}