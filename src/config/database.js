import mongoose from 'mongoose'

import { configDotenv } from 'dotenv'
configDotenv()

const mongo_url = process.env.DATABASE_URL

const connectDb = async () => {
  try {
    const db = await mongoose
      .connect(mongo_url)
      .then(console.log('database connected'))
  } catch (error) {
    console.error('error in database connection', error)
  }
}

export default connectDb
