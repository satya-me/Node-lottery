const fs = require('fs');
const Roles = require('../Models/Admin/Roles');

exports.authMiddleware = async (req, res, next) => {
    // check if user is authenticated
    if (!req.session.user) {
        return res.redirect('/admin/login');
    }

    // load roles from file
    const allRole = await Roles.find({});
    const result = allRole.reduce((acc, item) => {
        acc[item.permission_type] = { allowedRoutes: item.allowedRoutes }
        return acc
    }, {})

    // const roles = JSON.parse(fs.readFileSync('./public/roles.json'));
    const roles = result;

    // check user's role and grant access accordingly
    const userRole = req.session.user.role;
    const allowedRoutes = roles[userRole].allowedRoutes;
    // console.log(allowedRoutes);

    if (allowedRoutes.includes('*') || allowedRoutes.includes(req.url)) {
        // user has permission to access the route
        return next();
    } else {
        // user does not have permission to access the route
        return res.status(403).send('Access denied');
    }
};
