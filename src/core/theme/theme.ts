export const theme = {
  colors: {
    background: "#0a0a0a",
    foreground: "#ededed",
    accent: "#b3151b",
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
  },
} as const;

export type AppTheme = typeof theme;
