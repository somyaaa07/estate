import SellPropertyForm from "@/component/SellPropertyForm";

export const metadata = {
  title: "Sell Your Property in Greater Noida | Bringo Real Estate",
  description:
    "Looking to sell your property in Greater Noida? List your residential, commercial or plot property with Bringo Real Estate and connect with potential buyers.",
  alternates: { canonical: "/properties/sell" },
  openGraph: {
    title: "Sell Your Property in Greater Noida | Bringo Real Estate",
    description:
      "Connect with potential buyers and explore property selling opportunities in Greater Noida with Bringo Real Estate.",
    url: "/properties/sell",
    type: "website",
  },
};

/* No padding / max-width wrapper here, so the hero photo can run edge to edge */
export default function SellPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EC]">
      <SellPropertyForm />
    </main>
  );
}