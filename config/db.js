const mongoose = require('mongoose');

require('dotenv').config();

function connectDB(){
     mongoose.connect(process.env.MONGO_CONNECTION_URL , {useNewUrlParser : true, useUnifiedTopology : true});
     const connection = mongoose.connection;
     connection.once('open' , ()=>{
        console.log('Database connected...');
     }).on('error',function (err) {
      console.log('Connection failed ☹️☹️☹️☹️');
     });
}

module.exports = connectDB;