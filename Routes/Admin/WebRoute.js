const express = require("express");
const router = express.Router();
const multer = require("../../Middleware/multer");
const auth = require("../../Middleware/AuthAdmin");
const adminCtrl = require("../../Controllers/Admin/Home");
const ticketCtrl = require("../../Controllers/Admin/TicketController");

const authController = require('../../Controllers/Admin/WebAuth');
const authMiddleware = require('../../Middleware/CheckSession');


// login page route
router.get('/login', authMiddleware.redirectToDashboard, authController.getLogin);
router.post('/login', authController.postLogin);

// logout route
router.get('/logout', authController.logout);


router.get("/", authMiddleware.checkSession, adminCtrl.home);
router.get("/home", authMiddleware.checkSession, adminCtrl.home);

router.get("/add-ticket", ticketCtrl.addTicket);
router.get("/list-ticket", ticketCtrl.listTicket);
router.get("/edit-ticket/:id", ticketCtrl.editTicket);

module.exports = router;
