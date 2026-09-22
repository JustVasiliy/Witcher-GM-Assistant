"use client";

import { TabButton, TabList } from "./Tabs.styles";

export type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
};

export function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <TabList role="tablist">
      {items.map((item) => (
        <TabButton
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === activeId}
          $active={item.id === activeId}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </TabButton>
      ))}
    </TabList>
  );
}
