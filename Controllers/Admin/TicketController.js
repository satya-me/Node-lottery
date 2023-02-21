const Ticket = require("../../Models/Admin/Ticket");


exports.addTicket = (req, res) => {
    // 
    res.status(200).json("addTicket")
}

exports.listTicket = async (req, res) => {
    if (!req.session.user) {
        let meta = {
            title: pageTitle = "Login",
            url: req.protocol + '://' + req.get('host') + "/admin"
        }
        var errorMessage = '';
        res.render("Admin/auth/login", { errorMessage, meta });
    }

    let meta = {
        title: pageTitle = "List Ticket",
        url: req.protocol + '://' + req.get('host') + "/admin"
    }

    const tickets = await Ticket.find({});
    res.render("Admin/Ticket/list-tickets", { meta, tickets });
}

exports.editTicket = async (req, res) => {
    if (!req.session.user) {
        let meta = {
            title: pageTitle = "Login",
            url: req.protocol + '://' + req.get('host') + "/admin"
        }
        var errorMessage = '';
        res.render("Admin/auth/login", { errorMessage, meta });
    }

    let meta = {
        title: pageTitle = "Edit Ticket",
        url: req.protocol + '://' + req.get('host') + "/admin"
    }

    // const tickets = await Ticket.find({ _id: 12 });
    // console.log(tickets);
    res.render("Admin/Ticket/edit-ticket", { meta });
}