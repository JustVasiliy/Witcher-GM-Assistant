"use client";

import styled from "styled-components";

const Main = styled.main`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

export default function Home() {
  return (
    <Main>
      <Title>Hello, world!</Title>
    </Main>
  );
}
