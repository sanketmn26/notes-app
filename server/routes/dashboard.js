const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboardController")

router.get('/dashboard', dashboardController.dashboard)

module.exports = router;