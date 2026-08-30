"use client";

import Link from "next/link";
import styled from "styled-components";
import { Card } from "@/core/ui";

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

export const FooterText = styled.p`
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: underline;
`;

export const CenteredCard = styled(Card)`
  max-width: 24rem;
  margin: ${({ theme }) => theme.spacing.lg} auto;
`;
