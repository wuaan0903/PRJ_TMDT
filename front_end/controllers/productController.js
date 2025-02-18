// Assuming you have a controller file (e.g., productController.js)
const axios = require('axios');

const renderEditPage = async (req, res) => {
  const productId = req.params.id;
  try {
    const response = await axios.get(`http://localhost:3000/api/product/${productId}`);
     if (response.status !== 200) {
          return res.status(response.status).send(`Failed to fetch product with ID ${productId}`);
       }
    const product = response.data;
    res.render('admin/product/addProduct', { product }); // Pass product data to the view
  } catch (error) {
    console.error('Error fetching product for edit:', error);
     res.status(500).send('Failed to fetch product for edit.');
  }
};

const renderEditQuantityPage = async (req, res) => {
  const productId = req.params.id;
  try {
    const response = await axios.get(`http://localhost:3000/api/product-quantity/${productId}`);
     if (response.status !== 200) {
          return res.status(response.status).send(`Failed to fetch product with ID ${productId}`);
       }
    let productQuantity;
    if(response.data !== null && response.data.length > 0) {
      productQuantity = response.data;
    } else {
      productQuantity = [{
        product_id: productId,
        size: "",
        quantity: ""
      }];
    }
    
    res.render('admin/storage/editStorage', { productQuantity }); 
  } catch (error) {
    console.error('Error fetching product for edit:', error);
     res.status(500).send('Failed to fetch product for edit.');
  }
}

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

const renderProductDetails = async (req, res) => {
    const productId = req.params.id;
    try {
        const productResponse = await axios.get(`http://localhost:3000/api/product/${productId}`);
        if (productResponse.status !== 200) {
            return res.status(productResponse.status).send(`Failed to fetch product with ID ${productId}`);
        }
        const product = productResponse.data;

        const imagesResponse = await axios.get(`http://localhost:3000/api/product/image/${productId}`);
        if (imagesResponse.status !== 200) {
            return res.status(imagesResponse.status).send(`Failed to fetch product images with ID ${productId}`);
        }

        const images = imagesResponse.data;


        // Fetch all products
        const allProductsResponse = await axios.get(`http://localhost:3000/api/products`);
        if (allProductsResponse.status !== 200) {
             console.log("failed to fetch all products");
             relatedProducts = [];
        }
        let allProducts = allProductsResponse.data;

          // Fetch the category of the current product
          const categoryResponse = await axios.get(`http://localhost:3000/api/category/${product.categories._id}`);
          if(categoryResponse.status !== 200){
              throw new Error(`HTTP error! status: ${categoryResponse.status}`);
          }
         const categoryData = categoryResponse.data;
         const collectionId = categoryData.collection_id._id;


        // Filter related products by collection
        let relatedProducts = allProducts.filter(relatedProduct => {
             if(relatedProduct._id !== productId){
                  if(relatedProduct.categories){
                    return relatedProduct.categories._id.toString() === product.categories._id.toString();
                  }
                  return false
             }
             return false;
         });



        //Filter by collection id

        relatedProducts =  await Promise.all(relatedProducts.map(async (product) =>{
               const categoryResponse = await axios.get(`http://localhost:3000/api/category/${product.categories._id}`);
               if(categoryResponse.status !== 200){
                     throw new Error(`HTTP error! status: ${categoryResponse.status}`);
               }
               const categoryData =  categoryResponse.data;
                if(categoryData.collection_id._id.toString() === collectionId.toString()){
                    return product;
                }
                 return null;
           }));


           relatedProducts = relatedProducts.filter(product => product !== null);


        res.render('productDetails', { product, images, relatedProducts });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Failed to fetch product details.');
    }
};


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
    renderEditPage,
    renderEditQuantityPage,
    renderEditCollectionPage,
    renderProductDetails,
    renderProductSortByCategory
}
