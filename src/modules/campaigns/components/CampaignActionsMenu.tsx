"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  MenuButton,
  MenuLink,
  MenuPanel,
  MenuWrapper,
} from "./CampaignActionsMenu.styles";

type CampaignActionsMenuProps = {
  editHref: string;
  editLabel: string;
  children: ReactNode;
};

export function CampaignActionsMenu({
  editHref,
  editLabel,
  children,
}: CampaignActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <MenuWrapper ref={wrapperRef}>
      <MenuButton
        type="button"
        aria-label="More actions"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        ⋮
      </MenuButton>
      {open && (
        <MenuPanel>
          <MenuLink href={editHref}>{editLabel}</MenuLink>
          {children}
        </MenuPanel>
      )}
    </MenuWrapper>
  );
}
