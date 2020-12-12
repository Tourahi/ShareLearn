const express   = require('express');
const path      = require('path');
const expHBS    = require('express-handlebars');
const passport  = require('passport');
const session   = require('express-session');
const MongoSessionStore = require('connect-mongo')(session);
const mongoose          = require('mongoose');
const methodOverride    = require('method-override');
const bodyParser        = require('body-parser');
//Database related
const connectDB = require('./config/dbConnection');
// DevMode only
const dotenv  = require('dotenv');
const morgan  = require('morgan');

// load the config file
dotenv.config({path : './config/conf.env'});
// passport config
require('./config/passport')(passport);

const PORT = process.env.PORT || 3030;
const app = express();

//Parser
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

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

//store session to mongodb
app.use(session({
  secret: 'keyboard caty cat',
  resave: false,
  saveUninitialized: false,
  store  : new MongoSessionStore( {mongooseConnection : mongoose.connection })
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//encoding && json
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

// Overloading the post method
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

//Routes
app.get('/hello',(req,res) => { //For testing only
  res.render('index');
});

app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);
