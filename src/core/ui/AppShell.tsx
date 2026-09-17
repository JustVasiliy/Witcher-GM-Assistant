"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import {
  AppTitle,
  Content,
  Header,
  HeaderActions,
  Main,
  Shell,
  UserName,
} from "./AppShell.styles";

type AppShellProps = {
  user: { name?: string | null };
  headerActions?: ReactNode;
  rightPanel?: ReactNode;
  children: ReactNode;
};

export function AppShell({
  user,
  headerActions,
  rightPanel,
  children,
}: AppShellProps) {
  return (
    <Shell>
      <Sidebar />
      <Main>
        <Header>
          <AppTitle>Witcher GM Assistant</AppTitle>
          <HeaderActions>
            <UserName>{user.name ?? "Game Master"}</UserName>
            {headerActions}
          </HeaderActions>
        </Header>
        <Content>{children}</Content>
      </Main>
      {rightPanel}
    </Shell>
  );
}
