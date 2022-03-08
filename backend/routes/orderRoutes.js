const express = require("express");
const router = express.Router()
const { newOrder, getSingleOrder, myOrders, GetAllOrders, deleteOrder, updateOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorisedRole } = require("../middleware/auth")




router.route('/order/new').post(isAuthenticatedUser,newOrder)

router.route('/orders/:id').get(isAuthenticatedUser,authorisedRole("admin"),getSingleOrder);

router.route("/myOrders").get(isAuthenticatedUser,myOrders);

router.route('/admin/orders').get(isAuthenticatedUser,authorisedRole("admin"),GetAllOrders);

router.route('/admin/order/:id')
.put(isAuthenticatedUser,authorisedRole("admin"),updateOrder)
.delete(isAuthenticatedUser,authorisedRole("admin"),deleteOrder)

module.exports = router;