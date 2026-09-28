"use client";

import { useState, useTransition } from "react";
import { Button, FieldError, Modal } from "@/core/ui";
import { addCriticalWound } from "../actions";
import { woundsBySeverity } from "../critical-wounds/catalog";
import {
  SEVERITY_LABELS,
  WOUND_SEVERITIES,
  type CriticalWound,
  type WoundSeverity,
  type WoundState,
} from "../critical-wounds/types";
import { AddButtons, EmptyText, WoundList } from "./CriticalWoundsModal.styles";
import { WoundPicker } from "./WoundPicker";
import { WoundRow } from "./WoundRow";

type CriticalWoundsModalProps = {
  encounterNpcId: string;
  campaignId: string;
  sessionId: string;
  wounds: CriticalWound[];
  error?: string;
  onSetState: (woundId: string, state: WoundState) => void;
  onRemove: (woundId: string) => void;
  onClose: () => void;
};

export function CriticalWoundsModal({
  encounterNpcId,
  campaignId,
  sessionId,
  wounds,
  error,
  onSetState,
  onRemove,
  onClose,
}: CriticalWoundsModalProps) {
  const [view, setView] = useState<"list" | WoundSeverity>("list");
  const [isAdding, startAdding] = useTransition();
  const [addError, setAddError] = useState<string | undefined>();

  // While an add is pending, block closing (Esc / ✕) so the modal can't be
  // reopened mid-add, which would re-enable the picker and allow a double-add.
  const handleClose = isAdding ? () => {} : onClose;

  function addWound(woundKey: string) {
    setAddError(undefined);
    startAdding(async () => {
      const result = await addCriticalWound(
        encounterNpcId,
        campaignId,
        sessionId,
        woundKey,
      );
      if (result?.error) {
        setAddError(result.error);
        return;
      }
      onClose();
    });
  }

  if (view !== "list") {
    return (
      <Modal
        title={`${SEVERITY_LABELS[view]} Wounds`}
        onClose={handleClose}
        wide
      >
        <WoundPicker
          severity={view}
          disabled={isAdding}
          onBack={() => setView("list")}
          onPick={addWound}
        />
        {addError && <FieldError>{addError}</FieldError>}
      </Modal>
    );
  }

  return (
    <Modal title="Critical Wounds" onClose={handleClose} wide>
      {wounds.length === 0 ? (
        <EmptyText>No critical wounds.</EmptyText>
      ) : (
        <WoundList>
          {wounds.map((wound) => (
            <WoundRow
              key={wound.id}
              wound={wound}
              onSetState={(state) => onSetState(wound.id, state)}
              onRemove={() => onRemove(wound.id)}
            />
          ))}
        </WoundList>
      )}
      {error && <FieldError>{error}</FieldError>}
      <AddButtons>
        {WOUND_SEVERITIES.map((severity) => {
          const hasWounds = woundsBySeverity(severity).length > 0;
          return (
            <Button
              key={severity}
              type="button"
              disabled={!hasWounds}
              title={hasWounds ? undefined : "Coming soon"}
              onClick={() => setView(severity)}
            >
              Add {SEVERITY_LABELS[severity]} Wound
            </Button>
          );
        })}
      </AddButtons>
    </Modal>
  );
}
