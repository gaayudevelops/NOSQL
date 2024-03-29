const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find() //mongoose has the find() method to give the products in an array.
  .then(products =>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });    
  })
  .catch(err => console.log(err));

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId) //Here findById() is a built-in mongoose method.We can actually pass a string 
  //which will be converted to ObjectId by mongoose itself.
  .then(product=>{
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
  })
})
.catch(err => console.log(err))

};

exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products=> {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
  });
})
.catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
  req.user.
  populate('cart.items.productId') // populates the productId filed with data from the Products model.
  .then(user=> {
    // console.log(user.cart.items)
    products = user.cart.items;
    res.render('shop/cart', {
      products: products,
      pageTitle: 'Your Cart',
      path: '/cart'
    });
  })
  .catch(err =>{console.log(err)})
}

exports.postCart = (req, res, next) => {

  const prodId = req.body.productId; // getting the id of the particular product
  Product.findById(prodId)
  .then(product => {
    return req.user.addToCart(product);
  })
  .then (result => {
    res.redirect('/cart');
  })
 
};

exports.postCartDeleteProduct = (req, res, next) => {

  const prodId = req.body.productId;
  req.user
  .removeFromCart(prodId) // getting the cart of the particular user
  .then((result)=>{
    res.redirect('/cart');
  })
  .catch(err => {console.log(err)});
};

exports.postOrder = (req, res, next) => {
  req.user.
  populate('cart.items.productId') // populates the productId filed with data from the Products model.
  .then(user=> {
    const products = user.cart.items.map(i=> {
      return {product: {...i.productId._doc }, quantity: i.quantity} //_doc gives the whole data in the object 
    });
    // console.log(products)
    // console.log(user.cart.items)
    const order = new Order({
      user:{
        name: req.user.name,
        userId: req.user._id 
      },
      products: products
    });
    return order.save()
  })
  .then(result => {
    return req.user.clearCart()
  })
  .then(()=> {
    res.redirect('/orders');
  })
  .catch(err => {console.log(err)});
};

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
  .then(orders =>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
