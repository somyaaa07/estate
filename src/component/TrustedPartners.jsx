import Image from "next/image";
import { Marcellus } from "next/font/google";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const defaultPartners = [
  { name: "Jaypee Greens", logo: "/partners/jaypee-greens.webp" },
  { name: "Godrej Properties", logo: "/partners/godrej-properties.webp" },
  { name: "Gaurs", logo: "/partners/gaurs.webp" },
  { name: "M3M India", logo: "/partners/m3m.jpg" },
  { name: "Migsun", logo: "/partners/migsun.jpg" },
  { name: "Hero Homes", logo: "/partners/hero-homes.jpg", scale: 2.18 },
  { name: "Max Estates", logo: "/partners/max-estates.jpg", scale: 2.18 },
  { name: "L&T Realty", logo: "/partners/l-and-t-realty.jpg", scale: 2.18 },
  { name: "ACE Group", logo: "/partners/ace-group.jpg", scale: 2.18 },
  { name: "ATS", logo: "/partners/ats.jpg" },
  { name: "Jacob & Co.", logo: "/partners/jacob-and-co.jpg" },
  { name: "Trump Towers", logo: "/partners/trump-towers.jpg" },
  { name: "Purvanchal Projects", logo: "/partners/purvanchal.jpg", scale: 1.9 },
  { name: "Kalpataru", logo: "/partners/kalpataru.jpg", scale: 1.08 },
  { name: "Prateek Group", logo: "/partners/prateek-group.jpg" },
  { name: "County Group", logo: "/partners/county-group.webp" },
];

const LogoCard = ({ partner, hidden = false }) => (
  <div className="flex h-28 w-48 shrink-0 items-center justify-center rounded-lg bg-white px-4 py-3 mb-10">
    <Image
      src={partner.logo}
      alt={hidden ? "" : `${partner.name} logo`}
      width={180}
      height={100}
      sizes="180px"
      className="h-full w-full object-contain"
      style={{ transform: `scale(${partner.scale ?? 1})` }}
    />
  </div>
);

export default function PartnersSection({
  partners = defaultPartners,
  eyebrow = "Our Partners",
  title = "Trusted by Leading Brands",
  duration = 40, // seconds for one full marquee loop
  className = "",
}) {
  return (
    <section
      aria-labelledby="partners-title"
      className={`${marcellus.className} bg-[#FAF9F6] font-normal text-[#000000] ${className}`}
    >
      <style>{`
        @keyframes partners-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .partners-marquee {
          animation: partners-marquee-scroll ${duration}s linear infinite;
        }
        .partners-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .partners-marquee { animation: none; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-8 ">
        <div className="flex justify-center">
          <p className="flex items-center gap-3 text-[11px] font-normal uppercase tracking-[0.25em] text-[#52685B]">
            {eyebrow}
          </p>
        </div>

        <h2
          id="partners-title"
          className="mt-3 text-5xl font-normal text-[#000000]"
        >
          {title}
        </h2>

        {/* Partner Logo Marquee */}
        <div className="relative mt-10 w-full overflow-hidden">
          <div className="partners-marquee flex w-max">
            {/* FIRST SET */}
            <div className="flex shrink-0 items-center gap-10 pr-10">
              {partners.map((partner) => (
                <LogoCard key={`first-${partner.name}`} partner={partner} />
              ))}
            </div>

            {/* DUPLICATE SET */}
            <div
              className="flex shrink-0 items-center gap-10 pr-10"
              aria-hidden="true"
            >
              {partners.map((partner) => (
                <LogoCard
                  key={`second-${partner.name}`}
                  partner={partner}
                  hidden
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}