import { Sequelize, Model } from 'sequelize'
import sequelize from '../../utilities/faimsdb'

import Payee from './payee'

class Request extends Model {
  static associate () {
    this.belongsTo(Payee, { foreignKey: 'payee_id', as: 'payee' })
  }

  static async index () {
    try {
      const requests = await Request.findAll({
        attributes: ['request_id', 'request_number', 'request_date', 'particulars', 'payee_id', 'amount'],
        include: [{
          model: Payee,
          attributes: ['creditor_id', 'creditor_type_id', 'name'],
          as: 'payee'
        }],
        order: [['request_id', 'DESC']]
      })

      if (!requests || requests.length === 0) {
        console.log('No requests data found.')
        return Promise.reject(new Error('No data.'))
      } else {
        console.log('Fetched early birds')
        return requests
      }
    } catch (error) {
      console.error(`Error in index: ${error}`)
      return Promise.reject(error)
    }
  }
}

Request.init({
  request_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  request_number: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  request_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  division_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  request_type_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  obligation_type_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  project_type_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: 0
  },
  project_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  payee_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  particulars: {
    type: Sequelize.STRING,
    allowNull: false
  }
//   amount: {
//     type: Sequelize.DECIMAL(11, 2),
//     allowNull: true
//   },
//   status_id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     default: 10
//   },
//   district_id: {
//     type: Sequelize.INTEGER,
//     allowNull: true
//   },
//   created_by: {
//     type: Sequelize.INTEGER,
//     allowNull: false
//   },
//   payroll: {
//     type: Sequelize.BOOLEAN,
//     allowNull: false,
//     default: false
//   },
//   purchasse_order_id: {
//     type: Sequelize.INTEGER,
//     allowNull: true,
//     default: 0
//   },
//   cancelled: {
//     type: Sequelize.BOOLEAN,
//     allowNull: false,
//     default: false
//   },
//   remarks_id: {
//     type: Sequelize.STRING,
//     allowNull: true
//   },
//   override: {
//     type: Sequelize.BOOLEAN,
//     allowNull: true,
//     default: false
//   },
//   override_reason: {
//     type: Sequelize.STRING,
//     allowNull: true
//   },
//   synced: {
//     type: Sequelize.BOOLEAN,
//     allowNull: true,
//     default: false
//   }
}, {
  sequelize,
  modelName: 'Request',
  tableName: 'tbl_request', // Specifies the name of the actual database table
  timestamps: false // If true, Sequelize will expect the created_at and updated_at fields to exist
})

Request.associate()

export default Request
