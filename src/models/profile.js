import { Sequelize, Model } from 'sequelize'
import sequelize from '../utilities/mysqldb'

// import User from './user'

class Profile extends Model {}

Profile.init({
  profile_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'User', // This is a reference to another model
      key: 'user_id' // This is the column name of the referenced model
    }
  },
  fullname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  access: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Profile',
  tableName: 'tbl_profile', // Specifies the name of the actual database table
  timestamps: false // If true, Sequelize will expect the created_at and updated_at fields to exist
})

export default Profile
