"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Field,
  FieldError,
  Form,
  FormCard,
  FormTitle,
  Input,
  TextArea,
} from "@/core/ui";
import { createNote, updateNote } from "../actions";
import { NoteSchema, type NoteInput } from "../schemas";
import type { Note } from "../types";

type NoteFormProps = {
  note?: Note;
};

export function NoteForm({ note }: NoteFormProps) {
  const action = note ? updateNote.bind(null, note.id) : createNote;
  const [state, formAction, isPending] = useActionState(action, undefined);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteInput>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      title: note?.title ?? "",
      content: note?.content ?? "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.set("title", data.title);
    formData.set("content", data.content);
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <FormCard>
      <FormTitle>{note ? "Edit note" : "New note"}</FormTitle>
      <Form onSubmit={onSubmit} noValidate method="post">
        <Field>
          <label htmlFor="title">Title</label>
          <Input
            id="title"
            type="text"
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>
        <Field>
          <label htmlFor="content">Content</label>
          <TextArea
            id="content"
            aria-invalid={Boolean(errors.content)}
            {...register("content")}
          />
          {errors.content && <FieldError>{errors.content.message}</FieldError>}
        </Field>
        {state?.message && <FieldError>{state.message}</FieldError>}
        {state?.errors &&
          Object.values(state.errors)
            .flat()
            .filter((message): message is string => Boolean(message))
            .map((message) => <FieldError key={message}>{message}</FieldError>)}
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? "Saving..." : note ? "Save changes" : "Add note"}
        </Button>
      </Form>
    </FormCard>
  );
}
