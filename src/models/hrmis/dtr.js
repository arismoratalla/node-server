import { Sequelize, Model, Op } from 'sequelize'
import sequelize from '../../utilities/hrmisdb'
import Employee from './employee'

const date = new Date()
const year = date.getFullYear()
const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
const day = String(date.getDate()).padStart(2, '0')

const thisDay = `${year}-${month}-${day}`

class Dtr extends Model {
  static getDate () {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  /*  static async earlybirds () {
    // Get the current date and time in GMT+8
    let current_date = new Date()
    const offset = current_date.getTimezoneOffset() + (8 * 60) // Offset in minutes for GMT+8
    current_date = new Date(current_date.getTime() + (offset * 60 * 1000))
    current_date.setHours(0, 0, 0, 0) // Reset the time part to get start of the day in GMT+8

    let target_time = new Date(current_date) // Create a date object for the target
    target_time.setHours(8, 1, 0, 0) // Set the time to 8:01
    target_time = target_time.getTime() / 1000

    const earlybirds = await Dtr.findAll({
      where: {
        date: this.getDate(),
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
  } */

  static async earlybirds (date = null) {
    try {
      // Get the current date and time in GMT+8
      let targetDate

      if (date) {
        targetDate = new Date(date)
      } else {
        // Get the current date and time in GMT+8 if date is not passed in
        targetDate = new Date()
        const offset = targetDate.getTimezoneOffset() + (8 * 60) // Offset in minutes for GMT+8
        targetDate = new Date(targetDate.getTime() + (offset * 60 * 1000))
      }

      let target_time = new Date(targetDate) // Create a date object for the target
      target_time.setHours(8, 1, 0, 0) // Set the time to 8:01
      target_time = target_time.getTime() / 1000

      const earlybirds = await Dtr.findAll({
        where: {
          date: date || this.getDate(),
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
      if (!earlybirds || earlybirds.length === 0) {
        console.log('No earlybirds data found.')
        return Promise.reject(new Error('No data.'))
      } else {
        console.log('Fetched early birds')
        return earlybirds
      }
    } catch (error) {
      console.error(`Error in earlybirds: ${error}`)
      return Promise.reject(error)
    }
  }

  static async nightowls (date = null) {
    // Get the current date and time in GMT+8
    let targetDate

    if (date) {
      targetDate = new Date(date)
    } else {
      // Get the current date and time in GMT+8 if date is not passed in
      targetDate = new Date()
      const offset = targetDate.getTimezoneOffset() + (8 * 60) // Offset in minutes for GMT+8
      targetDate = new Date(targetDate.getTime() + (offset * 60 * 1000))
    }

    let target_time = new Date(targetDate) // Create a date object for the target
    target_time.setHours(8, 1, 0, 0) // Set the time to 8:00
    target_time = target_time.getTime() / 1000

    const nightowls = await Dtr.findAll({
      where: {
        date: date || this.getDate(),
        remarks: null,
        [Op.or]: [
          {
            inAM: {
              [Op.ne]: null, // Has Time In
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

  static async timeInAM (user_id) {
    const timestamp = Math.floor(Date.now() / 1000)
    const [dtr, created] = await Dtr.findOrCreate({
      where: {
        user_id,
        date: this.getDate()
      },
      include: [Employee],
      defaults: {
        user_id,
        date: this.getDate(),
        inAM: timestamp,
        outAM: null,
        inPM: null,
        outPM: null,
        inOT: null,
        outOT: null,
        remarks: 'API',
        ip: '127.0.0.1'
      }
    })

    if (created) {
      console.log('Logged Time In.')
    } else {
      if (dtr.inAM) {
        console.log(`Employee with ID ${user_id} has already timed in at ${dtr.inAM}.`)
        // You can choose to throw an error or return a message
        return { message: `Already timed in @ ${dtr.inAM}`, status: 'error' }
      } else {
        // If not, update the time-in
        dtr.inAM = timestamp
        await dtr.save()
        console.log('Updated Time In.')
      }
    }

    // Fetch the employee details
    const employee = await Employee.findByPk(user_id)
    if (employee) {
      return {
        status: 'success',
        fullname: employee.firstname + ' ' + employee.lastname,
        message: 'Timein(AM) Successful for ' + employee.firstname + ' ' + employee.lastname
      }
    }
  }

  static async timeOutAM (user_id) {
    const timestamp = Math.floor(Date.now() / 1000)

    // Find the DTR record for today
    const dtr = await Dtr.findOne({
      where: { user_id, date: this.getDate() }
    })

    // If the DTR record doesn't exist, create a new one
    if (!dtr) {
      await Dtr.create({
        user_id,
        date: this.getDate(),
        inAM: null,
        outAM: timestamp,
        inPM: null,
        outPM: null,
        inOT: null,
        outOT: null,
        remarks: 'API',
        ip: '127.0.0.1'
      })
      console.log('Logged Time Out for a new record.')
    } else {
      // If the employee has already timed out for AM
      if (dtr.outAM) {
        // console.log(`Employee with ID ${user_id} has already timed out at ${dtr.outAM}.`)
        return { message: `Already timed out @ ${dtr.outAM}`, status: 'error' }
      } else {
        dtr.outAM = timestamp
        await dtr.save()
        // console.log('Logged Time Out.')
      }
    }

    // Fetch the employee details
    const employee = await Employee.findByPk(user_id)
    if (employee) {
      return {
        status: 'success',
        fullname: employee.firstname + ' ' + employee.lastname,
        message: 'Timeout(AM) Successful for ' + employee.firstname + ' ' + employee.lastname
      }
    }
  }

  static async timeInPM (user_id) {
    const timestamp = Math.floor(Date.now() / 1000)
    // Find the DTR record for today
    const dtr = await Dtr.findOne({
      where: { user_id, date: this.getDate() }
    })

    // If the DTR record doesn't exist, create a new one
    if (!dtr) {
      await Dtr.create({
        user_id,
        date: this.getDate(),
        inAM: null,
        outAM: null,
        inPM: timestamp,
        outPM: null,
        inOT: null,
        outOT: null,
        remarks: 'API',
        ip: '127.0.0.1'
      })
      console.log('Logged Time In for a new record.')
    } else {
      // If the employee has already timed out for AM
      if (dtr.inPM) {
        // console.log(`Employee with ID ${user_id} has already timed out at ${dtr.outAM}.`)
        return { message: `Already timed out @ ${dtr.inPM}`, status: 'error' }
      } else {
        dtr.inPM = timestamp
        await dtr.save()
        // console.log('Logged Time Out.')
      }
    }

    // Fetch the employee details
    const employee = await Employee.findByPk(user_id)
    if (employee) {
      return {
        status: 'success',
        fullname: employee.firstname + ' ' + employee.lastname,
        message: 'Timein(PM) Successful for ' + employee.firstname + ' ' + employee.lastname
      }
    }
  }

  static async timeOutPM (user_id) {
    // const today = new Date().toJSON().slice(0, 10)
    const timestamp = Math.floor(Date.now() / 1000)
    const dtr = await Dtr.findOne({
      where: {
        user_id,
        date: this.getDate()
      }
    })

    if (!dtr) {
      await Dtr.create({
        user_id,
        date: this.getDate(),
        inAM: null,
        outAM: null,
        inPM: null,
        outPM: timestamp,
        inOT: null,
        outOT: null,
        remarks: 'API',
        ip: '127.0.0.1'
      })
      console.log('Logged Time In for a new record.')
    } else {
      // If the employee has already timed out for AM
      if (dtr.outPM) {
        // console.log(`Employee with ID ${user_id} has already timed out at ${dtr.outAM}.`)
        return { message: `Already timed out @ ${dtr.outPM}`, status: 'error' }
      } else {
        dtr.outPM = timestamp
        await dtr.save()
        // console.log('Logged Time Out.')
      }
    }

    // Fetch the employee details
    const employee = await Employee.findByPk(user_id)
    if (employee) {
      return {
        status: 'success',
        fullname: employee.firstname + ' ' + employee.lastname,
        message: 'Timeout(PM) Successful for ' + employee.firstname + ' ' + employee.lastname
      }
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
