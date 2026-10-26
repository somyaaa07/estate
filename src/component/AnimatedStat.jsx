"use client";
import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/* ---------------------------------------------------------------
   Odometer-style stat.

   Why this is smooth:
   - Every digit is a tall strip (0-9 repeated) that is moved with a
     CSS transform (translateY) using the Web Animations API.
   - Transform animations run on the GPU compositor thread, so they stay
     at 60fps even while the video / other animations keep the main
     thread busy.
   - No text is re-written and no layout is recalculated per frame.
---------------------------------------------------------------- */

const GRADIENT = "linear-gradient(to right,#E2A10D,#FFCD39,#E2A10D)";
const ROW = "1.15em"; // height of one digit row
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)"; // easeOutExpo

/* "150+" -> prefix "", num 150, suffix "+" | "400K+" -> 400, "K+" */
const parseValue = (value) => {
  const m = String(value).match(/^(\D*?)(\d[\d,]*\.?\d*)(.*)$/);
  if (!m) return null;
  const raw = m[2].replace(/,/g, "");
  return {
    prefix: m[1],
    num: parseFloat(raw),
    decimals: (raw.split(".")[1] || "").length,
    suffix: m[3],
  };
};

export default function AnimatedStat({ value, duration = 2, delay = 0 }) {
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const parsed = parseValue(value);

  /* ----- build cells: [prefix] [digit columns / "."] [suffix] ----- */
  const cells = [];
  if (parsed) {
    if (parsed.prefix) cells.push({ type: "text", text: parsed.prefix });
    let col = 0;
    parsed.num
      .toFixed(parsed.decimals)
      .split("")
      .forEach((ch) => {
        if (/\d/.test(ch)) {
          // right-most digits spin more -> classic odometer feel
          cells.push({ type: "digit", digit: Number(ch), cycles: ++col });
        } else {
          cells.push({ type: "text", text: ch });
        }
      });
    if (parsed.suffix) cells.push({ type: "text", text: parsed.suffix });
  }

  /* One continuous gold gradient across the whole number,
     painted on each moving strip (so it moves with the digit). */
  const total = cells.length;
  const gold = (i) => ({
    backgroundImage: GRADIENT,
    backgroundSize: `${Math.max(total, 1) * 100}% 100%`,
    backgroundPosition: total > 1 ? `${(i / (total - 1)) * 100}% 0` : "0 0",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !parsed || !inView) return;

    const strips = root.querySelectorAll("[data-strip]");
    const anims = [];

    strips.forEach((el) => {
      const to = `translateY(-${el.dataset.target}%)`;

      if (reduce) {
        el.style.transform = to;
        return;
      }

      const anim = el.animate(
        [{ transform: "translateY(0%)" }, { transform: to }],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          easing: EASING,
          fill: "both",
        },
      );
      anims.push(anim);

      // Lock the final position and release the animation
      anim.finished
        .then(() => {
          el.style.transform = to;
          anim.cancel();
        })
        .catch(() => {});
    });

    return () => anims.forEach((a) => a.cancel());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, duration, delay]);

  /* Not a number (e.g. "N/A") -> just show it */
  if (!parsed) return <span>{value}</span>;

  return (
    <span
      ref={rootRef}
      className="inline-flex items-center"
      style={{ height: ROW, lineHeight: ROW }}
    >
      {/* Screen readers get the final value only */}
      <span className="sr-only">{value}</span>

      {cells.map((c, i) => {
        if (c.type === "text") {
          return (
            <span
              key={i}
              aria-hidden="true"
              style={{ ...gold(i), height: ROW, lineHeight: ROW }}
            >
              {c.text}
            </span>
          );
        }

        const rows = c.cycles * 10 + 10;
        const target = ((c.cycles * 10 + c.digit) / rows) * 100;

        return (
          <span
            key={i}
            aria-hidden="true"
            className="block overflow-hidden"
            style={{ height: ROW }}
          >
            <span
              data-strip
              data-target={target}
              className="block"
              style={{ ...gold(i), willChange: "transform" }}
            >
              {Array.from({ length: rows }, (_, r) => (
                <span
                  key={r}
                  className="block text-center"
                  style={{ height: ROW, lineHeight: ROW }}
                >
                  {r % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}