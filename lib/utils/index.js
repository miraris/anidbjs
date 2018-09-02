/**
 * Ensure the value is an array
 * @param {*} arr
 */
const ensureArray = arr => (Array.isArray(arr) ? arr : [arr])

/**
 * Try to parse an integer
 * @param {*} number
 */
const tryParseInt = number => (number ? parseInt(number, 10) : undefined)

/**
 * Try to parse a float
 * @param {*} number
 */
const tryParseFloat = number => (number ? parseFloat(number, 10) : undefined)

/**
 * Try to parse a boolean
 * @param {*} bool
 */
const tryParseBool = bool => bool === 'true'

module.exports = {
  ensureArray,
  tryParseInt,
  tryParseFloat,
  tryParseBool
}
