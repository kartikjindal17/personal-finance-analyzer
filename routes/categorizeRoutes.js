const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    categorizeExpense

} = require("../controllers/categorizeController");

router.post(

    "/",

    protect,

    categorizeExpense

);

module.exports = router;