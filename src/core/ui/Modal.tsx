"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  ModalPanel,
  ModalTitle,
} from "./Modal.styles";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <ModalOverlay>
      <ModalPanel role="dialog" aria-modal="true" aria-label={title}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalCloseButton type="button" aria-label="Close" onClick={onClose}>
            &#10005;
          </ModalCloseButton>
        </ModalHeader>
        {children}
      </ModalPanel>
    </ModalOverlay>,
    document.body,
  );
}
