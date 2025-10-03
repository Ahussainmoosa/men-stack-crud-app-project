const dotenv = require('dotenv');

dotenv.config();
const express = require('express');

const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

// Controllers
const authController = require('./controllers/auth.js');
const cartController = require('./controllers/cart.js');
const checkoutController = require('./controllers/checkout.js');
const productController = require('./controllers/product.js');
const adminRoutes = require('./controllers/admin.js');

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
// MIDDLEWARE
//styels
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
app.use(passUserToView);
// PUBLIC
app.get('/', (req, res) => {
  res.render('index');
});


// PRIVATE
app.use('/auth', authController);
app.use('/cart', cartController);
app.use('/product', productController);
app.use('/uploads', express.static('uploads')); 
app.use(isSignedIn);
app.use('/checkout', checkoutController);
app.use('/admin',adminRoutes);



// PROTECTED
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
