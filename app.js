const express = require('express');
const app = express();
const mongoDb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const PORT = process.env.PORT || 3000;

app.use(express.json());


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const db = await mongoDb.getDatabase().db();
      
      const existingUser = await db.collection('users').findOne({ googleId: profile.id });
  
      if (!existingUser) {
        await db.collection('users').insertOne({
          googleId: profile.id,
          displayName: profile.displayName,
          name: {
            givenName: profile.name.givenName,
            familyName: profile.name.familyName
          },
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
          provider: profile.provider,
          role: 'user'
        });
        console.log('New user saved:', profile.displayName);
      }
  
      return done(null, profile);
    } catch (err) {
      console.error('Error saving user:', err);
      return done(err, null);
    }
  }));
  
   passport.serializeUser((user, done) => {
    done(null, user);
    });
   passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
    res.redirect('/');
});

app.use('/', require('./routes/index.js'))

mongoDb.initDb((err) =>{
    if(err) {
        console.log(err);
    } else {
        app.listen(PORT, ()=>{
            console.log(`Database is listening and node running on port: ${PORT}`);
        });
    };
});