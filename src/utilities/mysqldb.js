import { Sequelize } from 'sequelize'

// create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
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
async function databaseConnection () {
  try {
    await sequelize.authenticate()
    console.info('[DATABASE] Connection has been established successfully.')
  } catch (error) {
    console.error('[DATABASE] Unable to connect to the database:', error)
    throw error
  }
}

// default export the database connection function
export { databaseConnection, sequelize as default }
