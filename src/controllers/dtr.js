import { Router } from 'express'
// import { sign } from 'jsonwebtoken'
// import { validate } from '../utilities/validate'
import Dtr from '../models/hrmis/dtr'
import Employee from '../models/hrmis/employee'

export const hrmisApi = Router()

/**
 * TIME-IN - AM
 * POST /api/hrmis/inAM
 */
hrmisApi.post('/inAM', async (req, res) => {
  try {
    /*  Time-in using Employee ID
    *   Throws an error if not found
    *   Will not proceed on error */
    const employee = await Employee.getOne(req.body.employee_num)

    const dtr = await Dtr.timeInAM(employee.user_id)

    return res.json({
      success: true,
      message: dtr.message
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * TIME-OUT - AM
 * POST /api/hrmis/outAM
 */
hrmisApi.post('/outAM', async (req, res) => {
  try {
    // Time-out using Employee ID
    const employee = await Employee.getOne(req.body.employee_num)

    const dtr = await Dtr.timeOutAM(employee.user_id)

    return res.json({
      success: true,
      message: dtr.message
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * TIME-IN - PM
 * POST /api/hrmis/outAM
 */
hrmisApi.post('/inPM', async (req, res) => {
  try {
    // Time-out using Employee ID
    const employee = await Employee.getOne(req.body.employee_num)

    const dtr = await Dtr.timeInPM(employee.user_id)

    return res.json({
      success: true,
      message: dtr.message
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * TIME-IN - PM
 * POST /api/hrmis/outAM
 */
hrmisApi.post('/outPM', async (req, res) => {
  try {
    // Time-out using Employee ID
    const employee = await Employee.getOne(req.body.employee_num)

    const dtr = await Dtr.timeOutPM(employee.user_id)

    return res.json({
      success: true,
      message: dtr.message
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * GET /api/hrmis/dtrs
 */
hrmisApi.get('/dtrs', async (req, res) => {
  try {
    const dtrs = await Dtr.index(req.body.date)

    return res.json({
      success: true,
      message: 'Fetch successful.',
      data: dtrs
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * GET /api/hrmis/earlybirds
 */
/* hrmisApi.get('/earlybirds', async (req, res) => {
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
hrmisApi.get('/earlybirds', async (req, res) => {
  try {
    // Read the date from the query parameters, if it exists
    const date = req.query.date || null

    // Pass the date to your earlybirds function
    const birds = await Dtr.earlybirds(date)

    return res.json({
      success: true,
      message: 'Fetched early birds successfully.',
      data: birds
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching early birds.',
      error: error.toString()
    })
  }
})

/**
 * GET /api/hrmis/nightowls
 */
hrmisApi.get('/nightowls', async (req, res) => {
  try {
    // Read the date from the query parameters, if it exists
    const date = req.query.date || null

    // Pass the date to your earlybirds function
    const owls = await Dtr.nightowls(date)

    return res.json({
      success: true,
      message: 'Fetched night owls successful.',
      data: owls
    })
  } catch (error) {
    return res.error(error)
  }
})

/**
 * GET /api/hrmis/dayoff
 */
hrmisApi.get('/dayoff', async (req, res) => {
  try {
    const off = await Dtr.dayoff()

    return res.json({
      success: true,
      message: 'Fetched dayoff successful.',
      data: off
    })
  } catch (error) {
    return res.error(error)
  }
})
