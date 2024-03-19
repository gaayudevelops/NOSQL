const Product = require('../models/product');
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log(req.user)
  const product = new Product({
    title: title, 
    imageUrl: imageUrl, 
    price: price, 
    description: description,
    userId: req.user // mongoose gives that convenience to store the entire user object and mongoose will just pick the id from this object.
  });

  product.save() // Here .save() comes from mongoose but doesnt give a promise technically.

  .then((result)=>{ //mongoose gives .then() and .cathch() methods too 
    console.log('Created Product');
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    })
  })
  .catch(err => console.log(err));
}
  

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  Product.findById(prodId)
  .then(product =>{ // Here the product is a mongoose object that has all the mongoose methods associated with it.
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;
    return product.save();
  })
  .then(result =>{
    console.log('Updated Product');
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err))
  
};

exports.getProducts = (req, res, next) => {
Product.find()
//.select('title price -_id') // Upon 'console.log(products)', this utility fn of mongoose helps us to find which field we need to select and unselect from the database. _id always shows up unless it is explicitely excluded.
// here, title, price are selected to display and _id is unselected with a '-'. 

//.populate('userId', 'name') // a utility method provided by mongoose to populate a certain field upon 'console.log(products)' with all detailed information not just an id.
// if given a second field too, for eg: name, the data will only be populated with the given field. 
  .then(products =>{
    // console.log(products)
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });    
  })
  .catch(err => console.log(err));

};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
  .then(()=>{
    console.log('Product Deleted');
    res.redirect('/admin/products')
  })
  .catch(err => console.log(err));

};
