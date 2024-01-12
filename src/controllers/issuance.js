import { Router } from 'express'
import Issuance from '../models/dms/issuance'
export const dmsApi = Router()
// const axios = require('axios')

const path = require('path')
const fs = require('fs')
const issuances = []

const NAS_URL = 'http://192.168.1.20:5000'
const LOGIN_API = '/webapi/auth.cgi'

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

/**
 * GET /api/dms/create
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
      // console.log('Successfully logged in')
      // console.log(data.data.sid)
      return res.json({
        status: 200,
        data: {
          sid: data.data.sid // Assume sid is the session ID. Adjust as needed
        }
      })
    } else {
      console.error('Error logging in:', data)
      return null
    }
  } catch (error) {
    console.error('Network error during login request:', error)
    return null
  }
})
