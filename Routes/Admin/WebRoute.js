const express = require("express");
const router = express.Router();
const UseLess = require("../../Middleware/UseLess");
const multer = require("../../Middleware/multer");
const auth = require("../../Middleware/AuthAdmin");
const adminCtrl = require("../../Controllers/Admin/Home");
const ticketCtrl = require("../../Controllers/Admin/TicketController");
const categoryCtrl = require("../../Controllers/Admin/CategoryController");
const permission = require("../../Controllers/Admin/PermissionController");


const authController = require('../../Controllers/Admin/WebAuth');
const authMiddleware = require('../../Middleware/CheckSession');

const Gatekeeper = require('../../Middleware/Gatekeeper');
const Category = require("../../Models/Category");


// login page route
router.get('/login', authMiddleware.redirectToDashboard, authController.getLogin);
router.post('/login', authController.postLogin);


// logout route
router.get('/logout', authController.logout);


router.get("/", Gatekeeper.authMiddleware, adminCtrl.home);
router.get("/home", Gatekeeper.authMiddleware, adminCtrl.home);

// Ticket
router.get("/add-ticket", Gatekeeper.authMiddleware, ticketCtrl.addTicket);
router.post("/add-ticket",
    Gatekeeper.authMiddleware,
    multer.singleImageUpload.fields([
        { name: "main_image", maxCount: 1 },
        { name: "list_image", maxCount: 5 },
        { name: "is_banner_image", maxCount: 1 },
    ]),
    ticketCtrl.addTicketPost);

router.get("/list-ticket", Gatekeeper.authMiddleware, ticketCtrl.listTicket);
router.get("/edit-ticket/:id", Gatekeeper.authMiddleware, ticketCtrl.editTicket);

// Category
router.get("/add-category", Gatekeeper.authMiddleware, categoryCtrl.addCategory);
router.post("/add-category",
    Gatekeeper.authMiddleware,
    multer.singleImageUpload.fields([
        { name: "category_image", maxCount: 1 },
    ]),
    categoryCtrl.addCategoryPost);


// Permission Routes
router.get("/admin-group", permission.Permission);
router.post("/create-group", UseLess, Gatekeeper.authMiddleware, permission.CreatePermission);
router.post('/create-admin-group', UseLess, Gatekeeper.authMiddleware, permission.CreateAdminGroup);
router.post("/manage/permission/add", permission.AddPermission);

module.exports = router;
