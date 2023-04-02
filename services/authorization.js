const User = require('../dao/User')
const jwt = require('jsonwebtoken')

class AuthorizationService {
  async signup(dto) {
    let search = await User.findOne({ login: dto.login })

    if(search) {
      throw new Error('User already exists.')
    }

    let result = await User.create(dto)

    let payload = {
      _id: result._id,
      login: result.login,
      password: result.password,
    }

    return { token: jwt.sign(payload, process.env.JWT_SECRET) }
  }

  async signin(login, password) {
    let search = await User.findOne({ login, password })

    if(!search) {
      throw new Error('User not found.')
    }

    let payload = {
      _id: search._id,
      login: search.login,
      password: search.password,
    }

    return { token: jwt.sign(payload, process.env.JWT_SECRET) }
  }
}

module.exports = new AuthorizationService()