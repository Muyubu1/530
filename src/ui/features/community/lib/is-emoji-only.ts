const PICTOGRAPHIC = /\p{Extended_Pictographic}/u;

/** Returns the emoji count if the text is only 1–3 emoji, else 0. */
export function emojiOnlyCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const graphemes =
    typeof Intl !== "undefined" && "Segmenter" in Intl
      ? [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(trimmed)].map(
          (s) => s.segment,
        )
      : [...trimmed];
  if (graphemes.length === 0 || graphemes.length > 3) return 0;
  return graphemes.every((g) => PICTOGRAPHIC.test(g)) ? graphemes.length : 0;
}
