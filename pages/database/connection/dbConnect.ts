'use server'
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI
// const credentials = 'public/X509-cert-8496722399756930850.pem'
const clientOptions = {
  // tlsCertificateKeyFile: credentials,
  serverApi: { version: '1' },
}
if (!MONGODB_URI) {
  throw new Error('Por favor defina a variável de ambiente MONGODB_URI')
} else {
  console.log(MONGODB_URI)
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {

    cached.promise = mongoose
      .connect(MONGODB_URI, clientOptions)
      .then((mongoose) => {
        console.log('Connected to MongoDB')
        return mongoose
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error)
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }
}

export default dbConnect
