const User = require('../dao/User')
const oid = require('mongoose').Types.ObjectId

class UsersService {
  async getFavourites(user_id) {
    let user = await User.findOne({ _id: new oid(user_id) })
    
    if(!user) {
      throw new Error('User not found.')
    }

    return user.favourites
  }

  async getHistory(user_id) {
    let user = await User.findOne({ _id: new oid(user_id) })
    
    if(!user) {
      throw new Error('User not found.')
    }

    return user.history
  }

  async addFavourites(user_id, favourite) {
    await User.updateOne({ _id: new oid(user_id) }, { 
      $push: {
        favourites: favourite
      }
     })
  }

  async addHistory(user_id, history) {
    await User.updateOne({ _id: new oid(user_id) }, { 
      $push: {
        history: history
      }
     })
  }

  async deleteFavourite(user_id, favourite) {
    await User.updateOne({ _id: new oid(user_id) }, { 
      $pull: {
        favourites: favourite
      }
     })
  }

  async deleteHistory(user_id, history) {
    await User.updateOne({ _id: new oid(user_id) }, { 
      $pull: {
        history: history
      }
     })
  }
}

module.exports = new UsersService()