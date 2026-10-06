import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/features/public/brand-mark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/oferty", label: "Oferty" },
  { href: "/metodologia", label: "Metodologia" },
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        className="fixed top-3 left-3 z-50 -translate-y-40 border-2 bg-primary px-4 py-3 font-ui font-bold focus:translate-y-0"
        href="#main"
      >
        Przejdź do treści
      </a>
      <header className="border-b-2 bg-background">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <Link
            className="flex items-center gap-3 font-ui font-bold"
            href="/"
            aria-label="DoRoboty.ai — strona główna"
          >
            <BrandMark />
            <span>DoRoboty.ai</span>
          </Link>
          <nav aria-label="Główna nawigacja" className="flex items-center gap-3 sm:gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                className="hidden font-ui text-sm font-semibold tracking-[0.08em] uppercase underline-offset-4 hover:underline sm:inline"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/auth/sign-in"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-10 rounded-none border-2 bg-primary px-4 font-ui font-bold tracking-[0.06em] uppercase shadow-[4px_4px_0_var(--foreground)] hover:bg-secondary",
              )}
            >
              Zaloguj się
            </Link>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="border-t-2 bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:px-8">
          <div>
            <p className="font-ui text-lg font-bold">DoRoboty.ai</p>
            <p className="mt-3 max-w-lg text-lg leading-relaxed">
              Praca dla ludzi, którzy potrafią z AI zbudować coś wartościowego — nie tylko wpisać je
              do CV.
            </p>
          </div>
          <nav
            aria-label="Stopka"
            className="flex flex-wrap content-start gap-x-6 gap-y-3 font-ui text-sm tracking-[0.08em] uppercase sm:justify-end"
          >
            <Link href="/oferty">Oferty</Link>
            <Link href="/metodologia">Metodologia</Link>
            <Link href="/polityka-prywatnosci">Prywatność</Link>
            <Link className="inline-flex items-center gap-1" href="/auth/sign-in">
              Strefa case <ArrowUpRight className="size-4" />
            </Link>
          </nav>
        </div>
        <div className="border-t border-background/30 px-5 py-4 font-ui text-xs tracking-[0.08em] uppercase lg:px-8">
          <div className="mx-auto max-w-7xl">
            © {new Date().getFullYear()} DoRoboty.ai — od Superhero.tech
          </div>
        </div>
      </footer>
    </div>
  );
}
