const express = require("express");
const router = express.Router();
const workerController = require("../controllers/workerController");
const adminController = require("../controllers/adminController");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/workers", authenticateToken("admin"), workerController.listWorkers); // list tukang by admin route
router.post("/workers", authenticateToken("admin"), adminController.addWorker); // add tukang data for admin route
router.put("/workers/:id", authenticateToken("admin"), adminController.updateWorker); // update tukang data for admin route
router.delete("/workers/:id", authenticateToken("admin"), adminController.deleteWorker); // delete tukang data for admin route

module.exports = router;