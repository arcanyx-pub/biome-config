// Guards against the "exports points at a file that isn't shipped" class of
// bug: the config is consumed via `extends: ["@arcanyx/biome-config"]`, which
// resolves through package.json "exports", so that target must exist on disk
// AND be listed in "files" or it won't be in the published tarball.
import { existsSync, readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

const target = pkg.exports?.["."];
if (!target) {
    throw new Error('package.json "exports"["."] is not defined');
}

if (!existsSync(target)) {
    throw new Error(`exports target "${target}" does not exist on disk`);
}

const base = target.replace(/^\.\//, "");
const files = pkg.files ?? [];
const packaged = files.some(f => {
    const entry = f.replace(/^\.\//, "").replace(/\/$/, "");
    return base === entry || base.startsWith(`${entry}/`);
});
if (!packaged) {
    throw new Error(
        `exports target "${base}" is not covered by package.json "files": ${JSON.stringify(files)}`,
    );
}

console.log(`exports "." -> ${target} exists and is packaged`);
