import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const REPO = join(import.meta.dirname, "..");
const EXACT_VERSION = /^\d+\.\d+\.\d+$/;
const REPINNED_RUNTIME = /^\s*(?:node-version|version|ruby-version|wranglerVersion):\s*["']?\d/m;
const RUNTIMES = ["Node", "pnpm"];
const VERSIONS_SECTION = /^## Versions$([\s\S]*?)^## /m;
const QUOTED_VERSION = /\d+\.\d+/;

const read = (path: string): string => readFileSync(join(REPO, path), "utf8");
const json = <T>(path: string): T => JSON.parse(read(path)) as T;

const walk = (dir: string): string[] =>
	readdirSync(join(REPO, dir), { withFileTypes: true }).flatMap((entry) =>
		entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
	);

describe("pinned versions", () => {
	const manifest = json<{ engines: { node: string }; packageManager: string }>("package.json");
	const [packageManagerName, packageManagerVersion] = manifest.packageManager.split("@");

	it("names every runtime it pins", () => {
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

	it("quotes a version for none of them, since nothing here would keep one current", () => {
		const section = read("CLAUDE.md").match(VERSIONS_SECTION)?.[1] ?? "";
		const quoting = section.split("\n").filter((line) => line.startsWith("- ") && QUOTED_VERSION.test(line));

		expect(section).not.toBe("");
		expect(quoting).toEqual([]);
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

	it("lets no workflow or composite action pin a runtime the manifest already pins", () => {
		const workflows = walk(".github").filter((file) => file.endsWith(".yml"));
		const repinned = workflows.filter((file) => REPINNED_RUNTIME.test(read(file)));

		expect(workflows.length).toBeGreaterThan(0);
		expect(repinned).toEqual([]);
	});
});

// A version written into prose is a claim a bot invalidates on its own, and the rule above reads one section
// of one guide. This one reads every document: a tool named beside a version states what its manifest already
// states, and the manifest is the only copy Renovate keeps current. ADRs are exempt because a decision is
// dated and quotes the versions it decided on; the entries below are the sentences that narrate a past bump
// or a past mistake by its number, which is history rather than a claim about the tree.
// The esbuild target is the one number the guides may state, because it is a decision rather than a
// dependency: it is read from the config here so the guides cannot drift from it.
const STATED_VERSION =
	/\b(?:Node(?:\.js)?|pnpm|TypeScript|Astro|Next(?:\.js)?|React|Effect|Flutter|Dart|[Ww]rangler|Ruby|Starlight)\s+(?:v|@)?\d+(?:\.\d+)*\b/g;
const BUNDLE_TARGET = read("esbuild.config.ts").match(/target:\s*"([^"]+)"/)?.[1] ?? "";
const SKIPPED_DOCUMENT_DIRECTORIES = new Set(["node_modules", "dist", ".git", "adr"]);

const markdownDocuments = (dir: string): string[] =>
	readdirSync(join(REPO, dir), { withFileTypes: true }).flatMap((entry) => {
		const entryPath = dir === "." ? entry.name : join(dir, entry.name);
		if (entry.isDirectory()) return SKIPPED_DOCUMENT_DIRECTORIES.has(entry.name) ? [] : markdownDocuments(entryPath);
		return entry.name.endsWith(".md") && entry.name !== "CHANGELOG.md" ? [entryPath] : [];
	});

describe("stated versions", () => {
	it("quotes the esbuild target the config declares, read from the config", () => {
		expect(BUNDLE_TARGET).toMatch(/^node\d+$/);
		for (const doc of ["CLAUDE.md", "ARCHITECTURE.md"]) expect(read(doc)).toContain(`\`target: ${BUNDLE_TARGET}\``);
	});

	it("states the current version of nothing a bot moves, outside the ADRs", () => {
		const documents = markdownDocuments(".");
		const stated = documents.flatMap((file) =>
			[...read(file).matchAll(STATED_VERSION)].map(([match]) => `${file}: ${match}`),
		);

		expect(documents.length).toBeGreaterThan(0);
		expect(stated).toEqual([]);
	});
});
