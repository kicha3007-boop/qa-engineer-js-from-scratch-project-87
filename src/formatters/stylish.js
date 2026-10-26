import diffTypes from "../diffTypes.js";

const stringify = (value) => String(value);

const formatLine = (sign, key, value) => `  ${sign} ${key}: ${stringify(value)}`;

const formatEntry = (entry) => {
  switch (entry.type) {
    case diffTypes.ADDED:
      return [formatLine("+", entry.key, entry.value)];
    case diffTypes.REMOVED:
      return [formatLine("-", entry.key, entry.value)];
    case diffTypes.UNCHANGED:
      return [formatLine(" ", entry.key, entry.value)];
    case diffTypes.CHANGED:
      return [formatLine("-", entry.key, entry.value1), formatLine("+", entry.key, entry.value2)];
    default:
      throw new Error(`Unknown diff type: '${entry.type}'`);
  }
};

const formatStylish = (diff) => ["{", ...diff.flatMap(formatEntry), "}"].join("\n");

export default formatStylish;
