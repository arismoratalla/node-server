import { Sequelize, Model } from 'sequelize'
import sequelize from '../../utilities/dmsdb'

class Issuance extends Model {
  // type, issuance_code, issuance_subject, issuance_file, issuance_date
  static async addRecord (type, issuance_code, issuance_subject, issuance_file, issuance_date) {
    const [issuance, created] = await Issuance.findOrCreate({
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
      return issuance
    } else {
      console.log('Not created. Record already exist.')
    }
  }
}

Issuance.init({
  issuance_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  issuance_type_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  code: {
    type: Sequelize.STRING,
    allowNull: true
  },
  subject: {
    type: Sequelize.STRING,
    allowNull: true
  },
  file: {
    type: Sequelize.STRING,
    allowNull: true
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Issuance',
  tableName: 'tbl_issuance', // Specifies the name of the actual database table
  timestamps: false // If true, Sequelize will expect the created_at and updated_at fields to exist
})

export default Issuance
