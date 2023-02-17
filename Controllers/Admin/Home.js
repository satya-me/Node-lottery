const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const Admin = require("../../Models/Admin/Admin");
const Ticket = require("../../Models/Admin/Ticket");
const Category = require("../../Models/Category");
const fs = require("fs");
const path = require("path");
const { find } = require("../../Models/Admin/Admin");
const d = new Date();
const User = require("../../Models/Admin/Admin")

exports.home = async (req, res) => {

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

exports.loginForn = async (req, res) => {
    let meta = {
        title: pageTitle = "Home",
        url: req.protocol + '://' + req.get('host') + "/admin"
    }
    res.render("Admin/auth/login", { meta, name: "Satya", color: "blue" });
}

exports.login = async (req, res) => {

    const { email, password } = req.body;
    // console.log(user);
    // return;
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Email or password is incorrect');
    }

    // Verify the user's password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(400).send('Email or password is incorrect');
    }

    req.session.user = user;
    res.status(200).json(user);

    // Set the user session

    // res.redirect('/dashboard');
}