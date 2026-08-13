const express = require("express");
const router = express.Router();
const { protect } = require("../Controller/Authmiddleware");
const {
getAllUsers 
} = require("../Controller/Usercontroller.js");

router.get("/getalluser", getAllUsers)




module.exports = router;