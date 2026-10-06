"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Blocks,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Send,
  Settings2,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { browserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
export function AppShell({
  children,
  mode,
  email,
  role,
}: {
  children: React.ReactNode;
  mode: "demo" | "live";
  email?: string;
  role?: "candidate" | "employer" | "operator";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const base = mode === "demo" ? "/demo" : "/app";
  const links =
    mode === "demo"
      ? [
          { href: base, label: "Overview", icon: LayoutDashboard },
          { href: `${base}/settings`, label: "Settings", icon: Settings2 },
          { href: "/components", label: "Components", icon: Blocks },
        ]
      : [
          { href: base, label: "Start", icon: LayoutDashboard },
          ...(role === "candidate"
            ? [
                { href: `${base}/profil`, label: "Profil", icon: UserRound },
                { href: `${base}/aplikacje`, label: "Aplikacje", icon: Send },
                { href: "/oferty", label: "Oferty", icon: BriefcaseBusiness },
              ]
            : [
                { href: `${base}/kandydaci`, label: "Kandydaci", icon: Inbox },
                { href: `${base}/oferty`, label: "Oferty firmy", icon: BriefcaseBusiness },
                ...(role === "employer"
                  ? [{ href: `${base}/organizacja`, label: "Organizacja", icon: Building2 }]
                  : []),
                ...(role === "operator"
                  ? [{ href: `${base}/case`, label: "Case", icon: ChartNoAxesCombined }]
                  : []),
              ]),
          { href: `${base}/settings`, label: "Ustawienia", icon: Settings2 },
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
      setError("Unable to sign out. Try again.");
      setBusy(false);
    }
  }
  return (
    <div className="app-frame">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="mobile-header">
        <Link href={base} className="brand">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          DoRoboty<span className="text-primary">.ai</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Close menu" : "Open menu"}
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
          DoRoboty<span className="text-primary">.ai</span>
        </Link>
        <div className="workspace-label">
          <span className="workspace-avatar">D</span>
          <div>
            <strong>{mode === "demo" ? "Demo startera" : "DoRoboty.ai"}</strong>
            <span>
              {mode === "demo"
                ? "Wersja demonstracyjna"
                : role === "candidate"
                  ? "Kandydat"
                  : role === "employer"
                    ? "Pracodawca"
                    : "Operator"}
            </span>
          </div>
        </div>
        <nav aria-label="Main navigation">
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
              <p>Środowisko techniczne</p>
              <span>Komponenty startowe pozostają dostępne do testów regresji.</span>
              <Link href="/app" className="nav-link">
                Otwórz aplikację <ArrowUpRight size={16} />
              </Link>
            </>
          ) : (
            <>
              <p className="break-all">{email}</p>
              <Button variant="ghost" onClick={logout} disabled={busy}>
                <LogOut />
                {busy ? "Wylogowuję…" : "Wyloguj się"}
              </Button>
              {error && <p role="alert">{error}</p>}
            </>
          )}
          <div className="sidebar-credit">
            DoRoboty.ai <span>case</span>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <div className="topbar">
          <span>
            DoRoboty.ai <span className="px-3 text-border">/</span>{" "}
            {pathname.includes("settings")
              ? "Ustawienia"
              : pathname.includes("profil")
                ? "Profil"
                : pathname.includes("aplikacje")
                  ? "Aplikacje"
                  : pathname.includes("kandydaci")
                    ? "Kandydaci"
                    : pathname.includes("case")
                      ? "Case"
                      : pathname === "/components"
                        ? "Components"
                        : "Start"}
          </span>
          <span className="mode-label">
            <span className="status-dot" />
            {mode === "demo" ? "Tryb demo" : "Bezpieczna sesja"}
          </span>
        </div>
        <main id="main" className="main-content">
          {children}
        </main>
        <footer className="app-footer">
          <span>Do roboty. Z konkretem.</span>
          <Link href={mode === "demo" ? "/components" : "/oferty"}>
            {mode === "demo" ? "Komponenty" : "Publiczne oferty"} <ArrowUpRight size={13} />
          </Link>
        </footer>
      </div>
    </div>
  );
}
