"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Campaign } from "@/generated/prisma/client";
import { Button, FieldError, Input } from "@/core/ui";
import { createCampaign, updateCampaign } from "../actions";
import { CampaignSchema, type CampaignInput } from "../schemas";
import { Field, Form, FormCard, TextArea, Title } from "./CampaignForm.styles";

type CampaignFormProps = {
  campaign?: Campaign;
};

export function CampaignForm({ campaign }: CampaignFormProps) {
  const action = campaign
    ? updateCampaign.bind(null, campaign.id)
    : createCampaign;
  const [state, formAction, isPending] = useActionState(action, undefined);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignInput>({
    resolver: zodResolver(CampaignSchema),
    defaultValues: {
      name: campaign?.name ?? "",
      description: campaign?.description ?? undefined,
    },
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("description", data.description ?? "");
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <FormCard>
      <Title>{campaign ? "Edit campaign" : "New campaign"}</Title>
      <Form onSubmit={onSubmit} noValidate method="post">
        <Field>
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            type="text"
            aria-invalid={Boolean(errors.name)}
            {...registerField("name")}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
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
          {isPending
            ? "Saving..."
            : campaign
              ? "Save changes"
              : "Create campaign"}
        </Button>
      </Form>
    </FormCard>
  );
}
