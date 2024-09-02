const express = require("express");
const router = express.Router();
const workerController = require("../controllers/workerController");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/workers", workerController.listWorkers); // list tukang route

module.exports = router;