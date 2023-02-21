const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../Models/Admin/Admin");
const fs = require("fs");
const path = require("path");
const d = new Date();

exports.home = async (req, res) => {
    console.log('User email:', req.session.user);

    if (!req.session.user) {
        let meta = {
            title: pageTitle = "Login",
            url: req.protocol + '://' + req.get('host') + "/admin"
        }
        var errorMessage = '';
        res.render("Admin/auth/login", { errorMessage, meta });
    }
    let meta = {
        title: pageTitle = "Home",
        url: req.protocol + '://' + req.get('host') + "/admin"
    }
    res.render("Admin/home", { meta, name: "Satya", color: "blue" });



}

exports.about = async (req, res) => {
    let pageTitle = "About";
    res.render("Admin/about", { meta, name: "Satya", color: "blue" });
}

