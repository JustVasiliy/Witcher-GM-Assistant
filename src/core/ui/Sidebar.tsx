"use client";

import { usePathname } from "next/navigation";
import { NavLink, NavList, SidebarNav } from "./AppShell.styles";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Bestiary", href: "/bestiary" },
  { label: "Rules", href: "/rules" },
  { label: "Notes", href: "/notes" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <SidebarNav aria-label="Main navigation">
      <NavList>
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} $active={pathname.startsWith(item.href)}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </NavList>
    </SidebarNav>
  );
}
