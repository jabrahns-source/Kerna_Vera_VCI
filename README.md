# Kerna_Vera_VCI

Web console for Kerna-Ledger / VERA / Q-Reg: deterministic receipts, Merkle seals, and adversarial preview.

[![CI](https://github.com/jabrahns-source/Kerna_Vera_VCI/actions/workflows/ci.yml/badge.svg)](https://github.com/jabrahns-source/Kerna_Vera_VCI/actions/workflows/ci.yml)

## Source of truth

- Application source: `src/` (Q-Reg TS engine under `src/lib/qreg/`).
- Canonical Python/Rust engine: https://github.com/jabrahns-source/Q-Reg
- Packet runtime: https://github.com/jabrahns-source/vera-packet-runtime
- Enterprise API: https://github.com/jabrahns-source/vera-enterprise-engine

## Do not treat as source

`.vercel/output/` was committed by the initial scaffold dump. It is a **build artifact**. Ignore it. Delete from git history when you next run `git filter-repo`. Do not edit hashed `_ssr/*.mjs` files.

`.grok/` is agent scaffold, not product runtime.

## Usage

```bash
npm install
npm test   # if package.json defines it
npm run build
```

Determinism rules for any JS port of the engine:

- Canonical JSON: `JSON.stringify` is **not** sufficient. Use a sorted-key encoder matching `json.dumps(..., sort_keys=True, separators=(",", ":"), ensure_ascii=True)`.
- CARB factor is `0.428` MT CO2e / MWh (Title 17 CCR §95111). Do not invent another factor.
- PIPELINE_ERROR never produces a sealable receipt.

## License

MIT. Author: Jacarri Sanders / Even The Odds Foundry.
