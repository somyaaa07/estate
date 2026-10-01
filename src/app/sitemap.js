const BASE_URL = "https://www.yourdomain.com";

export default function sitemap() {
  const routes = [
    "",
    "/about",
    "/contact",
    "/properties",
    "/properties/buy",
    "/properties/rent",
    "/properties/sell",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
