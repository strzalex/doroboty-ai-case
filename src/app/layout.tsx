import type { Metadata } from "next";
import "@fontsource/anton/400.css";
import "@fontsource-variable/source-serif-4";
import "@fontsource/chakra-petch/400.css";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/chakra-petch/700.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "DoRoboty.ai", template: "%s · DoRoboty.ai" },
  description: "Portal pracy dla specjalistów AI i środowisko case study AI Product Heroes 3.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "DoRoboty.ai",
    title: "DoRoboty.ai — praca dla ludzi, którzy dowożą z AI",
    description:
      "Wyselekcjonowane role, w których AI jest częścią odpowiedzialności i wyniku pracy.",
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
