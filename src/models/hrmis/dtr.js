import { Sequelize, Model } from 'sequelize'
import sequelize from '../../utilities/hrmisdb'
import Employee from './employee'

class Dtr extends Model {
  static async index () {
    const dtrs = await Dtr.findAll({
      attributes: ['user_id', 'date', 'inAM', 'outAM', 'inPM', 'outPM'],
      include: Employee // also works
    })

    // Check if dtrs exist
    if (!dtrs) {
      throw new Error('No data.')
    } else {
      console.log('Success')
    }

    return JSON.stringify(dtrs)
    // return {
    //   ...dtrs.toJSON()
    // }
  }

  static async timeInAM (user_id, fullname) {
    const today = new Date().toJSON().slice(0, 10)
    const timestamp = Math.floor(Date.now() / 1000)
    // console.log(timestamp)
    const [dtr, created] = await Dtr.findOrCreate({
      where: {
        user_id,
        date: today
      },
      include: [Employee],
      defaults: {
        user_id,
        date: today,
        inAM: timestamp,
        outAM: null,
        inPM: null,
        outPM: null,
        inOT: null,
        outOT: null,
        remarks: fullname,
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
    const today = new Date().toJSON().slice(0, 10)
    const timestamp = Math.floor(Date.now() / 1000)
    const dtr = await Dtr.findOne({
      where: {
        user_id,
        date: today
      }
      // include: [Employee]
    })

    if (!dtr) {
      const dtr = await Dtr.create({
        user_id,
        date: today,
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
    const today = new Date().toJSON().slice(0, 10)
    const timestamp = Math.floor(Date.now() / 1000)
    const dtr = await Dtr.findOne({
      where: {
        user_id,
        date: today
      }
    })

    if (!dtr) {
      const dtr = await Dtr.create({
        user_id,
        date: today,
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
    const today = new Date().toJSON().slice(0, 10)
    const timestamp = Math.floor(Date.now() / 1000)
    const dtr = await Dtr.findOne({
      where: {
        user_id,
        date: today
      }
    })

    if (!dtr) {
      const dtr = await Dtr.create({
        user_id,
        date: today,
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
