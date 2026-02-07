import mongoose from 'mongoose';
import config from './index.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Erreur de connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
