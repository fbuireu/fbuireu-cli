import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const REPO = join(import.meta.dirname, "..");
const EXACT_VERSION = /^\d+\.\d+\.\d+$/;
const REPINNED_RUNTIME = /^\s*(?:node-version|version):\s*["']?\d/m;
const RUNTIMES = ["Node", "pnpm"];

const read = (path: string): string => readFileSync(join(REPO, path), "utf8");
const json = <T>(path: string): T => JSON.parse(read(path)) as T;

const walk = (dir: string): string[] =>
	readdirSync(join(REPO, dir), { withFileTypes: true }).flatMap((entry) =>
		entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
	);

describe("pinned versions", () => {
	const manifest = json<{ engines: { node: string }; packageManager: string }>("package.json");
	const [packageManagerName, packageManagerVersion] = manifest.packageManager.split("@");

	it("names every runtime it pins, whatever the manifest carries", () => {
		const guide = read("CLAUDE.md");
		const contributing = read("CONTRIBUTING.md");
		const unnamed = RUNTIMES.flatMap((runtime) =>
			[
				["CLAUDE.md", guide],
				["CONTRIBUTING.md", contributing],
			]
				.filter(([, body]) => !body?.includes(runtime))
				.map(([doc]) => `${doc} does not name ${runtime}`),
		);

		expect(unnamed).toEqual([]);
	});

	it("pins Node once: .nvmrc and engines.node are one fact, so they say the same thing", () => {
		expect(read(".nvmrc").trim()).toBe(manifest.engines.node);
	});

	it("pins pnpm once, through packageManager", () => {
		expect(packageManagerName).toBe("pnpm");
	});

	it("pins every runtime to an exact version, never a range", () => {
		expect(manifest.engines.node).toMatch(EXACT_VERSION);
		expect(packageManagerVersion).toMatch(EXACT_VERSION);
	});

	it("lets no workflow pin a runtime the manifest already pins", () => {
		const workflows = walk(".github").filter((file) => file.endsWith(".yml"));
		const repinned = workflows.filter((file) => REPINNED_RUNTIME.test(read(file)));

		expect(workflows.length).toBeGreaterThan(0);
		expect(repinned).toEqual([]);
	});
});
