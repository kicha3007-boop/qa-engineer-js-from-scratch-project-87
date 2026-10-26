import diffTypes from "../diffTypes.js";

const stringify = (value) => (typeof value === "string" ? `'${value}'` : String(value));

const formatEntry = (entry) => {
  const property = `Property '${entry.key}'`;
  switch (entry.type) {
    case diffTypes.ADDED:
      return [`${property} was added with value: ${stringify(entry.value)}`];
    case diffTypes.REMOVED:
      return [`${property} was removed`];
    case diffTypes.CHANGED:
      return [
        `${property} was updated. From ${stringify(entry.value1)} to ${stringify(entry.value2)}`,
      ];
    case diffTypes.UNCHANGED:
      return [];
    default:
      throw new Error(`Unknown diff type: '${entry.type}'`);
  }
};

const formatPlain = (diff) => diff.flatMap(formatEntry).join("\n");

export default formatPlain;
