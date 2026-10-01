
import PropertiesList from "@/component/PropertyListing";

export const metadata = {
  title: "Sell Your Property in Greater Noida | Bringo Real Estate",
  description:
    "Looking to sell your property in Greater Noida? List your residential, commercial or plot property with Bringo Real Estate and connect with potential buyers.",
  alternates: {
    canonical: "/properties/sell",
  },
  openGraph: {
    title: "Sell Your Property in Greater Noida | Bringo Real Estate",
    description:
      "Connect with potential buyers and explore property selling opportunities in Greater Noida with Bringo Real Estate.",
    url: "/properties/sell",
    type: "website",
  },
};

export default function SellPage() {
  return (
    <PropertiesList
      type="sell"
      heading="Properties for Sell"
    />
  );
}