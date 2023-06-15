import mongoose from 'mongoose'

export default async function databaseConnection () {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  console.info(`[DATABASE] Connected to ${process.env.MONGODB_URI}`)
}
