const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{ // a middleware to store user in a request so that to use it anywhere convinently..

    User.findById('65f6c1d63f22ee8ce1fe36e4') 
    .then(user =>{ // user is a mongoose model with we can call mongoose methods
        req.user = user ;
        next();
    })
    .catch(err=>{console.log(err)})
   
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://restincraji:Jh2m2P5x5NOHvkPF@cluster0.wkntiav.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
.then(result => {
    User.findOne() //findOne() with no id passed would return the first document in the model
    .then(user=>{
        if(!user){
            const user = new User({
                name: 'Ram',
                email: 'ram@abc.com',
                cart: {
                   items: []
                }
            });
            user.save();
        }
    })
    app.listen(3000);
}).catch(err =>{
    console.log(err)
})

