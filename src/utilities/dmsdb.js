import { Sequelize } from 'sequelize'

// create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_DMS,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
)

/**
 * Establish a database connection
 * @returns {Promise<Sequelize>}
 */
async function dmsConnection () {
  try {
    await sequelize.authenticate()
    console.info('[DMS] Connection has been established successfully.')
  } catch (error) {
    console.error('[DMS] Unable to connect to database:', error)
    throw error
  }
}

// default export the database connection function
export { dmsConnection, sequelize as default }
