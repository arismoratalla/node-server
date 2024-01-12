// ./routes
// import { authApi, authUi } from './controllers/auth'
// import { hrmisApi } from './controllers/dtr'
// // import { dmsApi } from './controllers/dms/index'
// import { dmsApi } from './controllers/issuance'

// export default function buildRoutes (route) {
const authApi = require('./controllers/auth').authApi
const authUi = require('./controllers/auth').authUi
const hrmisApi = require('./controllers/dtr').hrmisApi
const dmsApi = require('./controllers/issuance').dmsApi
const faimsApi = require('./controllers/faims').faimsApi

module.exports = function buildRoutes (route) {
  // Authentication Routes
  route.use('/api/auth', authApi)
  route.use('/auth', authUi)
  route.use('/api/hrmis', hrmisApi)
  route.use('/api/dms', dmsApi)

  route.use('/api/faims', faimsApi)
  route.use('/api/faims/payees', faimsApi)
  route.use('/api/faims/requests', faimsApi)

  // Error 404 Handler
  route.use((req, res) => {
    if (req.headers.accept.includes('html')) {
      return res.status(404).send(`
        <div>
          <span>Page not found.</span>
        </div>
      `)
    } else {
      return res.status(404).json({
        success: false,
        message: 'API not found.'
      })
    }
  })
}
