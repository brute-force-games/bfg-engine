import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const moduleRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(moduleRoot, "src");
const testsRoot = __dirname;

const TEST_FILE_PATTERN = /\.(test|spec)\.(c|m)?[tj]sx?$/;
const EXCLUDED_TEST_RELATIVE_PATHS = new Set<string>(["structure"]);

const listFiles = (root: string): string[] => {
  const entries = fs.readdirSync(root, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      return listFiles(entryPath);
    }

    return [entryPath];
  });
};

const normaliseTestRelPath = (filePath: string): string => {
  const relative = path.relative(testsRoot, filePath);

  return relative.replace(TEST_FILE_PATTERN, "");
};

const collectDirectories = (root: string, base: string): Set<string> => {
  const directories = new Set<string>();
  const entries = fs.readdirSync(root, { withFileTypes: true });

  entries.forEach((entry) => {
    if (!entry.isDirectory()) {
      return;
    }

    const directoryPath = path.join(root, entry.name);
    const relative = path.relative(base, directoryPath);

    directories.add(relative);

    collectDirectories(directoryPath, base).forEach((child) => {
      directories.add(child);
    });
  });

  return directories;
};

describe("test directory mirrors src structure", () => {
  it("only contains tests for existing source files", () => {
    const testFiles = listFiles(testsRoot).filter((file) => TEST_FILE_PATTERN.test(file));

    const missingSources = testFiles
      .map((testFile) => {
        const relative = normaliseTestRelPath(testFile);

        if (EXCLUDED_TEST_RELATIVE_PATHS.has(relative)) {
          return undefined;
        }

        const srcCandidateExtensions = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];

        const hasSourceMatch = srcCandidateExtensions.some((extension) => {
          const candidate = path.join(srcRoot, `${relative}${extension}`);

          return fs.existsSync(candidate);
        });

        return hasSourceMatch ? undefined : relative;
      })
      .filter((value): value is string => value !== undefined);

    expect(missingSources).toEqual([]);
  });

  it("does not introduce folders that are missing in src", () => {
    const testDirectories = collectDirectories(testsRoot, testsRoot);

    const unmatched = Array.from(testDirectories).filter((relativeDirectory) => {
      const sourceDirectory = path.join(srcRoot, relativeDirectory);

      return !fs.existsSync(sourceDirectory);
    });

    expect(unmatched).toEqual([]);
  });
});
