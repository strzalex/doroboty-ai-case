import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AppShell mode="demo">{children}</AppShell>
    </Providers>
  );
}
