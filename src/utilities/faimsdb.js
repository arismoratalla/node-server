import { Sequelize } from 'sequelize'

// create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_FAIMS,
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
async function faimsConnection () {
  try {
    await sequelize.authenticate()
    console.info('[FAIMS] Connection has been established successfully.')
  } catch (error) {
    console.error('[FAIMS] Unable to connect to database:', error)
    throw error
  }
}

// default export the database connection function
export { faimsConnection, sequelize as default }
