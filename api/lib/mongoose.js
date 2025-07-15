import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()
const MONGODB_URI = process.env.DB_LINK;

if (!MONGODB_URI) throw new Error('MONGODB_URI not set');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;