const express = require("express");

const router = express.Router();

const multer = require("multer");

const protect = require("../middleware/authMiddleware");

const {

    uploadCSV

} = require("../controllers/uploadController");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        cb(null, Date.now() + "-" + file.originalname);

    }

});

const upload = multer({

    storage

});

router.post(

    "/csv",

    protect,

    upload.single("file"),

    uploadCSV

);

module.exports = router;