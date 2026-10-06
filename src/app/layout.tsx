import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { Providers } from "@/components/providers";
export const metadata: Metadata = {
  title: { default: "Superstarter — Application starter", template: "%s · Superstarter" },
  description: "A starting point for building your own applications with Codex.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
