import { createHmac } from 'crypto'

/**
 * Hash given password
 * @param {String} rawPassword Given password
 * @returns Hashed password
 */
function hash (rawPassword) {
  return createHmac('sha256', process.env.SECRET).update(rawPassword).digest('hex')
}

/**
 * Validate given password
 * @param {String} rawPassword Given password
 * @returns Returns `true` is password is valid, otherwise `false`
 */
function validate (rawPassword) {
  // Reference: https://stackoverflow.com/questions/14850553/javascript-regex-for-password-containing-at-least-8-characters-1-number-1-uppe#comment51374524_14850765
  const validator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  return validator.test(rawPassword)
}

export default { hash, validate }
