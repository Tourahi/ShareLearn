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

module.exports = (app,bodyParser,session,MongoStore,mongoose,
                  passport,flash,express,methodOverride) => {
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
  }));
  //Static folder
  app.use(express.static(path.join(__dirname , 'public')));
}
