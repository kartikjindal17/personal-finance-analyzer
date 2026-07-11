const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    detect,
    metrics,
    train
} = require("../controllers/anomalyController");

router.get(
    "/detect",
    protect,
    detect
);

router.get(
    "/metrics",
    protect,
    metrics
);

router.post(
    "/train",
    protect,
    train
);

module.exports = router;