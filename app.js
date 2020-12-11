const express = require('express');

// DevMode only
const dotenv  = require('dotenv');
const morgan  = require('morgan');



// load the config file
dotenv.config({path : './config/conf.env'});

const PORT = process.env.PORT || 3030;
const app = express();



// Dev only middlewares
console.log(process.env.NODE_ENV );
if(process.env.NODE_ENV = 'development') {
  app.use(morgan('dev'));
}

app.get('/hello',(req,res) => {
  res.json({working : "True"});
});

app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}.`)
);
