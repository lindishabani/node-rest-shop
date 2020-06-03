const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users")

const checkAuth = require("../middleware/check-auth")

router.post("/signup", UsersController.userSignup)
router.post("/login", UsersController.userLogin)
router.delete("/:userId", checkAuth, UsersController.userDelete)

module.exports = router