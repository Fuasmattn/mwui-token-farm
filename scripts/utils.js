/* eslint-disable no-multi-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

function deepen(obj) {
  const result = {};

  // For each object path (property key) in the object
  for (const objectPath in obj) {
    // Split path into component parts
    const parts = objectPath.split('.');

    // Create sub-objects along path as needed
    let target = result;
    while (parts.length > 1) {
      const part = parts.shift();
      target = target[part] = target[part] || {};
    }

    // Set value at end of path
    target[parts[0]] = obj[objectPath];
  }
  return result;
}

function createArray({ dictionary }) {
  const arr = dictionary.allTokens;
  return JSON.stringify(arr);
}

function isReference(value) {
  return value && value.substr(0, 1) === '$';
}

function getReferenceValue(tokens, value) {
  const parts = value.substr(1, value.length - 1).split('.');

  // support references starting with or without category
  // (e.g. $colors.magenta.500 and $magenta.500)
  const { category } = tokens[0].attributes;
  if (!parts.includes(category)) {
    parts.push(category);
  }
  const res = tokens.find(
    (t) => t.path.sort().toString() === parts.sort().toString(),
  );
  const v = typeof res === 'object' ? res.value : res;
  return isReference(v) ? getReferenceValue(tokens, v) : v;
}

function filterTokensByType(type, tokens) {
  const obj = tokens.reduce((acc, cur) => {
    if (cur.type === type) {
      const value = isReference(cur.value) ? getReferenceValue(tokens, cur.value) : cur.value;
      acc[cur.path.join('.')] = `var(--${cur.name}, ${value})`;
    }
    return acc;
  }, {});

  const deep = deepen(obj);
  return deep;
}

module.exports = { createArray, filterTokensByType };
