const express = require('express');
const path    = require('path');
const expHBS    = require('express-handlebars');
//Database related
const connectDB = require('./config/dbConnection');
// DevMode only
const dotenv  = require('dotenv');
const morgan  = require('morgan');



// load the config file
dotenv.config({path : './config/conf.env'});
const PORT = process.env.PORT || 3030;

const app = express();

//Connection to data Database
connectDB();

//templating
app.engine('.hbs',expHBS(
  {
    extname : '.hbs',
    layoutsDir: './views/layouts',
    defaultLaout : 'main'
  }
));
app.set('view engine', '.hbs');

// Dev only middlewares
console.log(process.env.NODE_ENV );
if(process.env.NODE_ENV = 'development') {
  app.use(morgan('dev'));
}

//Static folders
app.set(express.static(path.join(__dirname,'public')));

//Routes
app.get('/hello',(req,res) => { //For testing only
  res.render('index');
});

app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);
