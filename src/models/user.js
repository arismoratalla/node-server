import { Sequelize, Model } from 'sequelize'
import sequelize from '../utilities/mysqldb'

import { sign } from 'jsonwebtoken'
import password from '../utilities/password'

class User extends Model {
  // Instance Method
  instanceLevelMethod () {
    return 'This is an instance method'
  }

  static async login (email, rawPassword) {
    // Find user by email
    // const user = await this.findOne({ email }).select('+password').populate('profile') // mongoose

    const user = await User.findOne({
      where: { email },
      attributes: ['password']
      // include: ['Profile'] // Include association with 'Profile' model
    })

    // Check if user exist
    if (!user) {
      throw new Error('Email does not exist.')
    }
    console.log(password.hash(rawPassword))
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

User.init({
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'tbl_user', // Specifies the name of the actual database table
  timestamps: false, // If true, Sequelize will expect the created_at and updated_at fields to exist
  hooks: {
    beforeCreate: (user) => {
      user.password = password.hash(user.password)
    },
    beforeUpdate: (user) => {
      if (user.changed('password')) {
        user.password = password.hash(user.password)
      }
    }
  }
})

export default User
