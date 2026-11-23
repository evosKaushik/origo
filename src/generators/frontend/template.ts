export function renderTemplate(
  content: string,
  values: Record<string, string>
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) =>
      result.split(`{{${key}}}`).join(value),
    content
  );
}
