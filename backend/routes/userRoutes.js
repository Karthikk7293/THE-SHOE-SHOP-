const express = require ("express");
const { route } = require("express/lib/application");
const { registerUser, loginUser, logout, getAllUsers ,blockUser, unblockUser, forgotPassword, getUserDetails, updateUserPassword, updateUserProfile, getSingleUser, updateUserRole, DeleteUser } = require("../controllers/userController")
const { isAuthenticatedUser, authorisedRole } = require("../middleware/auth")
const router = express.Router()

router.route('/createUser').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').get(logout);

router.route('/password/forgot').post(forgotPassword)

router.route('/admin/allUsers').get(isAuthenticatedUser,authorisedRole("admin"),getAllUsers);

router.route('/admin/blockUser/:id').put(blockUser);

router.route('/admin/unblockUser/:id').put(unblockUser);

router.route('/me').get( isAuthenticatedUser, getUserDetails);

router.route('/password/update').put(isAuthenticatedUser,updateUserPassword)

router.route('/me/update').put(isAuthenticatedUser,updateUserProfile)

router.route('/admin/user/:id')
.get(isAuthenticatedUser,authorisedRole("admin"),getSingleUser)
.put(isAuthenticatedUser,authorisedRole("admin"),updateUserRole)
.delete(isAuthenticatedUser,authorisedRole("admin"),DeleteUser)


module.exports = router ;