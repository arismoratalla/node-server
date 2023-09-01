import { Sequelize, Model, Op } from 'sequelize'
import sequelize from '../../utilities/hrmisdb'
import Employee from './employee'

const date = new Date()
const year = date.getFullYear()
const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
const day = String(date.getDate()).padStart(2, '0')

const thisDay = `${year}-${month}-${day}`

class Dtr extends Model {
  static async earlybirds () {
    // Get the current date and time in GMT+8
    let current_date = new Date()
    const offset = current_date.getTimezoneOffset() + (8 * 60) // Offset in minutes for GMT+8
    current_date = new Date(current_date.getTime() + (offset * 60 * 1000))
    current_date.setHours(0, 0, 0, 0) // Reset the time part to get start of the day in GMT+8

    let target_time = new Date(current_date) // Create a date object for the target
    target_time.setHours(8, 1, 0, 0) // Set the time to 8:01
    target_time = target_time.getTime() / 1000
    // console.log(target_time)

    const earlybirds = await Dtr.findAll({
      where: {
        date: thisDay,
        remarks: null,
        inAM: {
          [Op.ne]: null, // Has Time In
          [Op.lt]: target_time // Less than 8:01 AM
        }
      },
      attributes: ['user_id', 'date', 'inAM', 'outAM', 'inPM', 'outPM', 'fullname'],
      include: [{
        model: Employee,
        attributes: ['firstname', 'lastname']
      }],
      order: [['inAM', 'ASC']]
    })

    // Check if dtrs exist
    if (!earlybirds) {
      throw new Error('No data.')
    } else {
      console.log('Fetched early birds')
      return earlybirds
    }
  }

  static async nightowls () {
    // Get the current date and time in GMT+8
    let current_date = new Date()
    const offset = current_date.getTimezoneOffset() + (8 * 60) // Offset in minutes for GMT+8
    current_date = new Date(current_date.getTime() + (offset * 60 * 1000))
    current_date.setHours(0, 0, 0, 0) // Reset the time part to get start of the day in GMT+8

    let target_time = new Date(current_date) // Create a date object for the target
    target_time.setHours(8, 1, 0, 0) // Set the time to 8:00
    target_time = target_time.getTime() / 1000

    const nightowls = await Dtr.findAll({
      where: {
        date: thisDay,
        remarks: null,
        [Op.or]: [
          {
            inAM: {
              // [Op.ne]: null, // Has Time In
              [Op.gt]: target_time // Greater than 8:00 AM
            }
          },
          {
            inAM: {
              [Op.is]: null // Has Time In
            },
            outAM: {
              [Op.ne]: null
            }
          }
        ]
        // inAM: {
        //   // [Op.ne]: null, // Has Time In
        //   [Op.gt]: target_time // Greater than 8:00 AM
        // }
        // outAM: {
        //   [Op.ne]: null
        // }
      },
      attributes: ['user_id', 'date', 'inAM', 'outAM', 'inPM', 'outPM'],
      include: Employee,
      order: [['inAM', 'ASC']]
    })

    // Check if dtrs exist
    if (!nightowls) {
      throw new Error('No data.')
    } else {
      console.log('Fetched night owls')
      return nightowls
    }
  }

  static async timeInAM (user_id, fullname) {
    // const today = new Date().toJSON().slice(0, 10)
    const timestamp = Math.floor(Date.now() / 1000)
    // console.log(timestamp)
    const [dtr, created] = await Dtr.findOrCreate({
      where: {
        user_id,
        date: thisDay
      },
      include: [Employee],
      defaults: {
        user_id,
        date: thisDay,
        inAM: timestamp,
        outAM: null,
        inPM: null,
        outPM: null,
        inOT: null,
        outOT: null,
        remarks: null,
        ip: '127.0.0.1'
      }
    })

    if (!created) {
      console.log('No DTR log.')
    } else {
      // console.log(dtr.inAM)
      return dtr
    }
  }

  static async timeOutAM (user_id, log_type) {
    // const today = new Date().toJSON().slice(0, 10)
    const timestamp = Math.floor(Date.now() / 1000)
    const dtr = await Dtr.findOne({
      where: {
        user_id,
        date: thisDay
      }
      // include: [Employee]
    })

    if (!dtr) {
      const dtr = await Dtr.create({
        user_id,
        date: thisDay,
        inAM: null,
        outAM: timestamp,
        inPM: null,
        outPM: null,
        inOT: null,
        outOT: null,
        remarks: null,
        ip: '127.0.0.1',
        fullname: 'Jin Kazama'
      })

      return dtr
    } else {
      dtr.outAM = timestamp
      dtr.save()
      return dtr
    }
  }

  static async timeInPM (user_id, log_type) {
    // const today = new Date().toJSON().slice(0, 10)
    const timestamp = Math.floor(Date.now() / 1000)
    const dtr = await Dtr.findOne({
      where: {
        user_id,
        date: thisDay
      }
    })

    if (!dtr) {
      const dtr = await Dtr.create({
        user_id,
        date: thisDay,
        inAM: null,
        outAM: null,
        inPM: timestamp,
        outPM: null,
        inOT: null,
        outOT: null,
        remarks: null,
        ip: '127.0.0.1'
      })

      return dtr
    } else {
      dtr.inPM = timestamp
      dtr.save()
      return dtr
    }
  }

  static async timeOutPM (user_id, log_type) {
    // const today = new Date().toJSON().slice(0, 10)
    const timestamp = Math.floor(Date.now() / 1000)
    const dtr = await Dtr.findOne({
      where: {
        user_id,
        date: thisDay
      }
    })

    if (!dtr) {
      const dtr = await Dtr.create({
        user_id,
        date: thisDay,
        inAM: null,
        outAM: null,
        inPM: null,
        outPM: timestamp,
        inOT: null,
        outOT: null,
        remarks: null,
        ip: '127.0.0.1'
      })

      return dtr
    } else {
      dtr.outPM = timestamp
      dtr.save()
      return dtr
    }
  }
}

Dtr.init({
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  inAM: {
    type: Sequelize.STRING,
    allowNull: true
  },
  outAM: {
    type: Sequelize.STRING,
    allowNull: true
  },
  inPM: {
    type: Sequelize.STRING,
    allowNull: true
  },
  outPM: {
    type: Sequelize.STRING,
    allowNull: true
  },
  inOT: {
    type: Sequelize.STRING,
    allowNull: true
  },
  outOT: {
    type: Sequelize.STRING,
    allowNull: true
  },
  remarks: {
    type: Sequelize.STRING,
    allowNull: true
  },
  fullname: {
    type: Sequelize.VIRTUAL
  },
  ip: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Dtr',
  tableName: 'dtr', // Specifies the name of the actual database table
  timestamps: false // If true, Sequelize will expect the created_at and updated_at fields to exist
})

Dtr.hasOne(Employee, { foreignKey: 'user_id' })

export default Dtr
