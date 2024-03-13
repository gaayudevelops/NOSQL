const mongodb = require('mongodb');
const getdb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username,email){
    this.name = username;
    this.email = email;
  }

  save() {
    const db = getdb();
    return db.collection('users').insertOne(this);
  }

  static findById(userId) {
    const db = getdb();
    return db.collection('users')
    .findOne({ _id : new ObjectId(userId)})
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(err => {
      console.log(err);
    });
  }

}

module.exports=User;
