const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req,res,next)=>{ // a middleware to store user in a request so that to use it anywhere convinently..

//     User.findById('65f15d6f727947bbf230da69') // retrieving the user with id= id of created user
//     .then(user =>{ // storing the retrieved object as user
//         req.user= new User(user.name, user.email, user.cart, user._id); // user is not a js object but a sequleize object with all of the sequelize properties and functions
//         next();
//     })
//     .catch(err=>{console.log(err)})
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://restincraji:Jh2m2P5x5NOHvkPF@cluster0.wkntiav.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0').then(result => {
    app.listen(3000);
}).catch(err =>{
    console.log(err)
})

