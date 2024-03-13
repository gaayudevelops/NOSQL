const mongodb = require('mongodb');
const getDb = require ('../util/database').getDb; 

class Product {

  constructor(title,price,description,imageUrl,id){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  save(){
    const db = getDb();
    let dpOp;
    if (this._id) {
      // update the product
      dpOp =  db.collection('products')
      .updateOne({ _id : new mongodb.ObjectId(this._id)} , {$set : this});
    }
    else{
      dpOp =  db.collection('products').insertOne(this)
    }
    return dpOp
    .then(result => {
      // console.log(result);
    })
    .catch(err =>{
      console.log(err);
    });
  }


static fetchAll() {
  const db = getDb();
  return db.collection('products')
  .find()
  .toArray()
  .then(products => {
    return products;
  })
  .catch(err =>{
    console.log(err);
  });

}

static findById(prodId) {
  const db = getDb();
  return db.collection('products')
  .find({_id: new mongodb.ObjectId(prodId)})
  .next()
  .then(product => {
    return product;
  })
  .catch(err =>{
    console.log(err);
  });

}

static deleteById(prodId){
  const db = getDb();
  return db.collection('products')
  .deleteOne({_id: new mongodb.ObjectId(prodId)})
  .then(result => {
    console.log('Deleted');
  })
  .catch(err =>{
    console.log(err);
  });

}

}

module.exports= Product;