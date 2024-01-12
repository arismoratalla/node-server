const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { createProxyMiddleware } = require('http-proxy-middleware')
require('dotenv').config()

const buildRoutes = require('./routes')
const { hrmisConnection } = require('./utilities/hrmisdb')
const utilityMiddlewares = require('./middlewares/utility')

const server = express()

/**
 * Configure CORS
 */
const corsOptions = function (req, callback) {
  const whiteList = process.env.CORS_WHITELIST.split(',')
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

// Proxy middleware
server.use('/api', createProxyMiddleware({
  target: 'http://node-server.dost9.ph',
  changeOrigin: true
}))

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
    await hrmisConnection()

    console.info('[SERVER] Boot up complete.')
  } catch (error) {
    console.error('[SERVER] Crashed:', error)
    process.exit(1)
  }
}

module.exports = bootServer()
