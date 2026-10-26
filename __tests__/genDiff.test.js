import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import genDiff from "../index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, "..", "__fixtures__", filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), "utf-8").trim();

const genDiffFromFixtures = (filename1, filename2, formatName) =>
  genDiff(getFixturePath(filename1), getFixturePath(filename2), formatName);

const outputFormats = [
  { formatName: "stylish", extension: "txt" },
  { formatName: "plain", extension: "txt" },
  { formatName: "json", extension: "json" },
];

const scenarios = [
  { name: "basic config", fixture: "expected", inputs: ["file1.json", "file2.json"] },
  { name: "basic config", fixture: "expected", inputs: ["file1.yml", "file2.yml"] },
  { name: "basic config", fixture: "expected", inputs: ["file1.json", "file2.yaml"] },
  { name: "value types", fixture: "values", inputs: ["values1.json", "values2.json"] },
  { name: "value types", fixture: "values", inputs: ["values1.yml", "values2.yml"] },
  { name: "value types", fixture: "values", inputs: ["values1.yml", "values2.json"] },
];

const cases = scenarios.flatMap((scenario) =>
  outputFormats.map((output) => ({ ...scenario, ...output })),
);

describe("genDiff", () => {
  test.each(cases)(
    "$name: $inputs.0 vs $inputs.1 in $formatName format",
    ({ fixture, inputs, formatName, extension }) => {
      const expected = readFixture(`${fixture}_${formatName}.${extension}`);
      expect(genDiffFromFixtures(...inputs, formatName)).toEqual(expected);
    },
  );

  test.each([
    ["file1.json", "file2.json"],
    ["file1.yml", "file2.yml"],
  ])("uses stylish format by default for %s vs %s", (filename1, filename2) => {
    expect(genDiffFromFixtures(filename1, filename2)).toEqual(readFixture("expected_stylish.txt"));
  });

  test("json output is a valid serialization of the diff", () => {
    const result = JSON.parse(genDiffFromFixtures("file1.json", "file2.yml", "json"));
    expect(result).toEqual(JSON.parse(readFixture("expected_json.json")));
  });

  test("identical files have no changes", () => {
    expect(genDiffFromFixtures("file1.json", "file1.yml")).toEqual(
      readFixture("identical_stylish.txt"),
    );
    expect(genDiffFromFixtures("file1.json", "file1.yml", "plain")).toEqual("");
  });

  test("accepts paths relative to the current working directory", () => {
    const filepath1 = path.relative(process.cwd(), getFixturePath("file1.json"));
    const filepath2 = path.relative(process.cwd(), getFixturePath("file2.yml"));
    expect(path.isAbsolute(filepath1)).toBe(false);
    expect(genDiff(filepath1, filepath2)).toEqual(readFixture("expected_stylish.txt"));
  });
});

describe("genDiff errors", () => {
  test("throws when a file does not exist", () => {
    expect(() => genDiffFromFixtures("file1.json", "missing.json")).toThrow(/ENOENT/);
  });

  test("throws on an unsupported input file extension", () => {
    expect(() => genDiffFromFixtures("file1.json", "unsupported.ini")).toThrow(
      "Unknown data format: 'ini'",
    );
  });

  test.each([
    ["broken.json", SyntaxError],
    ["broken.yml", /unexpected end of the stream/],
  ])("throws on malformed input in %s", (filename, expectedError) => {
    expect(() => genDiffFromFixtures("file1.json", filename)).toThrow(expectedError);
  });

  test("throws on an unknown output format", () => {
    expect(() => genDiffFromFixtures("file1.json", "file2.json", "xml")).toThrow(
      "Unknown output format: 'xml'",
    );
  });
});
