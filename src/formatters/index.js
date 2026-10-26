import formatStylish from "./stylish.js";
import formatPlain from "./plain.js";
import formatJson from "./json.js";

const formatters = {
  stylish: formatStylish,
  plain: formatPlain,
  json: formatJson,
};

const format = (diff, formatName) => {
  const formatDiff = formatters[formatName];
  if (!formatDiff) {
    throw new Error(`Unknown output format: '${formatName}'`);
  }
  return formatDiff(diff);
};

export default format;
