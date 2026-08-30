"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Input } from "@/core/ui";
import { register as registerAction } from "../actions";
import { RegisterSchema, type RegisterInput } from "../schemas";
import {
  CenteredCard,
  Field,
  FooterLink,
  FooterText,
  Form,
  Title,
} from "./AuthForm.styles";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    undefined,
  );
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("email", data.email);
    formData.set("password", data.password);
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <CenteredCard>
      <Title>Create your account</Title>
      <Form onSubmit={onSubmit} noValidate method="post">
        <Field>
          <label htmlFor="name">Display name</label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...registerField("name")}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <Field>
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...registerField("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>
        <Field>
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...registerField("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>
        {state?.message && <FieldError>{state.message}</FieldError>}
        {state?.errors &&
          Object.values(state.errors)
            .flat()
            .filter((message): message is string => Boolean(message))
            .map((message) => <FieldError key={message}>{message}</FieldError>)}
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? "Creating account..." : "Sign up"}
        </Button>
      </Form>
      <FooterText>
        Already have an account? <FooterLink href="/login">Log in</FooterLink>
      </FooterText>
    </CenteredCard>
  );
}
