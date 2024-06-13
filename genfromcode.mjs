const CODE_PATH = "/home/pierre/Code/core/main";

import { execSync } from "node:child_process";
// const command = `rg -iF '"front-commerce:' | awk -F'd\\\\("' '{print $2}' | awk -F'"' '{print $1}' | sort -u`;
const command = `rg -F '"front-commerce:' .`;
// run the command and get output as array
const result = execSync(command, {
  cwd: CODE_PATH,
  encoding: "utf-8",
  stdio: "pipe",
});

const lines = result.split("\n");

// extract the namespace of d() function
const res = lines
  .map((line) => {
    const match = line.match(/\("([^"]+)"/);
    return match && match[1];
  })
  .filter(Boolean)
  .sort();

// unique scopes
const unique = [...new Set(res)];

// read existing debug flags from docs/04-api-reference/debug-flags.json and update with the new ones
// warn if one doesn't exist
import { readFileSync, writeFileSync } from "node:fs";
const debugFlags = JSON.parse(
  readFileSync(
    `${process.cwd()}/docs/04-api-reference/debug-flags/debug-flags.json`,
    "utf-8"
  )
);

const newFlags = unique.filter((flag) => {
  if (debugFlags[flag]) {
    return false;
  }
  return true;
});
if (newFlags.length) {
  console.log("New flags must be documented:");
  console.log(newFlags);
  process.exit(1);
}

console.log(unique);
