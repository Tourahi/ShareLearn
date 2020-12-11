const mongoose = require('mongoose');

const connectDB = async () => {
  try{
    const conn = await mongoose.connect( process.env.MONGO_URI+`/${process.env.DBNAME}`, {
        useNewUrlParser : true ,
        useUnifiedTopology: true,
        useFindAndModify : false
    });
    console.log(`MongoDB instance connected : ${conn.connection.host}`);
    console.log(`Database connected : ${conn.connection.name}`);
    console.log(`connection url : ${conn.connection.client.s.url}`);
  }catch(err){
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
