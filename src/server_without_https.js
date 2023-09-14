const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
// const { createProxyMiddleware } = require('http-proxy-middleware')
require('dotenv').config()

const buildRoutes = require('./routes')
// const { databaseConnection } = require('./utilities/mysqldb')
const { hrmisConnection } = require('./utilities/hrmisdb')
// const { dmsConnection } = require('./utilities/dmsdb')
const utilityMiddlewares = require('./middlewares/utility')

const server = express()

/**
 * Configure cors
 */
const corsOptions = function (req, callback) {
  const whiteList = [
    'http://119.93.144.180',
    'https://119.93.144.180',
    'http://timelog.dost9.ph',
    'https://timelog.dost9.ph',
    'http://192.168.0.3:5173',
    'http://172.16.100.87:5173',
    'http://172.16.110.108:5173',
    'http://172.16.110.78:5173'
  ]
  callback(null, {
    origin: whiteList.includes(req.header('Origin'))
  })
}
/**
 * Configure Server
 */
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(helmet())
server.use(cors(corsOptions))
server.use(utilityMiddlewares)
server.use('/assets', express.static('src/public'))

server.set('view engine', 'ejs')
server.set('views', 'src/views')

server.use((req, res, next) => {
  console.info(`[SERVER] ${req.method} ${req.originalUrl}`)
  next()
})

/**
 * Start's API Server
 * @returns {Promise<import('http').Server>}
 */
function apiServer () {
  return new Promise(resolve => {
    const port = process.env.PORT || 3000
    const api = server.listen(port)

    api.on('listening', () => {
      console.info(`[SERVER] Started on port ${port}`)
      resolve(api)
    })
  })
}

/**
 * Boot Server
 */
async function bootServer () {
  try {
    await apiServer()
    await buildRoutes(server)
    // await databaseConnection()
    await hrmisConnection()
    // await dmsConnection()

    console.info('[SERVER] Boot up complete.')
  } catch (error) {
    console.error('[SERVER] Crashed:', error)
  }
}

module.exports = bootServer()
