import yaml from "js-yaml";

const parsers = {
  json: JSON.parse,
  yml: yaml.load,
  yaml: yaml.load,
};

const parse = (content, dataType) => {
  const parseContent = parsers[dataType];
  if (!parseContent) {
    throw new Error(`Unknown data format: '${dataType}'`);
  }
  return parseContent(content);
};

export default parse;
