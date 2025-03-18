const mongoose = require("mongoose");
const db_url = process.env.DB_URL;

const connectDB = () => {
  return mongoose.connect(db_url);
};

module.exports = connectDB;
