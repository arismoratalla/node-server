import { Sequelize, Model } from 'sequelize'
import sequelize from '../../utilities/faimsdb'

import Request from './request'

class RequestAttachment extends Model {
  static associate () {
    this.belongsTo(Request, { foreignKey: 'request_id', as: 'request' })
  }

  static async index () {
    try {
      const requestattachments = await RequestAttachment.findAll({
        attributes: [
          'request_attachment_id',
          'request_id',
          'filename',
          'filecode',
          'status_id',
          'attachment_id',
          'require_signed',
          'optional',
          'original_doc_status_id',
          'last_update'
        ],
        order: [['request_attachment_id', 'DESC']]
      })

      if (!requestattachments || requestattachments.length === 0) {
        console.log('No requests data found.')
        return Promise.reject(new Error('No data.'))
      } else {
        return requestattachments
      }
    } catch (error) {
    //   console.error('Error in index: ${error}')
      return Promise.reject(error)
    }
  }
}

RequestAttachment.init({
  request_attachment_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  request_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  attachment_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  required_signed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: 0
  },
  optional: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  original_doc_status_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  last_update: {
    type: Sequelize.DATEONLY,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'RequestAttachment',
  tableName: 'tbl_request_attachment', // Specifies the name of the actual database table
  timestamps: false // If true, Sequelize will expect the created_at and updated_at fields to exist
})

export default RequestAttachment
