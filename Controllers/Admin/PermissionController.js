const Roles = require('../../Models/Admin/Roles');
const fs = require('fs');
const bcrypt = require("bcrypt");
const Admin = require("../../Models/Admin/Admin");
const TKT = require("../../Models/Admin/Ticket2");

exports.Permission = async (req, res) => {
    // console.log(req.body);
    const rout = JSON.parse(fs.readFileSync('./public/routs.json'));
    const roles = await Roles.find({});
    let category = [];
    let meta = {
        title: pageTitle = "Manage Permission",
        url: req.protocol + '://' + req.get('host') + "/admin",
        category: category
    }
    // console.log(rout);
    res.render("Admin/Permission/view-permission", { meta, rout, roles });
}

exports.CreatePermission = async (req, res) => {
    // 
    console.log(req.body);
    const role = new Roles({
        permission_type: req.body.permission_name,
        allowedRoutes: req.body.allowed_route,
    });
    const resp = await role.save();
    res.status(200).json(resp);

}

exports.CreateAdminGroup = async (req, res) => {
    console.log(req.body);
    // return;
    try {
        var email = "";
        var phone = "";
        const hashedPassword = await bcrypt.hash('password', 10);
        if (req.body.type == 'phone') {
            phone = req.body.emailOrPhone;
        }
        if (req.body.type == 'email') {
            email = req.body.emailOrPhone;
        }
        console.log({
            full_name: req.body.user_name,
            email: email,
            phone: phone,
            role: req.body.allowed_route,
            password: hashedPassword,
        });
        // return;
        const user = new Admin({
            full_name: req.body.user_name,
            email: email,
            phone: phone,
            role: req.body.allowed_route,
            password: hashedPassword,
        });
        const savedUser = await user.save();
        res.redirect('/admin/admin-group');
        // res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.AddPermission = async (req, res) => {
    // console.log(req.body);
    const role = new Roles({
        permission_type: req.body.permission_type,
        allowedRoutes: req.body.allowedRoutes,
    });
    const resp = await role.save();
    res.status(200).json(resp);
}
