"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CalendarDays,
  Clapperboard,
  Film,
  Gauge,
  LogOut,
  Search,
  Settings,
  Ticket,
  Users
} from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Gauge },
  { href: "/admin/movies", label: "Film", icon: Film },
  { href: "/admin/schedules", label: "Jadwal", icon: CalendarDays },
  { href: "/admin/analytics", label: "Analitik", icon: BarChart3 },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/movies", label: "Booking App", icon: Ticket }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand-block" href="/admin">
          <span className="brand-mark">
            <Clapperboard size={26} />
          </span>
          <span>
            <strong>FilmKeren</strong>
            <small>Premium Circuit</small>
          </span>
        </Link>

        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link className={active ? "nav-link active" : "nav-link"} href={item.href} key={item.href}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link className="nav-link logout-link" href="/">
          <LogOut size={18} />
          <span>Logout</span>
        </Link>
      </aside>

      <header className="topbar">
        <Link className="topbar-brand" href="/admin">
          FilmKeren
        </Link>
        <div className="topbar-actions">
          <div className="search-box">
            <Search size={16} />
            <input aria-label="Search" placeholder="Search..." />
          </div>
          <button className="icon-button" title="Notifications" type="button">
            <Bell size={18} />
          </button>
          <button className="icon-button" title="Settings" type="button">
            <Settings size={18} />
          </button>
          <div className="avatar" aria-label="Administrator profile">
            FK
          </div>
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}
