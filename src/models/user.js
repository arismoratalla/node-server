import { sign } from 'jsonwebtoken'
import { Schema, SchemaTypes, model } from 'mongoose'
import password from '../utilities/password'

/**
 * User Schema
 */
const userSchema = new Schema(
  // Schema Definition
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        validator: v => /^\S+@\S+\.\S+$/.test(v),
        message: () => 'Invalid email address.'
      }
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    address: {
      line1: {
        type: String
      },
      line2: {
        type: String
      }
    },
    favoriteColors: [
      {
        colorName: {
          type: String
        }
      }
    ],
    profile: {
      type: SchemaTypes.ObjectId,
      ref: 'Profile'
    },
    friends: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'Profile'
      }
    ]
  },
  // Schema Options
  {
    timestamps: true,
    versionKey: false
  }
)

// Pre-save middleware: Hash password if modified
userSchema.post('save', function (next) {
  if (this.isModified('password')) {
    this.password = password.hash(this.password)
  }

  return next()
})

/**
 * User Methods
 */
class UserMethods {
  /**
   * Login user
   * @param {String} email User email
   * @param {String} password User password
   */
  static async login (email, rawPassword) {
    // Find user by email
    const user = await this.findOne({ email }).select('+password').populate('profile')

    // Check if user exist
    if (!user) {
      throw new Error('Email does not exist.')
    }

    // Check if password is incorrect
    if (rawPassword && user.password !== password.hash(rawPassword)) {
      throw new Error('Incorrect password.')
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

    return {
      ...user.toJSON(),
      accessToken
    }
  }
}

userSchema.loadClass(UserMethods)

/**
 * User Model
 */
const User = model('User', userSchema)

export default User
