# Committed artifacts (debt)

This repository currently contains `.vercel/output/**` from an initial Grok/Vercel scaffold push.

That tree is generated output. It inflates repo size (~1.8 MB listed, much of it bundled vendor JS) and will drift from `src/`.

## Cleanup procedure (next operator pass)

```bash
git rm -r --cached .vercel
# then commit
# optional history rewrite:
# git filter-repo --path .vercel --invert-paths
```

`.gitignore` now excludes `.vercel/` so new dumps do not re-enter the index.
