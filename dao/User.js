const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
  },
  password: String,
  favourites: [ String ],
  history: [ String ],
})

module.exports = mongoose.model('User', schema)