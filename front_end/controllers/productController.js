const axios = require("axios");

const renderAddPage = async (req, res) => {
  const productId = req.params.id;
  try {
    const response = await axios.get(
      `http://localhost:3000/api/product/${productId}`
    );
    if (response.status !== 200) {
      return res
        .status(response.status)
        .send(`Failed to fetch product with ID ${productId}`);
    }
    const product = response.data;
    res.render("admin/product/addProduct", { product }); // Pass product data to the view
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    res.status(500).send("Failed to fetch product for edit.");
  }
};
const renderEditPage = async (req, res) => {
  const productId = req.params.id;
  try {
    const response = await axios.get(
      `http://localhost:3000/api/product/${productId}`
    );
    if (response.status !== 200) {
      return res
        .status(response.status)
        .send(`Failed to fetch product with ID ${productId}`);
    }
    const product = response.data;
    console.log("Product Data:", product);
    res.render("admin/product/editProduct", { product }); // Pass product data to the view
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    res.status(500).send("Failed to fetch product for edit.");
  }
};
const renderEditCollectionPage = async (req, res) => {
  const collectionId = req.params.id;
  try {
    const response = await axios.get(`http://localhost:3000/api/categories?collectionId=${collectionId}`);
     if (response.status !== 200) {
          return res.status(response.status).send(`Failed to fetch collection with ID ${collectionId}`);
       }
    const categories = response.data;
    res.render('admin/collection/editCollection', { categories }); // Pass collection data to the view
  } catch (error) {
    console.error('Error fetching collection for edit:', error);
     res.status(500).send('Failed to fetch collection for edit.');
  }
}
//Render product sort by category page
const renderProductSortByCategory = async (req, res) => {
  const categoryId = req.query.categoryId;
  try {
    const response = await axios.get(`http://localhost:3000/api/category/${categoryId}`);
     if (response.status !== 200) {
          return res.status(response.status).send(`Failed to fetch category with ID ${categoryId}`);
       }
    const category = response.data;
     const productsResponse = await axios.get(`http://localhost:3000/api/products`);
     if (productsResponse.status !== 200) {
          return res.status(productsResponse.status).send(`Failed to fetch all products`);
       }
    const products = productsResponse.data.filter(product => product.categories._id === categoryId);
    res.render('filterProduct', { category, products }); 
  } catch (error) {
    console.error('Error fetching category:', error);
     res.status(500).send('Failed to fetch category.');
  }
};
module.exports = {
  renderEditCollectionPage,
  renderAddPage,
  renderEditPage,
  renderProductSortByCategory
};
