"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { CampaignSession } from "@/generated/prisma/client";
import { Button, FieldError, Input } from "@/core/ui";
import { createSession, updateSession } from "../actions";
import { CampaignSessionSchema, type CampaignSessionInput } from "../schemas";
import { Field, Form, FormCard, TextArea, Title } from "./CampaignForm.styles";

type SessionFormProps = {
  campaignId: string;
  session?: CampaignSession;
};

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function SessionForm({ campaignId, session }: SessionFormProps) {
  const action = session
    ? updateSession.bind(null, campaignId, session.id)
    : createSession.bind(null, campaignId);
  const [state, formAction, isPending] = useActionState(action, undefined);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<
    z.input<typeof CampaignSessionSchema>,
    unknown,
    CampaignSessionInput
  >({
    resolver: zodResolver(CampaignSessionSchema),
    defaultValues: {
      title: session?.title ?? "",
      date: session ? toDateInputValue(session.date) : "",
      playerCount: session?.playerCount ?? undefined,
      description: session?.description ?? undefined,
    },
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.set("title", data.title);
    formData.set("date", data.date);
    formData.set(
      "playerCount",
      data.playerCount !== undefined ? String(data.playerCount) : "",
    );
    formData.set("description", data.description ?? "");
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <FormCard>
      <Title>{session ? "Edit session" : "New session"}</Title>
      <Form onSubmit={onSubmit} noValidate method="post">
        <Field>
          <label htmlFor="title">Title</label>
          <Input
            id="title"
            type="text"
            aria-invalid={Boolean(errors.title)}
            {...registerField("title")}
          />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>
        <Field>
          <label htmlFor="date">Date</label>
          <Input
            id="date"
            type="date"
            aria-invalid={Boolean(errors.date)}
            {...registerField("date")}
          />
          {errors.date && <FieldError>{errors.date.message}</FieldError>}
        </Field>
        <Field>
          <label htmlFor="playerCount">Number of players</label>
          <Input
            id="playerCount"
            type="number"
            min={0}
            max={99}
            aria-invalid={Boolean(errors.playerCount)}
            {...registerField("playerCount")}
          />
          {errors.playerCount && (
            <FieldError>{errors.playerCount.message}</FieldError>
          )}
        </Field>
        <Field>
          <label htmlFor="description">Description</label>
          <TextArea
            id="description"
            aria-invalid={Boolean(errors.description)}
            {...registerField("description")}
          />
          {errors.description && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>
        {state?.message && <FieldError>{state.message}</FieldError>}
        {state?.errors &&
          Object.values(state.errors)
            .flat()
            .filter((message): message is string => Boolean(message))
            .map((message) => <FieldError key={message}>{message}</FieldError>)}
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? "Saving..." : session ? "Save changes" : "Add session"}
        </Button>
      </Form>
    </FormCard>
  );
}
