// Tourahi notes
/*
  Used pkgs :
    bodyParser
    session
    MongoStore
    mongoose
    passport
    flash
    express
    methodOverride
*/
//Utils
const path      = require('path');
const {methodeoverride} = require('./middleware/auth');
module.exports = (app,session,MongoStore,mongoose,
                  passport,flash,express,morgan,methodOverride) => {
  // Sessions
  app.use(
    session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );

  // Overloading the post method
  app.use(methodOverride(methodeoverride));

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  //encoding && json
  app.use(express.urlencoded({ extended:false }));
  app.use(express.json());
  app.use(morgan('tiny'));
  //Connect flash
  app.use(flash());
  //Static folder
  app.use(express.static(path.join(__dirname , 'public')));
}
