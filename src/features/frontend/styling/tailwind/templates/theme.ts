export interface TailwindTheme {
  colors: Record<string, Record<string, string>>;
  fontFamily: Record<string, string[]>;
}

export const defaultTailwindTheme: TailwindTheme = {
  colors: {
    brand: {
      50: "#f5f0ff",
      100: "#e9ddff",
      300: "#b987ff",
      500: "#781bff",
      700: "#5a12bd",
      900: "#2d075f",
    },
  },
  fontFamily: {
    sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
  },
};

export function createTailwindV3Config(theme: TailwindTheme) {
  return {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: theme.colors,
        fontFamily: theme.fontFamily,
      },
    },
    plugins: [],
  };
}

export function renderTailwindV4Theme(theme: TailwindTheme): string {
  const declarations: string[] = [];

  for (const [name, shades] of Object.entries(theme.colors)) {
    for (const [shade, value] of Object.entries(shades)) {
      declarations.push(`  --color-${name}-${shade}: ${value};`);
    }
  }

  for (const [name, family] of Object.entries(theme.fontFamily)) {
    declarations.push(`  --font-${name}: ${family.join(", ")};`);
  }

  return `@theme {\n${declarations.join("\n")}\n}`;
}
