import { bytesToHex, concatBytes, hexToBytes, sha256 } from "./crypto";
import type { InclusionProof } from "./types";
import { GENESIS_HASH } from "./types";

async function nodeHash(left: string, right: string): Promise<string> {
  const digest = await sha256(
    concatBytes(new Uint8Array([0x01]), hexToBytes(left), hexToBytes(right)),
  );
  return bytesToHex(digest);
}

export async function chainAdvance(prevHash: string, leafHash: string): Promise<string> {
  const digest = await sha256(concatBytes(hexToBytes(prevHash), hexToBytes(leafHash)));
  return bytesToHex(digest);
}

export async function merkleRoot(leaves: string[]): Promise<string> {
  if (leaves.length === 0) return GENESIS_HASH;
  let layer = [...leaves];
  while (layer.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i]!;
      const right = layer[i + 1] ?? left;
      next.push(await nodeHash(left, right));
    }
    layer = next;
  }
  return layer[0]!;
}

export async function inclusionProof(leaves: string[], index: number): Promise<InclusionProof> {
  if (index < 0 || index >= leaves.length) {
    throw new Error("leaf index out of range");
  }
  const siblings: string[] = [];
  let layer = [...leaves];
  let idx = index;
  while (layer.length > 1) {
    const isRight = idx % 2 === 1;
    const pairIndex = isRight ? idx - 1 : idx + 1;
    const sibling = layer[pairIndex] ?? layer[idx]!;
    siblings.push(sibling);
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i]!;
      const right = layer[i + 1] ?? left;
      next.push(await nodeHash(left, right));
    }
    layer = next;
    idx = Math.floor(idx / 2);
  }
  return { index, leafCount: leaves.length, siblings };
}

export async function verifyInclusion(
  leafHash: string,
  proof: InclusionProof,
  root: string,
): Promise<boolean> {
  let hash = leafHash;
  let idx = proof.index;
  for (const sibling of proof.siblings) {
    const isRight = idx % 2 === 1;
    hash = isRight ? await nodeHash(sibling, hash) : await nodeHash(hash, sibling);
    idx = Math.floor(idx / 2);
  }
  return hash === root;
}
