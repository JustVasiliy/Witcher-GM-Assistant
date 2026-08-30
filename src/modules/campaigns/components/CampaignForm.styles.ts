"use client";

import styled from "styled-components";
import { Card } from "@/core/ui";

export const FormCard = styled(Card)`
  max-width: 32rem;
  margin: ${({ theme }) => theme.spacing.lg} auto;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  label {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

export const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 1.5rem;
`;

export const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  font-family: inherit;
  font-size: 1rem;
  min-height: 6rem;
  resize: vertical;

  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.danger};
  }
`;
