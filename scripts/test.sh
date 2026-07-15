#!/usr/bin/env bash
# Validates the shared Biome config:
#   1. a conforming fixture passes `biome check`
#   2. a violating fixture fails `biome check` (proving rules load via extends)
#   3. the package `exports` target exists and is included in the published files
set -euo pipefail

cd "$(dirname "$0")/.."

biome() { npx --no-install @biomejs/biome "$@"; }

echo "==> clean fixture should pass"
biome check test/fixture/clean.ts

echo "==> invalid fixture should fail"
if biome check test/fixture/invalid.ts; then
    echo "ERROR: test/fixture/invalid.ts passed but was expected to fail" >&2
    exit 1
fi

echo "==> exports mapping should resolve to a packaged file"
node scripts/check-exports.mjs

echo "All config checks passed."
