import fs from "node:fs";
import path from "node:path";
import parse from "./parsers.js";
import buildDiff from "./buildDiff.js";
import format from "./formatters/index.js";

const getDataType = (filepath) => path.extname(filepath).slice(1).toLowerCase();

const readData = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const content = fs.readFileSync(absolutePath, "utf-8");
  return parse(content, getDataType(absolutePath));
};

const genDiff = (filepath1, filepath2, formatName = "stylish") => {
  const data1 = readData(filepath1);
  const data2 = readData(filepath2);
  const diff = buildDiff(data1, data2);
  return format(diff, formatName);
};

export default genDiff;
