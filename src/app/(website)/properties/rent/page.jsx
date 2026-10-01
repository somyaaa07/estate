
import PropertiesList from "@/component/PropertyListing";

export const metadata = {
  title: "Properties for Rent in Greater Noida | Bringo Real Estate",
  description:
    "Explore flats, houses, villas and commercial properties for rent in Greater Noida. Find rental properties that match your needs with Bringo Real Estate.",
  alternates: {
    canonical: "/properties/rent",
  },
  openGraph: {
    title: "Properties for Rent in Greater Noida | Bringo Real Estate",
    description:
      "Find residential and commercial rental properties in Greater Noida with Bringo Real Estate.",
    url: "/properties/rent",
    type: "website",
  },
};

export default function RentPage() {
  return (
    <PropertiesList
      type="rent"
      heading="Properties for Rent"
    />
  );
}