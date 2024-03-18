const mongodb = require('mongodb');
const getdb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {

  constructor(username, email, cart, id){
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getdb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {

    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    let updatedCartItems = [...this.cart.items];
    if(cartProductIndex>=0){
      newQuantity = this.cart.items[cartProductIndex].quantity+1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }else{
      updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity});//storing only the reference as if there's any change in price and tittle it should reflect 
      //or else if the product itself is stored no updation of the product would be visible in the cart
    }
    const updatedCart = { items: updatedCartItems}; 

    const db = getdb();
    return db.collection('users').updateOne(
      { _id : new ObjectId(this._id) },
      { $set : {cart: updatedCart}}
   );
  }

  static findById(userId) {
    const db = getdb();
    return db.collection('users')
    .findOne({ _id : new ObjectId(userId)})
    .then(user => {
      return user;
    })
    .catch(err => {
      console.log(err);
    });
  }

}

module.exports=User;
