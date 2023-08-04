import { Sequelize } from 'sequelize'

// create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_HRMIS,
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
async function hrmisConnection () {
  try {
    await sequelize.authenticate()
    console.info('[HRMIS] Connection has been established successfully.')
  } catch (error) {
    console.error('[HRMIS] Unable to connect to database:', error)
    throw error
  }
}

// default export the database connection function
export { hrmisConnection, sequelize as default }
