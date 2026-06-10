// Muted, mono-friendly tints for sender names (work on the dark cinema bg).
const PALETTE = [
  "#d9d4cc",
  "#cbbfae",
  "#b9ccd2",
  "#d2c4b6",
  "#c2cbb6",
  "#cdbecb",
  "#cfc2b6",
  "#b6c7cc",
];

/** Deterministic colour for a user id (stable across renders). */
export function userColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
