"use client";

import { Button, Modal } from "@/core/ui";
import { ActionsRow } from "./SharedCardFields.styles";
import type { RollSide } from "@/modules/roll-history";

type SideSelectModalProps = {
  onSelect: (side: RollSide) => void;
  onClose: () => void;
};

export function SideSelectModal({ onSelect, onClose }: SideSelectModalProps) {
  return (
    <Modal title="Which side are you on?" onClose={onClose}>
      <ActionsRow>
        <Button type="button" onClick={() => onSelect("attacking")}>
          Attacking
        </Button>
        <Button type="button" onClick={() => onSelect("defending")}>
          Defending
        </Button>
      </ActionsRow>
    </Modal>
  );
}
