const express   = require('express');
const path      = require('path');
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
const {
  generateMsg
} = require('./lib/messages.js');

const { addUser,
        removeUser,
        getUser,
        getUsersInRoom } = require('./lib/users.js');

//Database related
const connectDB = require('./config/dbConnection');
// DevMode only
const dotenv  = require('dotenv');
const morgan  = require('morgan');



// load the config file
dotenv.config({path : './config/conf.env'});


const PORT = process.env.PORT || 3030;
const app = express();



// passport config
require('./config/passport')(passport);

const init = () => {
  //Parser
  app.use(bodyParser.urlencoded({extended : true}));
  app.use(bodyParser.json());
  // Sessions
  app.use(
    session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  //Connect flash
  app.use(flash());
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
  //Static folder
  app.use(express.static(path.join(__dirname , 'public')));
};

init();

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

//Chat related
const server = app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);

const io = socketio(server);

const IO = () => {
  //io handling
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('message',generateMsg("Welcome!","ChatBot"));

    //join for every Room
    socket.on('join',({username , room}, ack) => {
        const {error , user} = addUser({id : socket.id , username, room});
        // Error reporting
        if(error) {
          return ack(error);
        }
        socket.join(user.room);
        socket.broadcast.to(user.room).emit('message' , generateMsg(`${user.username} has joined.`,"ChatBot"));

        //Send Room data
        io.to(user.room).emit('roomData' , {
          room : user.room,
          users : getUsersInRoom(user.room)
        })
        ack();
    });

    socket.on('sendMessage',(msg,ack) => {
      console.log(msg);
      const user = getUser(socket.id);
      io.to(user.room).emit('message',generateMsg(msg,user.username));
      ack();
    });

    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
      if(user) {
        //Send Room data
        io.to(user.room).emit('roomData' , {
          room : user.room,
          users : getUsersInRoom(user.room)
        })
        io.to(user.room).emit('message' ,generateMsg(`${user.username} has left!`));
      }
    });
  });
};

IO();
