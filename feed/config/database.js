const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://rehankhan:yoA9KUxERvt4Pc08@cluster0.r4bkqma.mongodb.net/",
      // yoA9KUxERvt4Pc08
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;


