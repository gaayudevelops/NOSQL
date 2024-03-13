const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{ // a middleware to store user in a request so that to use it anywhere convinently..

    // User.findByPk(1) // retrieving the user with id= 1
    // .then(user =>{ // storing the retrieved object as user

    //     req.user= user; // user is not a js object but a sequleize object with all of the sequelize properties and functions
    //     next();
    // })
    // .catch(err=>{console.log(err)})
    next();

})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
})

