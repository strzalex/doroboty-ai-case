"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Blocks,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { browserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
export function AppShell({
  children,
  mode,
  email,
}: {
  children: React.ReactNode;
  mode: "demo" | "live";
  email?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const base = mode === "demo" ? "/demo" : "/app";
  const links = [
    { href: base, label: "Przegląd", icon: LayoutDashboard },
    { href: `${base}/settings`, label: "Ustawienia", icon: Settings2 },
    { href: "/components", label: "Komponenty", icon: Blocks },
  ];
  async function logout() {
    setBusy(true);
    setError("");
    try {
      const { error } = await browserClient().auth.signOut();
      if (error) throw error;
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Clear the auth-bound router cache after changing session cookies.
      window.location.assign("/auth/sign-in");
    } catch {
      setError("Nie udało się wylogować. Spróbuj ponownie.");
      setBusy(false);
    }
  }
  return (
    <div className="app-frame">
      <a className="skip-link" href="#main">
        Przejdź do treści
      </a>
      <header className="mobile-header">
        <Link href={base} className="brand">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          superstarter<span className="text-primary">.</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
          aria-controls="sidebar"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </header>
      <aside id="sidebar" className={cn("sidebar", open && "sidebar-open")}>
        <Link href={base} className="brand hidden md:flex">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          superstarter<span className="text-primary">.</span>
        </Link>
        <div className="workspace-label">
          <span className="workspace-avatar">S</span>
          <div>
            <strong>Moja przestrzeń</strong>
            <span>{mode === "demo" ? "Wersja demonstracyjna" : "Twoje konto"}</span>
          </div>
        </div>
        <nav aria-label="Nawigacja główna">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === base ? pathname === base : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("nav-link", active && "nav-active")}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          {mode === "demo" ? (
            <>
              <p>Masz już swój pomysł?</p>
              <span>Podłącz bazę i zacznij budować własną aplikację.</span>
              <Link href="/app" className="nav-link">
                Przejdź do aplikacji <ArrowUpRight size={16} />
              </Link>
            </>
          ) : (
            <>
              <p className="break-all">{email}</p>
              <Button variant="ghost" onClick={logout} disabled={busy}>
                <LogOut />
                {busy ? "Wylogowywanie…" : "Wyloguj się"}
              </Button>
              {error && <p role="alert">{error}</p>}
            </>
          )}
          <div className="sidebar-credit">
            Superstarter <span>v0.1</span>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <div className="topbar">
          <span>
            Moja przestrzeń <span className="px-3 text-border">/</span>{" "}
            {pathname.includes("settings")
              ? "Ustawienia"
              : pathname === "/components"
                ? "Komponenty"
                : "Dokumenty"}
          </span>
          <span className="mode-label">
            <span className="status-dot" />
            {mode === "demo" ? "Tryb demo" : "Supabase"}
          </span>
        </div>
        <main id="main" className="main-content">
          {children}
        </main>
        <footer className="app-footer">
          <span>Twój pomysł. Twój następny krok.</span>
          <Link href="/components">
            Poznaj komponenty <ArrowUpRight size={13} />
          </Link>
        </footer>
      </div>
    </div>
  );
}
