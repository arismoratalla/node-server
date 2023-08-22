import { Router } from 'express'
import Issuance from '../models/dms/issuance'
export const dmsApi = Router()

const path = require('path')
const fs = require('fs')
const issuances = []

/**
 * GET /api/dms/create
 */
dmsApi.get('/import', async (req, res) => {
  try {
    // joining path of directory
    const year = 2023
    const directoryPath = path.join(__dirname, '../models/dms/data/so/' + year)
    // passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
      // handling error
      if (err) {
        return console.log('Unable to scan directory: ' + err)
      }
      // listing all files using forEach
      files.forEach(function (file) {
        /** Memo data insert : Start **/
        // const code = file.split('_')
        // const subject = code[1].split('.pdf')

        /** Split texts
        /* 2013 - "_"
        /* 2014 - ". "
        /* 2014 - ". " **/

        /* Use if single occurence of split text */
        // const code = file.split('. ')

        // let code
        // try {
        //   code = file.split('. ')
        //   if (code.length < 2) {
        //     throw new Error("Unexpected file format. Expected 'code. subject.extension' format.")
        //   }
        // } catch (error) {
        //   console.error(`Error processing file "${file}": ${error.message}`)
        //   return // Skip processing this file and continue with the next one.
        // }

        // const ext = path.extname(file)
        // const subject = file.split(ext)
        // const subject = code[1].split(ext)

        /* Use if multiple occurence of split text */
        // const [first, ...rest] = file.split('. ')
        // console.log(first)
        // const remainder = rest.join('. ')
        // const subject = remainder.split('.pdf')

        // const filename = file
        // const issuance = Issuance.addRecord(1, null, subject[0], filename, year + '-01-01')
        /** Memo data insert : End**/

        /** SO data insert : Start **/
        const [first, ...rest] = file.split('_')
        console.log(first)
        const remainder = rest.join('_')
        const ext = path.extname(file)
        const subject = remainder.split(ext)

        const filename = file
        // const ext = path.extname(file)
        // const subject = code[1].split(ext)

        // const stats = fs.statSync(directoryPath + '/' + code[0] + '2019_' + filename)
        // optional - get file attributes
        // const type = Issuance.getAttributes().issuance_type.values

        const issuance = Issuance.addRecord(2, first, subject[0], filename, year + '-01-01')
        /** SO data insert : End **/

        issuances.push(issuance)
      })
    })

    return res.json({
      success: true,
      message: 'Created!',
      data: issuances
    })
  } catch (error) {
    return res.error(error)
  }
})