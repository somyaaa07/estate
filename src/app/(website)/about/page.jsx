import Image from "next/image";
import Link from "next/link";
import { Marcellus } from "next/font/google";
import {
  ArrowRight,
  Building2,
  Handshake,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
  Users,
  MapPinned,
  FileCheck2,
  HandCoins,
  Smartphone,
} from "lucide-react";

import FaqAccordion from "@/component/about/FaqAccordion";
// import PartnersSection from "@/component/about/PartnersSection";
// import VisionMissionSection from "@/component/about/VisionMissionSection";
import TeamSection, { FounderSection } from "@/component/TeamSection";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const teamMembers = [
  {
    name: "Rohit Bhasin",
    role: "Chief Operating Officer",
    photo: "/founder/rohit.jpeg",
  },
  {
    name: "Mehak Bhasin",
    role: "Head of New Channel Engagement",
    photo: "/founder/mehak.jpeg",
  },
  {
    name: "Chetna Bhasin",
    role: "GM Operations",
    photo: "/founder/chetna.jpeg",
  },
  {
    name: "Uday Prakash",
    role: "Operational Channel Head – Unitech",
    photo: "/founder/uday.jpeg",
  },
  {
    name: "Geetanjali Dayal Prakash",
    role: " GM – Unitech",
    photo: "/founder/geetanjali.jpeg",
  },
];
/* ---------------------------------------------------------------
   COLORS
   Primary  : #000000
   Secondary: #52685B
   BG       : #FAF9F6  &  #F3F0E8
---------------------------------------------------------------- */

/* ---------------------------------------------------------------
   BUSINESS DETAILS  
---------------------------------------------------------------- */
const SITE_URL = "https://www.bringorealestates.com";

const BUSINESS = {
  name: "Bringo Real Estates",
  phoneDisplay: "9999300301",
  phoneTel: "+919999300301",
  email: "bringo.realstates@gmail.com",
  addressLines: [
    "FF01, FF02 Kaveri City Center, Delta 1,",
    "Greater Noida, Gautam Buddha Nagar,",
    "Uttar Pradesh 201306",
  ],
  schemaAddress: {
    "@type": "PostalAddress",
    streetAddress: "FF01, FF02 Kaveri City Center, Delta 1",
    addressLocality: "Greater Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201306",
    addressCountry: "IN",
  },
};

/* ---------------------------------------------------------------
   SEO
---------------------------------------------------------------- */
export const metadata = {
  title: "About Bringo Real Estates | Property Dealers in Greater Noida",
  description:
    "Bringo Real Estates helps families and investors buy, sell and invest in residential and commercial properties in Greater Noida. Transparent deals, verified projects and end-to-end support. Call 99993 00301.",
  keywords: [
    "Bringo Real Estates",
    "real estate Greater Noida",
    "property dealers in Greater Noida",
    "buy flat in Greater Noida",
    "commercial property Greater Noida",
    "Kaveri City Center Delta 1",
    "RERA approved properties",
  ],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Bringo Real Estates | More Than Properties, We Build Futures",
    description:
      "Trusted real estate consultants in Greater Noida for homes, plots and commercial spaces.",
    url: `${SITE_URL}/about`,
    siteName: BUSINESS.name,
    images: [{ url: "/image/about.webp", width: 1200, height: 630 }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Bringo Real Estates",
    description: "More than properties, we build futures.",
    images: ["/image/about.webp"],
  },
};

/* ---------------------------------------------------------------
   CONTENT
---------------------------------------------------------------- */
// const stats = [
//   { icon: Home, value: "300+", label: "Properties Sold Every Year" },
//   { icon: Users, value: "20+", label: "Team Members & Growing" },
//   { icon: Star, value: "150+", label: "Google Reviews" },
//   { icon: Eye, value: "400K+", label: "Social Media Views" },
// ];
const values = [
  {
    icon: Handshake,
    title: "Trusted & Transparent",
    text: "Fair deals and clear processes",
  },
  {
    icon: Settings,
    title: "Quality Construction",
    text: "Built with excellence",
  },
  { icon: Users, title: "Customer-Centric", text: "Your goals, our priority" },
];

