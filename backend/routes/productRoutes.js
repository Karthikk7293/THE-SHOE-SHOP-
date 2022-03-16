const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetials, createProductReview, getProductReviews, DeleteReview } = require('../controllers/productControllers');
const { isAuthenticatedUser, authorisedRole } = require('../middleware/auth');

const router = express.Router()

router.route('/products').get(getAllProducts)

router.route('/admin/products/new').post(isAuthenticatedUser, authorisedRole("admin"), createProduct)

router.route('/admin/products/:id')
    .put(isAuthenticatedUser,authorisedRole("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorisedRole("admin"), deleteProduct)
   

router.route('/product/:id').get(getProductDetials)

router.route('/products/review').put(isAuthenticatedUser,createProductReview)

router.route('/review').get(getProductReviews).delete(isAuthenticatedUser,authorisedRole("admin"),DeleteReview)




module.exports = router;