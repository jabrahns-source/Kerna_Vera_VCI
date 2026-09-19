/**
 * Wire-format serializer matching Python json.dumps(
 *   sort_keys=True, separators=(",", ":"), ensure_ascii=True
 * )
 *
 * Vector 3 (Unicode Section Drift) depends on § (U+00A7) being emitted as
 * the six-byte sequence \\u00a7 rather than UTF-8 C2 A7.
 */

function sortKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortKeys);
  const obj = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    const item = obj[key];
    if (item === undefined) continue;
    sorted[key] = sortKeys(item);
  }
  return sorted;
}

function ensureAscii(json: string): string {
  return json.replace(/[\u007f-\uffff]/g, (ch) => {
    const hex = ch.charCodeAt(0).toString(16).padStart(4, "0");
    return `\\u${hex}`;
  });
}

export function canonicalJson(value: unknown): string {
  return ensureAscii(JSON.stringify(sortKeys(value)));
}

export function utf8Bytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

/** Attack serializer: identical to canonicalJson except § stays raw UTF-8. */
export function jsonEnsureAsciiFalse(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}
