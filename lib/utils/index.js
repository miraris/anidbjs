/**
 * Ensure the value is an array
 * @param {*} arr
 */
const ensureArray = arr => (Array.isArray(arr) ? arr : [arr]);

/**
 * Try to parse an integer
 * @param {*} number
 */
// const tryParseInt = num => num | 0
const tryParseInt = num => (num === 0 || num ? parseInt(num, 10) : undefined);

/**
 * Try to parse a float
 * @param {*} number
 */
const tryParseFloat = num => (num === 0 || num ? parseFloat(num, 10) : undefined);

/**
 * Try to parse a boolean
 * @param {*} bool
 */
const tryParseBool = bool => bool === 'true';

/**
 * Checks whether the object returned by xml2js is valid (for our purposes)
 * @param {object} obj
 */
const isValid = (obj) => {
  if (!obj) return false;

  const keys = Object.keys(obj).length;
  const attrKey = Object.prototype.hasOwnProperty.call(obj, '$');

  return (attrKey && keys > 1) || (!attrKey && keys > 0);
};

/**
 * Map an array
 * @param {*} obj - object to map
 * @param {Function} method mapping method
 */
const mapArray = (obj, prop, method) => (isValid(obj) ? ensureArray(obj[prop]).map(method) : []);

module.exports = {
  ensureArray,
  tryParseInt,
  tryParseFloat,
  tryParseBool,
  isValid,
  mapArray,
};
