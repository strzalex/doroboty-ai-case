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
    { href: base, label: "Overview", icon: LayoutDashboard },
    { href: `${base}/settings`, label: "Settings", icon: Settings2 },
    { href: "/components", label: "Components", icon: Blocks },
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
          <span className="workspace-avatar">S</span>
          <div>
            <strong>My workspace</strong>
            <span>{mode === "demo" ? "Demo version" : "Your account"}</span>
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
              <p>Have an idea?</p>
              <span>Connect a database and start building your application.</span>
              <Link href="/app" className="nav-link">
                Open application <ArrowUpRight size={16} />
              </Link>
            </>
          ) : (
            <>
              <p className="break-all">{email}</p>
              <Button variant="ghost" onClick={logout} disabled={busy}>
                <LogOut />
                {busy ? "Signing out…" : "Sign out"}
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
            My workspace <span className="px-3 text-border">/</span>{" "}
            {pathname.includes("settings")
              ? "Settings"
              : pathname === "/components"
                ? "Components"
                : "Documents"}
          </span>
          <span className="mode-label">
            <span className="status-dot" />
            {mode === "demo" ? "Demo mode" : "Supabase"}
          </span>
        </div>
        <main id="main" className="main-content">
          {children}
        </main>
        <footer className="app-footer">
          <span>Your idea. Your next step.</span>
          <Link href="/components">
            Explore components <ArrowUpRight size={13} />
          </Link>
        </footer>
      </div>
    </div>
  );
}
