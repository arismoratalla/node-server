import { Sequelize, Model } from 'sequelize'
import sequelize from '../../utilities/hrmisdb'

class Employee extends Model {
  static async getOne (employee_id) {
    const employee = await Employee.findOne({
      where: { employee_id },
      attributes: ['user_id', 'firstname', 'lastname']
    })

    // Check if employee exist
    if (!employee) {
      throw new Error('Employee not found.')
    } else {
      console.log('Success!!! Employee exists.')
    }

    return {
      ...employee.toJSON()
    }
  }
}

Employee.init({
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Employee',
  tableName: 'profiles', // Specifies the name of the actual database table
  timestamps: false // If true, Sequelize will expect the created_at and updated_at fields to exist
})

export default Employee
