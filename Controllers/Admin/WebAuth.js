const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../Models/Admin/Admin");
const fs = require("fs");
const path = require("path");
const d = new Date();


// render the login page
exports.getLogin = (req, res) => {
    let meta = {
        title: pageTitle = "Login",
        url: req.protocol + '://' + req.get('host') + "/admin"
    }
    var errorMessage = '';
    res.render("Admin/auth/login", { errorMessage, meta });
};

// handle the login form submission
exports.postLogin = async (req, res) => {
    let meta = {
        title: pageTitle = "Login",
        url: req.protocol + '://' + req.get('host') + "/admin"
    }
    var errorMessage = "";
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {
        errorMessage = 'Invalid email or password';
        return res.render('Admin/auth/login', { errorMessage, meta });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        errorMessage = 'Invalid password';
        return res.render('Admin/auth/login', { errorMessage, meta });
    }

    req.session.user = user;
    res.redirect('/admin/home');
};


// handle the logout
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
};