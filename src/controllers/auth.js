import { Router } from 'express'
import { sign } from 'jsonwebtoken'
import { validate } from '../utilities/validate'
import User from '../models/user'

export const authApi = Router()
export const authUi = Router()

/**
 * Register API
 * POST /api/auth/register
 */
authApi.post('/register', async (req, res) => {
  try {
    // Validate POST data
    const data = await validate(
      // Data to validate
      req.body,
      // Rules
      {
        email: 'required|email',
        password: 'required|min:8|max:32',
        firstName: 'required',
        lastName: 'required',
        role: 'required|in:user,admin'
        // age: 'number'
      },
      // Custom error messages
      {
        'password.min': 'Password must be at least 8 characters long.',
        'password.max': 'Password must not be more than 32 characters long.',
        'email.required': 'Email is required.',
        'email.email': 'Invalid email address.'
      }
    )

    // Register user
    const user = await User.create(data)

    if (!user) {
      throw Error('Unable to register user. Please try again.')
    }

    // Generate access token
    const accessToken = sign(
      {
        id: user.id,
        role: user.role,
        hash: user.password
      },
      process.env.SECRET
    )

    // Exclude hashed password from user object
    delete user.password

    return res.json({
      success: true,
      message: 'User registered.',
      data: {
        ...user.toJSON(),
        accessToken
      }
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * Login API
 * POST /api/auth/login
 */
authApi.post('/login', async (req, res) => {
  try {
    const data = await validate(req.body, {
      email: 'required|email',
      password: 'required|min:8|max:32'
    })

    // Login user
    const user = await User.login(data.email, data.password)

    // Exclude hashed password from user object
    delete user.password

    return res.json({
      success: true,
      message: 'User logged in.',
      data: user
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * GET /api/auth/users
 */
authApi.get('/users', async (req, res) => {
  try {
    const data = await validate(req.body, {
      email: 'required|email',
      password: 'required|min:8|max:32'
    })

    // Login user
    const user = await User.login(data.email, data.password)

    // Exclude hashed password from user object
    delete user.password

    return res.json({
      success: true,
      message: 'User logged in.',
      data: user
    })
  } catch (error) {
    return res.error(error)
  }
})

authUi.get('/register', async (req, res) => {
  return res.render('layout/main', {
    message: 'Hello World! - controller'
  })
})
