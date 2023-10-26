import { Router } from 'express'
import Issuance from '../../models/dms/issuance'
// const axios = require('axios')
// require('dotenv').config()
export const dmsApi = Router()

const NAS_URL = 'http://192.168.1.20:5000'
const LOGIN_API = '/webapi/auth.cgi'

/**
 * GET /api/dms/index
 */
// dmsApi.get('/index', async (req, res) => {
//   try {
//     // const birds = await Dtr.earlybirds()
//     // requiring path and fs modules
//     const issuance = Issuance.create()

//     /* const path = require('path')
//     const fs = require('fs')
//     // joining path of directory
//     const directoryPath = path.join(__dirname, '../../models/dms/data/2019/so')
//     // passsing directoryPath and callback function
//     fs.readdir(directoryPath, function (err, files) {
//       // handling error
//       if (err) {
//         return console.log('Unable to scan directory: ' + err)
//       }
//       // listing all files using forEach
//       files.forEach(function (file) {
//         // Do whatever you want to do with the file

//         const code = file.split('2019_')
//         // console.log(code[0] + '2019')

//         const subject = code[1].split('.pdf')
//         const filename = code[1]

//         const stats = fs.statSync(directoryPath + '/' + code[0] + '2019_' + filename)
//         console.log(code[0] + '2019')
//         console.log(subject[0])
//         console.log(filename)

//         const d = new Date(stats.mtime)
//         console.log(d.getDate())

//         // Issuance.create('Special Order', code[0] + '2019', subject[0], filename, stats.mtime)
//       })
//     })
//     */

//     return res.json({
//       success: true,
//       message: 'Created',
//       data: issuance
//     })
//   } catch (error) {
//     return res.error(error)
//   }
// })

/**
 * GET /api/dms/create
 */
/* dmsApi.get('/logins', async (req, res) => {
  const NAS_URL = 'http://192.168.1.20:5000'
  const LOGIN_API = '/webapi/auth.cgi'
  const USERNAME = 'dost9ict'
  const PASSWORD = 'D057R3g10n9'

  try {
    const response = await axios.post(`${NAS_URL}${LOGIN_API}`, {
      params: {
        api: 'SYNO.API.Auth',
        version: 3,
        method: 'login',
        account: USERNAME,
        passwd: PASSWORD,
        session: 'FileStation',
        format: 'cookie'
      }
    })

    // return response.data

    return response.json({
      success: true,
      message: 'Logged in!'
    })
  } catch (error) {
    return res.error(error)
  }
}) */

/**
 * GET /api/dms/create
 */
dmsApi.get('/create', async (req, res) => {
  try {
    const issuance = await Issuance.addRecord()

    return res.json({
      success: true,
      message: 'Created!',
      data: issuance
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * GET /api/dms/login
 */
dmsApi.get('/login', async (req, res) => {
  const url = `${NAS_URL}${LOGIN_API}`
  const params = {
    api: 'SYNO.API.Auth',
    version: 3,
    method: 'login',
    account: 'dost9ict',
    passwd: 'D057R3g10n9',
    session: 'FileStation',
    format: 'cookie'
  }

  try {
    // Convert params object to a URLSearchParams object
    const urlParams = new URLSearchParams(params).toString()

    // Make the fetch call
    const response = await fetch(`${url}?${urlParams}`, {
      method: 'GET', // or 'PUT'
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!response.ok) {
      console.error('Error during login request:', response.status)
      return null
    }

    // Parse the JSON from the response
    const data = await response.json()

    if (data && data.success) {
      console.log('Successfully logged in')
      console.log(data)
      return data.data.sid // Assume sid is the session ID. Adjust as needed
    } else {
      console.error('Error logging in:', data)
      return null
    }
  } catch (error) {
    console.error('Network error during login request:', error)
    return null
  }
})
