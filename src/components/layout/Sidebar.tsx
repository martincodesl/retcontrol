"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  BookOpen,
  TrendingUp,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",     href: "/dashboard",                icon: LayoutDashboard, section: "Principal" },
  { label: "Turnos",        href: "/dashboard/turnos",         icon: Calendar,        section: "Principal", badge: "" },
  { label: "Barberos",      href: "/dashboard/barberos",       icon: Scissors,        section: "Gestion" },
  { label: "Servicios",     href: "/dashboard/servicios",      icon: BookOpen,        section: "Gestion" },
  { label: "Finanzas",      href: "/dashboard/finanzas",       icon: TrendingUp,      section: "Mi Negocio" },
  { label: "Mi Sitio",      href: "/dashboard/configuracion",  icon: Globe,           section: "Mi Negocio" },
  { label: "Configuracion", href: "/dashboard/configuracion",  icon: Settings,        section: "Mi Negocio" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── MOBILE TOPBAR ── */}
      <div className="mobile-topbar">
        <div className="sidebar-logo-name" style={{ fontSize: "1.1rem" }}>
          RET<span>control</span>
        </div>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <aside className={`mobile-drawer ${mobileOpen ? "mobile-drawer-open" : ""}`}>
        <div className="mobile-drawer-header">
          <div className="sidebar-logo-name">RET<span>control</span></div>
          <button
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <nav className="sidebar-nav" style={{ padding: "0.5rem 0" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
  key={item.label}
  href={item.href}
  className={`sidebar-item ${active ? "sidebar-item-active" : ""}`}
  title={collapsed ? item.label : ""}
>
  <div className="sidebar-icon-wrapper">
    <Icon size={17} />
  </div>
  {!collapsed && (
    <span className="sidebar-label">{item.label}</span>
  )}
</Link>
            );
          })}
        </nav>
        <div className="sidebar-profile" style={{ padding: "1rem 1.2rem" }}>
          <div className="sidebar-avatar">KC</div>
          <div>
            <div className="sidebar-profile-name">King's Cuts</div>
            <div className="sidebar-profile-role">Plan Pro</div>
          </div>
        </div>
      </aside>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className={`sidebar desktop-sidebar ${collapsed ? "collapsed" : ""}`}>

        {/* Boton colapsar */}
        <button
          className="sidebar-bubble-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-avatar" style={{ flexShrink: 0 }}>KC</div>
          {!collapsed && (
            <div>
              <div className="sidebar-logo-name">RET<span>control</span></div>
              <div className="sidebar-logo-sub">kings-cuts.retcontrol.app</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {["Principal", "Gestion", "Mi Negocio"].map((section) => {
            const items = navItems.filter((i) => i.section === section);
            return (
              <div key={section}>
                {!collapsed && (
                  <div className="sidebar-section-label">{section}</div>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
  key={item.label}
  href={item.href}
  className={`sidebar-item ${active ? "sidebar-item-active" : ""}`}
  title={collapsed ? item.label : ""}
>
  <div className="sidebar-icon-wrapper">
    <Icon size={17} />
  </div>
  {!collapsed && (
    <span className="sidebar-label">{item.label}</span>
  )}
</Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Profile */}
        {!collapsed && (
          <div className="sidebar-profile">
            <div className="sidebar-avatar">KC</div>
            <div>
              <div className="sidebar-profile-name">King's Cuts</div>
              <div className="sidebar-profile-role">Plan Pro</div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}