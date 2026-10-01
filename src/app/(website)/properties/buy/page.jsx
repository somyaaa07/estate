
import PropertiesList from "@/component/PropertyListing";

export const metadata = {
  title: "Buy Property in Greater Noida | Bringo Real Estate",
  description:
    "Explore flats, villas, residential plots and commercial properties for sale in Greater Noida. Find your ideal property with Bringo Real Estate.",
  alternates: {
    canonical: "/properties/buy",
  },
  openGraph: {
    title: "Buy Property in Greater Noida | Bringo Real Estate",
    description:
      "Discover residential and commercial properties for sale in Greater Noida with Bringo Real Estate.",
    url: "/properties/buy",
    type: "website",
  },
};

export default function BuyPage() {
  return (
    <PropertiesList
      type="buy"
      heading="Properties for Buy"
    />
  );
}