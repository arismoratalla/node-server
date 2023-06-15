import indicative from 'indicative'

/**
 * Validate object one-by-one
 * @param {Object} data Object to be validated
 * @param {Object} rules Indicative specific rules
 * @param {Object} messages Indicative custom messages
 * @returns {Object} Returns an object containing the validated data
 */
export async function validate (data, rules, messages) {
  try {
    return await indicative.validate(...arguments)
  } catch (error) {
    throw error[0]
  }
}

/**
 * Validate object as a whole
 * @param {Object} data Object to be validated
 * @param {Object} rules Indicative specific rules
 * @param {Object} messages Indicative custom messages
 * @returns {Object} Returns an object containing the validated data
 */
export async function validateAll (data, rules, messages) {
  return await indicative.validateAll(...arguments)
}
