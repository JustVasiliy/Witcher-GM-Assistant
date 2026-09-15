"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Input } from "@/core/ui";
import { LoreExcerptSchema, type LoreExcerpt } from "../../schemas";
import { EditableCard } from "./EditableCard";
import { ActionsRow, Field, FieldGrid } from "./SharedCardFields.styles";
import { LoreText, TextArea } from "./LoreExcerptCard.styles";

type LoreExcerptCardProps = {
  title: string;
  dcLabel: string;
  excerpt: LoreExcerpt | undefined;
  saveLabel: string;
  onSave: (data: LoreExcerpt) => Promise<{ error?: string } | undefined>;
};

export function LoreExcerptCard({
  title,
  dcLabel,
  excerpt,
  saveLabel,
  onSave,
}: LoreExcerptCardProps) {
  return (
    <EditableCard
      title={excerpt ? `${title} (${dcLabel} ${excerpt.dc})` : title}
      view={<LoreText>{excerpt?.text ?? "No text yet."}</LoreText>}
      renderEdit={({ cancel }) => (
        <LoreExcerptForm
          dcLabel={dcLabel}
          excerpt={excerpt}
          saveLabel={saveLabel}
          onSave={onSave}
          onCancel={cancel}
        />
      )}
    />
  );
}

type LoreExcerptFormProps = {
  dcLabel: string;
  excerpt: LoreExcerpt | undefined;
  saveLabel: string;
  onSave: (data: LoreExcerpt) => Promise<{ error?: string } | undefined>;
  onCancel: () => void;
};

function LoreExcerptForm({
  dcLabel,
  excerpt,
  saveLabel,
  onSave,
  onCancel,
}: LoreExcerptFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoreExcerpt>({
    resolver: zodResolver(LoreExcerptSchema),
    defaultValues: { dc: excerpt?.dc ?? 10, text: excerpt?.text ?? "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await onSave(data);
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onCancel();
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGrid>
        <Field>
          <label htmlFor="lore-dc">{dcLabel}</label>
          <Input
            id="lore-dc"
            type="number"
            min={1}
            aria-invalid={Boolean(errors.dc)}
            {...register("dc", { valueAsNumber: true })}
          />
          {errors.dc && <FieldError>{errors.dc.message}</FieldError>}
        </Field>
      </FieldGrid>
      <Field>
        <label htmlFor="lore-text">Text</label>
        <TextArea
          id="lore-text"
          aria-invalid={Boolean(errors.text)}
          {...register("text")}
        />
        {errors.text && <FieldError>{errors.text.message}</FieldError>}
      </Field>
      {serverError && <FieldError>{serverError}</FieldError>}
      <ActionsRow>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : saveLabel}
        </Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </ActionsRow>
    </form>
  );
}
