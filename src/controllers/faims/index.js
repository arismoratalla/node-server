import { Router } from 'express'
import Request from '../../models/faims/request'
export const faimsApi = Router()

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
faimsApi.get('/create', async (req, res) => {
  try {
    const request = await Request.addRecord()

    return res.json({
      success: true,
      message: 'Created!',
      data: request
    })
  } catch (error) {
    return res.error(error)
  }
})
