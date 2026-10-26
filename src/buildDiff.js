import _ from "lodash";
import diffTypes from "./diffTypes.js";

const buildEntry = (key, data1, data2) => {
  if (!Object.hasOwn(data2, key)) {
    return { key, type: diffTypes.REMOVED, value: data1[key] };
  }
  if (!Object.hasOwn(data1, key)) {
    return { key, type: diffTypes.ADDED, value: data2[key] };
  }
  if (_.isEqual(data1[key], data2[key])) {
    return { key, type: diffTypes.UNCHANGED, value: data1[key] };
  }
  return { key, type: diffTypes.CHANGED, value1: data1[key], value2: data2[key] };
};

const buildDiff = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  return keys.map((key) => buildEntry(key, data1, data2));
};

export default buildDiff;
