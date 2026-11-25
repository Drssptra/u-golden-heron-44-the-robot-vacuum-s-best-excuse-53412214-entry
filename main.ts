// The Robot Vacuum's Best Excuse — make.fun bounty entry, v2 (revised).
//
// The entry is one line in the vacuum's own voice: the cat sat on it all
// afternoon, and rather than start a war over the spot, the vacuum chose
// diplomacy. This program assembles that line from its clauses, checks it
// against the competition gate (1-140 characters, one line, no trailing
// newline), and writes it byte-exact to $MAKEFUN_OUTPUT_DIR/entry.txt.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

type Clause = { text: string; sep: string };

const CLAUSES: Clause[] = [
  { text: "The cat sat on me all afternoon.", sep: "" },
  { text: "I am a vacuum, not a throne,", sep: " " },
  { text: "but I didn't want to start a war.", sep: " " },
];

const GATE = { minChars: 1, maxChars: 140 } as const;

function assemble(clauses: Clause[]): string {
  return clauses.map((c) => c.sep + c.text).join("");
}

function gateCheck(line: string): void {
  const chars = Array.from(line);
  if (chars.length < GATE.minChars || chars.length > GATE.maxChars) {
    throw new Error(
      `entry is ${chars.length} characters, outside the ${GATE.minChars}-${GATE.maxChars} gate`,
    );
  }
  if (line.trim() !== line || line.includes("\n")) {
    throw new Error("entry must be a single line with no surrounding whitespace");
  }
  // The entry is plain ASCII, so its UTF-8 byte length must equal its
  // character count; anything else means an invisible character crept in.
  if (Buffer.byteLength(line, "utf8") !== chars.length) {
    throw new Error("entry must be plain ASCII text");
  }
}

function outputDir(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  if (dir && dir.trim() !== "") return dir;
  return "/output";
}

async function main(): Promise<void> {
  const entry = assemble(CLAUSES);
  gateCheck(entry);
  const dir = outputDir();
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "entry.txt"), entry, "utf8");
  const written = await readFile(join(dir, "entry.txt"), "utf8");
  if (written !== entry) {
    throw new Error("entry.txt does not match the entry text after writing");
  }
  process.stdout.write(`${entry}\n`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
