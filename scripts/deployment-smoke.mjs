const origin = new URL(process.env.DEPLOYMENT_URL ?? "https://doroboty-ai-case.vercel.app");

if (origin.protocol !== "https:") {
  throw new Error("DEPLOYMENT_URL must use HTTPS.");
}

const routes = [
  { path: "/", contains: "DoRoboty.ai" },
  { path: "/oferty", contains: "DoRoboty.ai" },
  { path: "/oferty/ai-product-manager", contains: "DoRoboty.ai" },
  { path: "/auth/sign-in", contains: "DoRoboty.ai" },
  { path: "/robots.txt", contains: `${origin.origin}/sitemap.xml` },
  { path: "/sitemap.xml", contains: `${origin.origin}/oferty` },
];

for (const route of routes) {
  const url = new URL(route.path, origin);
  const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15_000) });
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`${route.path} returned ${response.status}.`);
  }
  if (!body.includes(route.contains)) {
    throw new Error(`${route.path} did not contain the expected public marker.`);
  }

  console.log(`${response.status} ${route.path}`);
}

console.log(`Deployment smoke passed for ${origin.origin}.`);
