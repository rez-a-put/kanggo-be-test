const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/orders", authenticateToken("customer"), orderController.createOrder); // order tukang route
router.get("/orders", authenticateToken("customer"), orderController.listOrders); // list transaksi route
router.put("/cancel_order/:id", authenticateToken("customer"), orderController.cancelOrder); // cancel order route

module.exports = router;