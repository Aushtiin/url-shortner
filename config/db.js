const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO : process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB...');
    return conn
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

// const disconnectDB = connectDB.conn.disconnect();

module.exports = {
  connectDB,
  // disconnectDB
}