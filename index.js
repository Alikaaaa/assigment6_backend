require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt')

const authorizationService = require('./services/authorization')
const userService = require('./services/users')

const PORT = process.env.PORT || 3000
const app = express()

let cors = require('cors')

app.use(cors())
app.options('*', cors()) 

let ExtractJwt = passportJWT.ExtractJwt
let JwtStrategy = passportJWT.Strategy

let jwtOptions = { 
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET,
}

let strategy = new JwtStrategy(jwtOptions, function (payload, next) {
  if (payload) {
    next(null, {
      _id: payload._id,
      login: payload.login,
      password: payload.password,
    });
  } else {
    next(null, false)
  }
})

passport.use(strategy)
app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/user/registration', async (req, res) => {
  let { login, password } = req.body

  if(!login) {
    return res.json({
      status: false,
      message: 'Login field is required'
    })
  }

  if(!password) {
    return res.json({
      status: false,
      message: 'Password field is required'
    })
  }

  try{
    let result = await authorizationService.signup({ login, password })
    return res.json({
      status: true,
      result: result,
    })
  } catch(e) {
    return res.json({
      status: false,
      message: e.message
    })
  }
})

app.post('/api/user/login', async (req, res) => {
  let { login, password } = req.body

  if(!login) {
    return res.json({
      status: false,
      message: 'Login field is required'
    })
  }

  if(!password) {
    return res.json({
      status: false,
      message: 'Password field is required'
    })
  }

  try{
    let result = await authorizationService.signin(login, password)
    return res.json({
      status: true,
      result: result,
    })
  } catch(e) {
    return res.json({
      status: false,
      message: e.message
    })
  }
})

app.get('/api/user/favourites', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let { user } = req

  try{
    let result = await userService.getFavourites(user._id)
    return res.json({
      status: true,
      result: result,
    })
  } catch(e) {
    return res.json({
      status: false,
      message: e.message
    })
  }
})

app.get('/api/user/history', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let { user } = req

  try{
    let result = await userService.getHistory(user._id)
    return res.json({
      status: true,
      result: result,
    })
  } catch(e) {
    return res.json({
      status: false,
      message: e.message
    })
  }
})

app.put('/api/user/favourites/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let { user } = req
  let { id } = req.params
  
  try{
    let result = await userService.addFavourites(user._id, id)
    return res.json({
      status: true,
      result: result,
    })
  } catch(e) {
    return res.json({
      status: false,
      message: e.message
    })
  }
})

app.put('/api/user/history/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let { user } = req
  let { id } = req.params
  
  try{
    let result = await userService.addHistory(user._id, id)
    return res.json({
      status: true,
      result: result,
    })
  } catch(e) {
    return res.json({
      status: false,
      message: e.message
    })
  }
})

app.delete('/api/user/favourites/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let { user } = req
  let { id } = req.params
  
  try{
    let result = await userService.deleteFavourite(user._id, id)
    return res.json({
      status: true,
      result: result,
    })
  } catch(e) {
    return res.json({
      status: false,
      message: e.message
    })
  }
})

app.delete('/api/user/history/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let { user } = req
  let { id } = req.params
  
  try{
    let result = await userService.deleteHistory(user._id, id)
    return res.json({
      status: true,
      result: result,
    })
  } catch(e) {
    return res.json({
      status: false,
      message: e.message
    })
  }
})

mongoose.connect(process.env.MONGO_URL)
  .then(_ => {
    console.log('Mongo connected.')
    
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}.`)
    })
  })


