export interface CssDocument {
  imports: string[];
  body: string[];
}

export function parseCss(content: string): CssDocument {
  const lines = content.split("\n");
  const imports: string[] = [];
  const body: string[] = [];

  for (const line of lines) {
    if (line.trimStart().startsWith("@import")) {
      imports.push(line.trim());
    } else {
      body.push(line);
    }
  }

  return { imports, body };
}

export function addCssImport(document: CssDocument, statement: string): void {
  if (!document.imports.includes(statement)) {
    document.imports.push(statement);
  }
}

export function addCssBlock(document: CssDocument, block: string): void {
  const normalized = block.trim();

  if (document.body.join("\n").includes(normalized)) {
    return;
  }

  document.body.push("", normalized);
}

export function renderCss(document: CssDocument): string {
  const sections: string[] = [];

  if (document.imports.length) {
    sections.push(document.imports.join("\n"));
  }

  sections.push(document.body.join("\n").replace(/^\n+/, ""));
  return `${sections.join("\n\n").replace(/\n+$/, "")}\n`;
}
