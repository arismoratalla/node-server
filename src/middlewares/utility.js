/**
 * Middleware to add utility functions to the response object
 */
export default function utilityMiddlewares (req, res, next) {
  /**
   * Return an Error 400 response
   * @param {Error} error Error object
   * @param {Object} data JSON data
   */
  res.error = function (error, data) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, error && error.message)

    data = data || {
      success: false,
      message: error && error.message || 'Unknown error'
    }

    return res.status(400).json(data)
  }

  next()
}
