export const theme = {
  colors: {
    background: "#0a0a0a",
    foreground: "#ededed",
    accent: "#b3151b",
    surface: "#161616",
    border: "#2a2a2a",
    danger: "#e0524b",
    mutedForeground: "#a3a3a3",
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
  },
  radii: {
    sm: "4px",
    md: "8px",
  },
} as const;

export type AppTheme = typeof theme;