const reasons = [
  {
    icon: MapPinned,
    number: "01",
    title: "Local Expertise",
    text: "Focused on Noida, Greater Noida, Gurugram and the Yamuna Expressway.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Transparent Process",
    text: "You know every step, from your first enquiry to property handover.",
  },
  {
    icon: HandCoins,
    number: "03",
    title: "Upfront Charges",
    text: "Clear pricing with no unexpected surprises after you commit.",
  },
  {
    icon: FileCheck2,
    number: "04",
    title: "Expert Paperwork",
    text: "Certified professionals help keep your property documentation legally sound.",
  },
  {
    icon: Handshake,
    number: "05",
    title: "Home Loans & Sales",
    text: "We help with your finance along with your purchase.",
  },
  {
    icon: Smartphone,
    number: "06",
    title: "Prop-Tech Experience",
    text: "We are building it around every step of the process, so you can follow your deal with ease.",
  },
];

const faqs = [
  {
    q: "What types of properties do you offer?",
    a: "We offer apartments, villas, plots and commercial spaces in Greater Noida and nearby areas, all selected for location, quality and long-term value.",
  },
  {
    q: "How can I schedule a property visit?",
    a: "Call us on 99993 00301 or use the Contact page. We will confirm a convenient time and arrange a guided site visit for you.",
  },
  {
    q: "Do you provide financing assistance?",
    a: "Yes. We help you compare home loan options from leading banks and guide you through the paperwork.",
  },
  {
    q: "Are your properties RERA approved?",
    a: "We only recommend RERA registered projects, and we share the registration details before you make any booking.",
  },
  {
    q: "What makes your company different?",
    a: "Transparent pricing, verified projects and a dedicated team that supports you from your first enquiry to handover and beyond.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}/#business`,
      name: BUSINESS.name,
      url: SITE_URL,
      telephone: BUSINESS.phoneTel,
      email: BUSINESS.email,
      image: `${SITE_URL}/image/about.webp`,
      address: BUSINESS.schemaAddress,
      areaServed: ["Greater Noida", "Noida", "Gautam Buddha Nagar"],
      description:
        "Bringo Real Estates helps families, businesses and investors buy, sell and invest in residential and commercial properties in Greater Noida.",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${SITE_URL}/about`,
        },
      ],
    },
  ],
};

/* ---------------------------------------------------------------
   SMALL REUSABLE PIECES
---------------------------------------------------------------- */
const Eyebrow = ({ children, line = false }) => (
  <p className="flex items-center gap-3 text-[11px] font-normal uppercase tracking-[0.25em] text-[#52685B]">
    {children}
    {line && <span className="h-px w-12 bg-[#52685B]/40" />}
  </p>
);

const BtnDark = ({ href, children }) => (
  <Link
    href={href}
    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#000000] py-2.5 pl-6 pr-2.5 text-sm font-normal text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#000000] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
  >
    {/* Golden fill slides in from left */}
    <span
      aria-hidden="true"
      className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] transition-transform duration-500 ease-out group-hover:scale-x-100"
    />

    {/* Glass shine sweep */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
    />

    <span className="relative z-10">{children}</span>

    {/* Arrow circle */}
    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] text-[#000000] transition-all duration-500 group-hover:bg-none group-hover:bg-[#000000] group-hover:text-[#F5D77A]">
      <ArrowRight
        size={14}
        className="transition-transform duration-500 group-hover:-rotate-45"
      />
    </span>
  </Link>
);

const Avatars = () => (
  <div className="flex -space-x-3">
    {[1, 2, 3, 4].map((n) => (
      <Image
        key={n}
        src={`/images/about/avatar-${n}.jpg`}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 rounded-full border-2 border-[#FAF9F6] object-cover"
      />
    ))}
  </div>
);

/* ---------------------------------------------------------------
   PAGE
---------------------------------------------------------------- */
export default function AboutPage() {
  return (
    <main
      className={`${marcellus.variable} overflow-x-hidden bg-[#FAF9F6] font-[family-name:var(--font-marcellus)] font-normal text-[#000000]`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ============ HERO ============ */}

      <section
        aria-labelledby="about-hero"
        className="relative flex min-h-[480px] items-center overflow-hidden bg-[#080808] lg:min-h-[550px]"
      >
        {/* Background Image */}
        <Image
          src="/image/about-new.png"
          alt="Luxury real estate property"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center] md:object-[70%_center]"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

        {/* Left Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:py-16">
          <div className="max-w-2xl text-white">
            <h1
              id="about-hero"
              className="mt-5 text-4xl font-normal leading-[1.08] sm:text-5xl lg:text-6xl"
            >
              About
              <span className="text-[#D4AF70]">Us</span>
            </h1>

            <p className="mt-5  max-w-[200px] sm:max-w-[190px] md:max-w-[300px] lg:max-w-md text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
              We're a team of 20+ people with one goal: doing real estate
              differently. Every year we sell 150+ properties, and we grow the
              Bringo way, one client, one sale, one relationship at a time.
            </p>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE ============ */}
      <section
        aria-labelledby="why-title"
        className="relative overflow-hidden bg-[#F3F0E8]"
      >
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#000000]/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          {/* Section heading */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <Eyebrow line>Why Choose Bringo</Eyebrow>
            </div>

            <h2
              id="why-title"
              className="mt-5 text-4xl font-normal leading-tight text-[#000000] sm:text-5xl"
            >
              More Than a Realtor.
              <br />
              <span className="text-[#52685B] ">
                we are your complete Real Estate Partner{" "}
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#52685B] sm:text-[15px]">
              From finding the right property to paperwork, financing and
              approvals, Bringo supports you throughout the entire journey.
            </p>
          </div>

          {/* Reasons grid */}
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map(({ icon: Icon, number, title, text }) => (
              <li
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-[#000000]/8 bg-[#FAF9F6] p-7 shadow-[0_10px_35px_rgba(26,42,34,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(26,42,34,0.12)]"
              >
                {/* Golden hover background */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#B8902F] via-[#F5D77A] to-[#B8902F] transition-transform duration-500 group-hover:scale-x-100"
                />

                {/* Number */}
                <div className="flex items-start justify-between">
                  <span className="text-xs tracking-[0.2em] text-[#B8902F]">
                    {number}
                  </span>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F0E8] text-[#D4A62A] transition-all duration-500 group-hover:bg-[#000000] group-hover:text-[#F5D77A]">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-7 text-base font-medium text-[#000000]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#52685B]">{text}</p>
              </li>
            ))}
          </ul>

          {/* Bottom trust strip */}
          <div className="mt-8 grid gap-4 rounded-3xl bg-[#000000] p-6 text-[#FAF9F6] sm:grid-cols-3 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#F5D77A]">
                <ShieldCheck size={22} strokeWidth={1.4} />
              </div>

              <div>
                <p className="text-sm">Verified & Transparent</p>
                <p className="mt-1 text-xs text-[#FAF9F6]/60">
                  Clear property processes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-[#FAF9F6]/15 sm:border-l sm:pl-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#F5D77A]">
                <Users size={22} strokeWidth={1.4} />
              </div>

              <div>
                <p className="text-sm">Customer First</p>
                <p className="mt-1 text-xs text-[#FAF9F6]/60">
                  Support from enquiry to handover
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-[#FAF9F6]/15 sm:border-l sm:pl-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#F5D77A]">
                <Building2 size={22} strokeWidth={1.4} />
              </div>

              <div>
                <p className="text-sm">Local Market Knowledge</p>
                <p className="mt-1 text-xs text-[#FAF9F6]/60">
                  Noida & Greater Noida focused
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ============ FOUNDER + TEAM ============ */}
      {/* <TeamSection
  founder={founder}
  teamMembers={teamMembers}
  TeamPhoto={TeamPhoto}
/> */}
      <FounderSection
        founder={{
          name: "Ritesh Bhasin",
          role: "Founder and Head of sales",
          photo: "/founder/ritesh.png",
          bio: [
            "With 18 years of corporate experience, Ritesh brings strong leadership, strategic thinking, and a results-driven approach to Bringo. As Head of Sales, he focuses on driving business growth, strengthening sales performance, improving operational efficiency, and building a high-performing team.",
            "An IIM-C alumnus and Six Sigma Black Belt, he combines strategic vision with a structured approach to achieving business goals and creating long-term value for the organisation.",
          ], // string or array
          quote:
            "I believe sustainable growth comes from strong teams, disciplined execution, and a clear focus on delivering value to customers.",
          socials: [
            { label: "LinkedIn", href: "https://linkedin.com/in/..." },
            { label: "Instagram", href: "https://instagram.com/..." },
          ],
        }}
      />
      {/* ============ FOUNDER + TEAM ============ */}
      <TeamSection teamMembers={teamMembers} />
      {/* ============ PARTNERS (separate file) ============ */}
      {/* <PartnersSection /> */}
      {/* ============ OUR PEOPLE + VISION/MISSION (separate file) ============ */}
      {/* <VisionMissionSection /> */}
      {/* ============ FAQ ============ */}
      {/* <section
        aria-labelledby="faq-title"
        className="mx-auto max-w-7xl px-5 py-14 sm:px-8"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[4/3.4]">
            <Image
              src="/image/faq.webp"
              alt="Spacious living room with cream sofa and natural light"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 id="faq-title" className="mt-3 text-4xl font-normal">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-[#52685B]">
              Find quick answers to some common questions about our services.
            </p>
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section> */}
      {/* ============ CTA + CONTACT ============ */}
      <section
        aria-labelledby="cta-title"
        className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8"
      >
        <div className="relative overflow-hidden rounded-3xl bg-[#000000] px-6 py-12 text-[#FAF9F6] sm:px-12 lg:py-16">
          <Image
            src="/image/ctaa.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right opacity-30 mix-blend-luminosity lg:opacity-45"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/90 to-transparent" />

          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#FAF9F6]/80">
                Let&apos;s Find Your Perfect Space
              </p>
              <h2
                id="cta-title"
                className="mt-4 text-4xl font-normal leading-tight sm:text-5xl"
              >
                Ready to Find Your Dream Property?
              </h2>
              <p className="mt-4 text-sm text-[#FAF9F6]/85">
                Get expert guidance and exclusive property options tailored to
                your needs.
              </p>

              <address className="mt-6 space-y-3 text-sm not-italic text-[#FAF9F6]/90">
                <a
                  href={`tel:${BUSINESS.phoneTel}`}
                  className="flex items-center gap-3 hover:text-[#FAF9F6]"
                >
                  <Phone size={16} className="shrink-0" />
                  {BUSINESS.phoneDisplay}
                </a>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center gap-3 break-all hover:text-[#FAF9F6]"
                >
                  <Mail size={16} className="shrink-0" />
                  {BUSINESS.email}
                </a>
                <p className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>
                    {BUSINESS.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </p>
              </address>

              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#FAF9F6] px-6 py-3 text-sm font-normal text-[#000000] transition hover:bg-[#F3F0E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF9F6]"
              >
                Contact Us <ArrowRight size={16} />
              </Link>
            </div>

            <div className="flex items-center gap-4 rounded-full bg-[#FAF9F6]/10 px-4 py-3 backdrop-blur">
              <span className="h-8 w-px bg-[#FAF9F6]/30" />
              <div>
                <p className="text-lg  text-[#D4A62A] leading-none">4.8/5</p>
                <p className="text-[11px] text-[#D4A62A]">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
