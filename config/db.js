const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.NODE_ENV === 'development' ? process.env.MONGO_URI : process.env.TEST_MONGO;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoB...');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}


module.exports = connectDB