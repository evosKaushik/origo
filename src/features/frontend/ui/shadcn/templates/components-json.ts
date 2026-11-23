export function createComponentsJson(isTypeScript: boolean): string {
  const config = {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: isTypeScript,
    tailwind: {
      config: "",
      css: "src/index.css",
      baseColor: "slate",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
  };

  return `${JSON.stringify(config, null, 2)}\n`;
}
