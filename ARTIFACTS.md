# Committed non-source blobs

Checked 2026-10-06 against the default-branch tree.

## Cleared

`.vercel/output/**` is not in the tree. A recursive filter on `.vercel` returned zero blobs. `.gitignore` should keep that path out. Do not re-add Vercel build output.

## Still present

- `artifacts/imagine_images/f5454902-eeba-4470-9beb-6c79b4aab3d4.jpg` (209350 bytes). Design image, not a compiler artifact. Keep only if it is a referenced source asset; otherwise delete in a follow-up commit.
- `package-lock.json` is a lockfile. Keep it.

No `node_modules/`, `dist/`, or `__pycache__/` directories are committed.
