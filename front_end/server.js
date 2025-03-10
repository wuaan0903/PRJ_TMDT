const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ejsLocals = require("ejs-locals");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart.js");
const paymentsRoutes = require("./routes/payment");
const productController = require("./controllers/productController");
const cartController = require("./controllers/cartController.js");
const paymentController = require("./controllers/paymentController");
const orderController = require("./controllers/orderController");
const adminController = require("./controllers/adminController");
const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS with layouts
app.engine("ejs", ejsLocals);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Define routes
app.use(productRoutes);
app.use(userRoutes);
app.use(cartRoutes);
app.use(paymentsRoutes);

app.get("/", (req, res) => {
  res.render("home"); // Renders the home.ejs file
});

app.get("/search", (req, res) => {
  res.render("search"); // Renders the cart.ejs file
} );

app.get("/user/", (req, res) => {
  res.render("user/layouts/index");   // Renders the profile.ejs file
} );
app.get("/user/profile", (req, res) => {
  res.render("user/profile");   // Renders the profile.ejs file
} );

app.get("/user/orders", (req, res) => {
  res.render("user/orders");   // Renders the orders.ejs file
} );

app.get("/user/orders/:id", (req, res) => {
  res.render("user/orderDetail");   // 
} );
app.get("/user/vouchers", (req, res) => { 
  res.render("user/vouchers");   // Renders the vouchers.ejs file
} );
app.get("/user/address", (req, res) => {
  res.render("user/address");   // Renders the address.ejs file
} );
app.get("/user/reviews", (req, res) => {
  res.render("user/reviews");   // Renders the reviews.ejs file
} );
app.get("/user/policies", (req, res) => {
  res.render("user/policies");   // Renders the policies.ejs file
} );

app.get('/admin/orders', (req, res) => {
  res.render('admin/order/listOrder'); // 
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/admin", (req, res) => {
  res.render("admin/home"); // Renders the home.ejs file
});
app.get("/admin/home", (req, res) => {
  res.render("admin/home"); // Renders the home.ejs file
});
app.get("/admin/orders", (req, res) => {
  res.render("admin/order/listOrder"); //

});
app.get("/admin/products", (req, res) => {
  res.render("admin/product/listProduct"); //
});
app.get("/admin/products/add", (req, res) => {
  res.render("admin/product/addProduct"); //
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/admin", (req, res) => {
  res.render("admin/home"); // Renders the home.ejs file
});
app.get("/admin/home", (req, res) => {
  res.render("admin/home"); // Renders the home.ejs file
});
app.get("/admin/orders", (req, res) => {
  res.render("admin/order/listOrder"); //
});
app.get("/admin/products", (req, res) => {
  res.render("admin/product/listProduct"); //
});
app.get("/admin/products/add", (req, res) => {
  res.render("admin/product/addProduct"); //
});

app.get("/admin/products/edit/:id", productController.renderEditPage);

app.get('/admin/collections/edit/:id', productController.renderEditCollectionPage);


app.get("/admin/storage", (req, res) => {
  res.render("admin/storage/listStorage"); //
});

// app.get('/admin/storage/edit', (req, res) => {
//   res.render('admin/storage/editStorage'); //
// });

app.get("/admin/collections", (req, res) => {
  res.render("admin/collection/listCollection"); //
});

app.get("/admin/account", (req, res) => {
  res.render("admin/account/listAccount"); //
});

app.get("/admin/discount", (req, res) => {
  res.render("admin/discount/listVoucher"); //
});

app.get('/product/:id', productController.renderProductDetails);
app.get('/cart/:id', cartController.renderCartPage);
app.get('/admin/storage/edit/:id', productController.renderEditQuantityPage);

app.get('/admin', adminController.renderHomePage);

app.get('/admin/collections/edit/:id', productController.renderEditCollectionPage);


app.get('/payment/success', paymentController.renderPaymentSuccess);

app.get('/payment/error', paymentController.renderPaymentFailed);


// app.use(userRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
