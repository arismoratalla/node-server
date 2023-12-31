import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import 'dotenv/config'

import buildRoutes from './routes'
import { databaseConnection } from './utilities/mysqldb'
import { hrmisConnection } from './utilities/hrmisdb'
import { dmsConnection } from './utilities/dmsdb'
import utilityMiddlewares from './middlewares/utility'

const server = express()

/**
 * Configure cors
 */
const corsOptions = function (req, callback) {
  const whiteList = [
    'http://localhost:5173',
    'http://172.16.100.87:5173',
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
  // log http request
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
    // Boot Order
    await apiServer()
    await buildRoutes(server)
    await databaseConnection()
    await hrmisConnection()
    await dmsConnection()

    console.info('[SERVER] Boot up complete.')
  } catch (error) {
    console.error('[SERVER] Crashed:', error)
  }
}

export default bootServer()
