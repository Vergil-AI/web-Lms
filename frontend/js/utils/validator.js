// validator.js

export function isMatch(output, expected, options = { strict: false }) {
  if (typeof expected === "string") {
    return compareStrings(output, expected, options.strict);
  }

  if (Array.isArray(expected)) {
    return compareArrays(output, expected, options.strict);
  }

  if (typeof expected === "object") {
    return compareJSON(output, expected);
  }

  return false;
}

// String comparison
function compareStrings(actual, expected, strict = false) {
  if (!strict) {
    return actual.trim().toLowerCase() === expected.trim().toLowerCase();
  }
  return actual.trim() === expected.trim();
}

// Multiline array comparison
function compareArrays(actualOutput, expectedLines, strict = false) {
  const lines = actualOutput.trim().split("\n").map(line => line.trim());
  if (lines.length !== expectedLines.length) return false;

  return lines.every((line, i) => compareStrings(line, expectedLines[i], strict));
}

// JSON object comparison
function compareJSON(output, expectedObj) {
  try {
    const parsed = JSON.parse(output);
    return JSON.stringify(parsed) === JSON.stringify(expectedObj);
  } catch (e) {
    return false;
  }
}
