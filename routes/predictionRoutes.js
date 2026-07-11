const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    train,
    forecast,
    metrics
} = require("../controllers/predictionController");

router.post(
    "/train",
    protect,
    train
);

router.get(
    "/forecast",
    protect,
    forecast
);

router.get(
    "/metrics",
    protect,
    metrics
);

module.exports = router;