const express = require("express");
const router = express.Router();
const auth = require("../Middleware/AuthUser");
const userCtrl = require("../Controllers/UserController");

// temporary routes
router.get("/get-tickets", userCtrl.allTickets);
router.get("/get-tickets/:id", userCtrl.ticketById);
module.exports = router;
