// redirect to dashboard if the user is already logged in
exports.redirectToDashboard = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/admin');
    }
    next();
};

// check if the user has an active session
exports.checkSession = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/admin/login');
    }
    next();
};