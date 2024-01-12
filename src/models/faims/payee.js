import { Sequelize, Model } from 'sequelize'
import sequelize from '../../utilities/faimsdb'

class Payee extends Model {
  // type, issuance_code, issuance_subject, issuance_file, issuance_date
  /* static async addRecord (type, issuance_code, issuance_subject, issuance_file, issuance_date) {
    const [request, created] = await Request.findOrCreate({
      where: {
        issuance_type_id: type,
        code: issuance_code,
        subject: issuance_subject
      },
      defaults: {
        issuance_id: '',
        issuance_type_id: type,
        code: issuance_code,
        subject: issuance_subject,
        file: issuance_file,
        date: issuance_date
      }
    })

    if (created) { // if the user was created
      return request
    } else {
      console.log('Not created. Record already exist.')
    }
  } */

  static async index () {
    try {
      const payees = await Payee.findAll({
        attributes: ['creditor_id', 'creditor_type_id', 'name', 'address', 'bank_name', 'account_number', 'tin_number', 'payroll', 'tagged', 'active']
        // include: [{
        //   model: Payee,
        //   attributes: ['firstname', 'lastname']
        // }],
        // order: [['request_id', 'DESC']]
      })

      if (!payees || payees.length === 0) {
        console.log('No requests data found.')
        return Promise.reject(new Error('No data.'))
      } else {
        console.log('Fetched early birds')
        return payees
      }
    } catch (error) {
      console.error(`Error in index: ${error}`)
      return Promise.reject(error)
    }
  }
}

Payee.init({
  creditor_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  creditor_type_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true
  },
  bank_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  account_number: {
    type: Sequelize.STRING,
    allowNull: true
  },
  tin_number: {
    type: Sequelize.STRING,
    allowNull: true
  },
  payroll: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: 0
  },
  tagged: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: 0
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: 1
  }
}, {
  sequelize,
  modelName: 'Payee',
  tableName: 'tbl_creditor', // Specifies the name of the actual database table
  timestamps: false // If true, Sequelize will expect the created_at and updated_at fields to exist
})

export default Payee
