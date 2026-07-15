// Violates correctness/noUnusedVariables: `unusedValue` is never read.
// The test asserts that `biome check` fails on this file, proving the shared
// linter rules are actually applied through `extends`.
export function compute() {
    const unusedValue = 1;
    return 42;
}
