/**
 * Ensure the value is an array
 * @param {*} arr
 */
const ensureArray = arr => (Array.isArray(arr) ? arr : [arr])

/**
 * Try to parse an integer
 * @param {*} number
 */
// const tryParseInt = num => num | 0
const tryParseInt = num =>
  num === 0 || num ? parseInt(num, 10) : undefined

/**
 * Try to parse a float
 * @param {*} number
 */
const tryParseFloat = num =>
  num === 0 || num ? parseFloat(num, 10) : undefined

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
