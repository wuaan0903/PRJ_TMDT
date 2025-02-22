const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLocals = require('ejs-locals');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart.js');
const paymentsRoutes = require('./routes/payment');
const productController = require('./controllers/productController');
const cartController = require('./controllers/cartController.js');
const paymentController = require('./controllers/paymentController');
const orderController = require('./controllers/orderController');
const adminController = require('./controllers/adminController');
const app = express();
const PORT = process.env.PORT || 3000;



// Set up EJS with layouts
app.engine('ejs', ejsLocals);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Define routes
app.use(productRoutes);
app.use(userRoutes);  
app.use(cartRoutes);
app.use(paymentsRoutes);

app.get('/', (req, res) => {
  
  res.render('home'); // Renders the home.ejs file
});



app.get('/cart', (req, res) => {
  
  res.render('cart'); // Renders the home.ejs file
});

app.get('/login', (req, res) => {
  res.render('login');
})
app.get('/register', (req, res) =>{
  res.render('register');
});


app.get('/admin', (req, res) => {
  res.render('admin/home'); // Renders the home.ejs file
});
app.get('/admin/home', (req, res) => {
  res.render('admin/home'); // Renders the home.ejs file
});
app.get('/admin/orders', (req, res) => {
  res.render('admin/order/listOrder'); // 
});
app.get('/admin/products', (req, res) => {
  res.render('admin/product/listProduct'); // 
});
app.get('/admin/products/add', (req, res) => {
  res.render('admin/product/addProduct'); // 
});

app.get('/admin/storage', (req, res) => {
  res.render('admin/storage/listStorage'); // 
});

// app.get('/admin/storage/edit', (req, res) => {
//   res.render('admin/storage/editStorage'); // 
// });

app.get('/admin/collections', (req, res) => {
  res.render('admin/collection/listCollection'); // 
});


app.get('/product/:id', productController.renderProductDetails);


app.get('/admin', adminController.renderHomePage);

app.get('/admin/collections/edit/:id', productController.renderEditCollectionPage);


// app.use(userRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});