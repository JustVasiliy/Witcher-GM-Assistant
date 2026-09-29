"use client";

import { Button, FieldError, Modal } from "@/core/ui";
import type { EffectDefinition } from "../effects/types";
import { EffectInfo } from "./EffectInfo";
import { Actions } from "./EffectInfo.styles";

type EffectCardModalProps = {
  definition: EffectDefinition;
  error?: string;
  onRemove: () => void;
  onClose: () => void;
};

export function EffectCardModal({
  definition,
  error,
  onRemove,
  onClose,
}: EffectCardModalProps) {
  return (
    <Modal title={`${definition.icon} ${definition.name}`} onClose={onClose}>
      <EffectInfo definition={definition} />
      {error && <FieldError>{error}</FieldError>}
      <Actions>
        <Button type="button" onClick={onRemove}>
          Remove Effect
        </Button>
      </Actions>
    </Modal>
  );
}
