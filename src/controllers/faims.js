import { Router } from 'express'
// import { sign } from 'jsonwebtoken'
import RequestAttachment from '../models/faims/attachment'
import Request from '../models/faims/request'
import Payee from '../models/faims/payee'

export const faimsApi = Router()

/**
 * GET /api/faims/requests
 */
faimsApi.get('/requests', async (req, res) => {
  try {
    const requests = await Request.index(req.body.date)

    return res.json({
      success: true,
      message: 'Fetch successful.',
      data: requests
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * GET /api/faims/requestattachments
 */
faimsApi.get('/requestattachments', async (req, res) => {
  try {
    const requestattachments = await RequestAttachment.index(req.body.date)

    return res.json({
      success: true,
      message: 'Fetch successful.',
      data: requestattachments
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * GET /api/faims/payees
 */
faimsApi.get('/payees', async (req, res) => {
  try {
    const payees = await Payee.index(req.body.date)

    return res.json({
      success: true,
      message: 'Fetch successful.',
      data: payees
    })
  } catch (error) {
    return res.error(error)
  }
})
/**
 * GET /api/hrmis/earlybirds
 */
/* faimsApi.get('/earlybirds', async (req, res) => {
  try {
    const birds = await Dtr.earlybirds()

    return res.json({
      success: true,
      message: 'Fetched early birds successful.',
      data: birds
    })
  } catch (error) {
    return res.error(error)
  }
}) */
// faimsApi.get('/earlybirds', async (req, res) => {
//   try {
//     // Read the date from the query parameters, if it exists
//     const date = req.query.date || null

//     // Pass the date to your earlybirds function
//     const birds = await Dtr.earlybirds(date)

//     return res.json({
//       success: true,
//       message: 'Fetched early birds successfully.',
//       data: birds
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching early birds.',
//       error: error.toString()
//     })
//   }
// })

/**
 * GET /api/hrmis/nightowls
 */
// faimsApi.get('/nightowls', async (req, res) => {
//   try {
//     // Read the date from the query parameters, if it exists
//     const date = req.query.date || null

//     // Pass the date to your earlybirds function
//     const owls = await Dtr.nightowls(date)

//     return res.json({
//       success: true,
//       message: 'Fetched night owls successful.',
//       data: owls
//     })
//   } catch (error) {
//     return res.error(error)
//   }
// })

/**
 * GET /api/hrmis/dayoff
 */
// faimsApi.get('/dayoff', async (req, res) => {
//   try {
//     const off = await Dtr.dayoff()

//     return res.json({
//       success: true,
//       message: 'Fetched dayoff successful.',
//       data: off
//     })
//   } catch (error) {
//     return res.error(error)
//   }
// })
