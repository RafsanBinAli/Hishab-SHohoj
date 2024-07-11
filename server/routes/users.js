var express = require("express");
var router = express.Router();
const memberController = require("../controllers/member.Controller");
const { isAuthenticated } = require("../middlewares/authentication");
const {isAdmin} = require("../middlewares/isAdmin")

router.post("/login", memberController.loginUser);
router.post("/signup", isAuthenticated,isAdmin, memberController.signUpUser);
module.exports = router;
