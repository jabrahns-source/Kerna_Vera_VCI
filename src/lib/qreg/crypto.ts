import { DEMO_SIGNING_JWK } from "./types";

export function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += bytes[i]!.toString(16).padStart(2, "0");
  }
  return out;
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim().toLowerCase();
  if (clean.length % 2 !== 0) throw new Error("hex length must be even");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]!);
  const b64 = btoa(bin);
  return b64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function b64urlToBytes(text: string): Uint8Array {
  const padded = text.replaceAll("-", "+").replaceAll("_", "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const bin = atob(padded + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

export async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return new Uint8Array(digest);
}

export function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export function u32be(value: number): Uint8Array {
  const buf = new Uint8Array(4);
  const view = new DataView(buf.buffer);
  view.setUint32(0, value, false);
  return buf;
}

/** FIPS 180-4 SHA-256 over a length-delimited payload. */
export async function leafDigest(payload: Uint8Array): Promise<string> {
  const digest = await sha256(concatBytes(u32be(payload.length), payload));
  return bytesToHex(digest);
}

export async function importSigningKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    { ...DEMO_SIGNING_JWK },
    { name: "Ed25519" },
    true,
    ["sign"],
  );
}

export async function importVerifyKey(x: string = DEMO_SIGNING_JWK.x): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    { kty: "OKP", crv: "Ed25519", x },
    { name: "Ed25519" },
    true,
    ["verify"],
  );
}

export async function signLeaf(leafHashHex: string, key: CryptoKey): Promise<string> {
  const sig = await crypto.subtle.sign("Ed25519", key, hexToBytes(leafHashHex) as BufferSource);
  return bytesToB64url(new Uint8Array(sig));
}

export async function verifyLeaf(
  leafHashHex: string,
  signatureB64: string,
  key: CryptoKey,
): Promise<boolean> {
  try {
    return await crypto.subtle.verify(
      "Ed25519",
      key,
      b64urlToBytes(signatureB64) as BufferSource,
      hexToBytes(leafHashHex) as BufferSource,
    );
  } catch {
    return false;
  }
}

export function flipByte(b64url: string, index = 0): string {
  const bytes = b64urlToBytes(b64url);
  const i = Math.min(index, bytes.length - 1);
  bytes[i] = (bytes[i]! ^ 0xff) & 0xff;
  return bytesToB64url(bytes);
}
