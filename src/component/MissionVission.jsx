import Image from "next/image";
import { Marcellus } from "next/font/google";
import { Eye, Target } from "lucide-react";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const defaultContent = {
  eyebrow: "Who we are",
  heading: ["Driven by People.", "Inspired by Possibilities."],
  description:
    "Our team of real estate experts, designers and strategists work together to create exceptional spaces that enrich lives and communities.",
  image: "/image/cta.webp",
  imageAlt: "Dining area with large windows and indoor plants",
  vision: "To create sustainable and future-ready communities.",
  mission:
    "Property deals mean heavy paperwork and unclear charges. Bringo changes that with transparent steps, upfront costs, and certified experts who keep every document legally sound",
};

export default function VisionMissionSection({
  eyebrow = defaultContent.eyebrow,
  heading = defaultContent.heading, // string ya array of lines
  description = defaultContent.description,
  image = defaultContent.image,
  imageAlt = defaultContent.imageAlt,
  vision = defaultContent.vision,
  mission = defaultContent.mission,
  showIntro = true, // false karoge to sirf Vision/Mission card dikhega
  className = "",
}) {
  const headingLines = Array.isArray(heading) ? heading : [heading];

  const card = (
    <div className="grid overflow-hidden rounded-2xl sm:grid-cols-[1.1fr_1fr]">
      <div className="relative min-h-[390px]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 300px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-center gap-6 bg-[#000000] p-7 text-[#FAF9F6]">
        <div>
          <p className="flex items-center gap-3">
            <Eye size={22} strokeWidth={1.5} /> Vision
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#FAF9F6]/80">
            {vision}
          </p>
        </div>

        <span className="h-px w-full bg-[#FAF9F6]/25" />

        <div>
          <p className="flex items-center gap-3">
            <Target size={22} strokeWidth={1.5} /> Mission
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#FAF9F6]/80">
            {mission}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section
      aria-labelledby="vision-mission-title"
      className={`${marcellus.className} bg-[#FAF9F6] font-normal text-[#000000] ${className}`}
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        {showIntro ? (
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-normal uppercase tracking-[0.25em] text-[#52685B]">
                {eyebrow}
                <span className="h-px w-12 bg-[#52685B]/40" />
              </p>

              <h2
                id="vision-mission-title"
                className="mt-4 text-4xl font-normal leading-tight"
              >
                {headingLines.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < headingLines.length - 1 && <br />}
                  </span>
                ))}
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#52685B]">
                {description}
              </p>
            </div>

            {card}
          </div>
        ) : (
          <>
            <h2 id="vision-mission-title" className="sr-only">
              Vision and Mission
            </h2>
            {card}
          </>
        )}
      </div>
    </section>
  );
}