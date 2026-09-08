"use client";

import { useState, type ReactNode } from "react";
import {
  CardHeader,
  CardWrapper,
  EditButton,
  Title,
} from "./EditableCard.styles";

type EditableCardProps = {
  title: string;
  view: ReactNode;
  renderEdit: (helpers: { cancel: () => void }) => ReactNode;
};

export function EditableCard({ title, view, renderEdit }: EditableCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <CardWrapper>
      <CardHeader>
        <Title>{title}</Title>
        {!isEditing && (
          <EditButton
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit ${title}`}
          >
            &#9998;
          </EditButton>
        )}
      </CardHeader>
      {isEditing ? renderEdit({ cancel: () => setIsEditing(false) }) : view}
    </CardWrapper>
  );
}
