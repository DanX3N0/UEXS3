const express = require('express')
const session = require('express-session')
const passport = require('passport')
const GoogleConnect = require('passport-google-oauth2').Strategy

const PORT = 3000
const HOST = 'localhost'
const app = express()

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public'))

passport.use(
  new GoogleConnect(
    {
      clientID:
        '478510298550-0osacstqhiauks26dpq2vofpfkr63i5a.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile)
    }
  )
)

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/auth/google/failure',
  })
)

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'))
})

app.listen(PORT, HOST, () => {
  console.log(`Server run on http://${HOST}:${PORT}`)
})
