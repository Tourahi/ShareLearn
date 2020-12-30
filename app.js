const express   = require('express');
const expHBS    = require('express-handlebars');
const session   = require('express-session');
const MongoSessionStore = require('connect-mongo')(session);
const mongoose          = require('mongoose');
const methodOverride    = require('method-override');
const bodyParser        = require('body-parser');
const passport          = require('passport');
const flash             = require('connect-flash');
const MongoStore        = require('connect-mongo')(session);

//Chat related
const http    = require('http');
const socketio = require('socket.io');

//Database related
const connectDB = require('./config/dbConnection');
// DevMode only
const dotenv  = require('dotenv');
const morgan  = require('morgan');



// load the config file
dotenv.config({path : './config/conf.env'});

//app
const PORT = process.env.PORT || 3030;
const app = express();



// passport config
require('./config/passport')(passport);

//Initialize app
require('./init')(app,bodyParser,session,MongoStore,mongoose,
                  passport,flash,express,methodOverride);

//Connection to data Database
connectDB();

//templating
const hbs = expHBS.create(
  {
    extname : '.hbs',
    layoutsDir: './views/layouts',
    defaultLaout : 'login'
  });

app.engine('.hbs',hbs.engine);
app.set('view engine', '.hbs');

// Dev only middlewares
if(process.env.NODE_ENV = 'development') {
  app.use(morgan('dev'));
}

//Routes
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));
app.use('/chating',require('./routes/chat'));
//Error handler
app.use((err,req,res,next) => {
  res.status(err.status || 500);
  res.json({
    error : {
      status : err.status || 500,
      message : err.message
    }
  });
});

const server = app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);

// Socket setup
const io = socketio(server);
require('./socket')(io);
