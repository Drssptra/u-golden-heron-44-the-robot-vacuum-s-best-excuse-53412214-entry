// The Robot Vacuum's Best Excuse — make.fun bounty entry.
//
// One original line, written in this session: a robot vacuum explains,
// in its own voice, why it skipped a spot. The program writes that exact
// line to $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline, and
// prints the same line plus a trailing newline to stdout.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My map says that corner is a wall. I drew the map. I am not arguing with myself about it.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");
process.stdout.write(ENTRY + "\n");
