const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
   name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  cart: {
    items: [
    { 
        productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity:{type:Number, required:true} 
    }
    ]
 }
});

module.exports = mongoose.model('User',userSchema);





// const mongodb = require('mongodb');
// const getdb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User {

//   constructor(username, email, cart, id){
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getdb();
//     return db.collection('users').insertOne(this);
//   }

//   addToCart(product) {

//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     let updatedCartItems = [...this.cart.items];
//     if(cartProductIndex>=0){
//       newQuantity = this.cart.items[cartProductIndex].quantity+1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     }else{
//       updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity});//storing only the reference as if there's any change in price and tittle it should reflect 
//       //or else if the product itself is stored no updation of the product would be visible in the cart
//     }
//     const updatedCart = { items: updatedCartItems}; 

//     const db = getdb();
//     return db.collection('users').updateOne(
//       { _id : new ObjectId(this._id) },
//       { $set : {cart: updatedCart}}
//    );
//   }

//   getCart(){
//     const db = getdb();
//     const productIds = this.cart.items.map(i => { // map() returns a new array by mapping the function operation to the items array
//       return i.productId //gets an array of product ids that corresponds to the products that was added in the cart.
//     });
  
//     return db.collection('products')
//     .find({ _id: {$in : productIds}}) //  the 'in' query operator looks for the ids in the productIds array.
//     .toArray()
//     .then(products =>{
//       return products.map(p => {
//         return {
//           ...p,
//           quantity: this.cart.items.find(i => { // 'this' workd only because the mapped function is an arrow function.For normal functions 'this' would not have reference to the class.
//           return i.productId.toString() === p._id.toString();
//           }).quantity
//         }
//       })
//       //As a result of the mapping the new array returned is [ {product, quantity: (as per in the cart)} ]
//     })
//   }

//   deleteItemfromcart(productId){
//     const UpdatedCartItems = this.cart.items.filter( item =>{  //filter() returns an array
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getdb();
//     return db.collection('users').updateOne(
//       { _id : new ObjectId(this._id) },
//       { $set : {cart: {items : UpdatedCartItems} }}
//    );

//   }

//   addOrder(){
//     const db = getdb();
//     return this.getCart()
//     .then(products =>{
//       const order = {
//         items: products,
//         user:{
//           _id: new ObjectId(this._id),
//           name: this.name
//         }
//       };
//       return db.collection('orders').insertOne(order)
//     })
//     .then(result =>{
//       this.cart = {items: [] };
//       return db.collection('users').updateOne(
//         { _id : new ObjectId(this._id) },
//         { $set : {cart: {items : []} }}
//      );
//     })

//   }

//   getOrders(){
//     const db = getdb();
//     return db.collection('orders').find({ 'user._id': new ObjectId(this._id)}) //In mongodb we can also check nested properties by defining the path to them. Use quotation mark around the path.
//     .toArray()
//   }

//   static findById(userId) {
//     const db = getdb();
//     return db.collection('users')
//     .findOne({ _id : new ObjectId(userId)})
//     .then(user => {
//       return user;
//     })
//   }

// }

// module.exports=User;
