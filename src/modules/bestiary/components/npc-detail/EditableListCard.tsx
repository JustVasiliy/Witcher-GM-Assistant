"use client";

import { useState, type ReactNode } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, type ZodType } from "zod";
import { Button, FieldError } from "@/core/ui";
import { ActionsRow } from "./SharedCardFields.styles";
import { EditableCard } from "./EditableCard";
import { EmptyText, ListRow, RemoveButton } from "./EditableListCard.styles";

type ListFormValues<T> = { items: T[] };

type EditableListCardProps<T> = {
  title: string;
  items: T[];
  emptyItem: T;
  itemSchema: ZodType<T>;
  renderView: (item: T, index: number) => ReactNode;
  renderEditRow: (index: number) => ReactNode;
  onSave: (items: T[]) => Promise<{ error?: string } | undefined>;
  addLabel: string;
  saveLabel: string;
};

export function EditableListCard<T>({
  title,
  items,
  emptyItem,
  itemSchema,
  renderView,
  renderEditRow,
  onSave,
  addLabel,
  saveLabel,
}: EditableListCardProps<T>) {
  return (
    <EditableCard
      title={title}
      view={
        items.length === 0 ? (
          <EmptyText>None yet.</EmptyText>
        ) : (
          <>
            {items.map((item, index) => (
              <ListRow key={index}>{renderView(item, index)}</ListRow>
            ))}
          </>
        )
      }
      renderEdit={({ cancel }) => (
        <EditableListForm
          items={items}
          emptyItem={emptyItem}
          itemSchema={itemSchema}
          renderEditRow={renderEditRow}
          onSave={onSave}
          addLabel={addLabel}
          saveLabel={saveLabel}
          onCancel={cancel}
        />
      )}
    />
  );
}

type EditableListFormProps<T> = {
  items: T[];
  emptyItem: T;
  itemSchema: ZodType<T>;
  renderEditRow: (index: number) => ReactNode;
  onSave: (items: T[]) => Promise<{ error?: string } | undefined>;
  addLabel: string;
  saveLabel: string;
  onCancel: () => void;
};

function EditableListForm<T>({
  items,
  emptyItem,
  itemSchema,
  renderEditRow,
  onSave,
  addLabel,
  saveLabel,
  onCancel,
}: EditableListFormProps<T>) {
  const [serverError, setServerError] = useState<string | undefined>();
  const methods = useForm<ListFormValues<T>>({
    resolver: zodResolver(z.object({ items: z.array(itemSchema) })) as never,
    defaultValues: { items } as never,
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items" as never,
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await onSave(data.items);
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onCancel();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        {fields.map((field, index) => (
          <ListRow key={field.id}>
            {renderEditRow(index)}
            <RemoveButton
              type="button"
              onClick={() => remove(index)}
              aria-label="Remove item"
            >
              &times;
            </RemoveButton>
          </ListRow>
        ))}
        <Button type="button" onClick={() => append(emptyItem as never)}>
          {addLabel}
        </Button>
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
    </FormProvider>
  );
}
