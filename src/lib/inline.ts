/**
 * Content strings may carry inline links as [anchor](/path/). Pages render them
 * with <InlineText>; anything that needs plain text (JSON-LD, meta tags) goes
 * through stripInline so the markup never reaches a search engine as literal
 * brackets.
 */
export const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function stripInline(text: string): string {
  return text.replace(INLINE_LINK, "$1");
}
