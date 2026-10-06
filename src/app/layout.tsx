import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { Providers } from "@/components/providers";
export const metadata: Metadata = {
  title: { default: "DoRoboty.ai", template: "%s · DoRoboty.ai" },
  description: "Portal pracy dla specjalistów AI i środowisko case study AI Product Heroes 3.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
