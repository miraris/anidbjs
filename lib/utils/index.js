/**
 * Check whether a value is undefined or empty
 * @param {*} val
 */
const isNull = val => typeof val === 'undefined' || val == null

/**
 * Ensure the value is an array
 * @param {*} arr
 */
const ensureArray = arr => (Array.isArray(arr) ? arr : [arr])

/**
 * Try to parse an integer
 * @param {*} number
 */
const tryParseInt = number => {
  if (isNull(number)) return
  return parseInt(number, 10)
}

/**
 * Try to parse a float
 * @param {*} number
 */
const tryParseFloat = number => {
  if (isNull(number)) return
  return parseFloat(number, 10)
}

/**
 * Try to parse a boolean
 * @param {*} bool
 */
const tryParseBool = bool => {
  if (isNull(bool)) return
  return bool === 'true'
}

module.exports = {
  ensureArray,
  tryParseInt,
  tryParseFloat,
  tryParseBool
}
