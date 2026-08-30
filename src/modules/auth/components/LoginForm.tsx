"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, FieldError, Input } from "@/core/ui";
import { login as loginAction } from "../actions";
import { LoginSchema, type LoginInput } from "../schemas";
import { Field, FooterLink, FooterText, Form, Title } from "./AuthForm.styles";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <Card>
      <Title>Log in</Title>
      <Form onSubmit={onSubmit} noValidate method="post">
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
            autoComplete="current-password"
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
          {isPending ? "Logging in..." : "Log in"}
        </Button>
      </Form>
      <FooterText>
        Don&apos;t have an account?{" "}
        <FooterLink href="/register">Sign up</FooterLink>
      </FooterText>
    </Card>
  );
}
