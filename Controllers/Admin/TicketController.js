const Ticket = require("../../Models/Admin/Ticket");
const Category = require("../../Models/Category");

// Show Ticket Form
exports.addTicket = async (req, res) => {
    // console.log(fs.readFileSync('/'));
    let category;
    try {
        category = await Category.find({});
    } catch (error) {
        category = error;
    }
    let meta = {
        title: pageTitle = "Add Ticket",
        url: req.protocol + '://' + req.get('host') + "/admin",
        category: category
    }
    res.render("Admin/Ticket/add-ticket", { meta });
}

// Save Ticket 
exports.addTicketPost = async (req, res) => {

    const words = req.body.ticket_name.trim().split(/\s+/);
    const maxWords = words.slice(0, 5); // select max 4 words
    const media_folder_name = maxWords.join('_').toLowerCase(); // join with underscore and convert to lowercase
    let list_image = [];
    if (req.files.list_image) {
        for (let j = 0; j < req.files.list_image.length; j++) {

            list_image.push(
                "images/uploads/ticket/" + media_folder_name + "/" + req.files.list_image[j].filename
            );
            // console.log("images/uploads/ticket/" + req.files.list_image[j].filename);
        }
    }
    const feature = [];
    if (req.body.spec_key) {
        for (let i = 0; i < req.body.spec_key.length; i++) {
            feature.push({
                key: req.body.spec_key[i],
                value: req.body.spec_value[i],
            });
        }
    }
    const rounds = [];
    if (req.body.round_qty) {
        for (let i = 0; i < req.body.round_qty.length; i++) {
            var roundKey = "round_" + (i + 1);
            rounds.push({
                [roundKey]: {
                    _qty: req.body.round_qty[i],
                    _price: req.body.round_price[i],
                    _dis: req.body.round_dis[i],
                    _time: req.body.round_time[i],
                    _status: true,
                },
            });
        }
    }
    // console.log(typeof rounds);
    var is_banner_image = "";
    var main_image = "";
    if (req.body.is_banner) {
        is_banner_image = "images/uploads/ticket/" + media_folder_name + "/" + req.files.is_banner_image[0].filename;
    }
    if (req.files.main_image) {
        main_image = "images/uploads/ticket/" + media_folder_name + "/" + req.files.main_image[0].filename;
    }

    const data = {
        ticket_name: req.body.ticket_name,
        ticket_price: req.body.ticket_price,
        discount_percentage: req.body.discount_percentage,
        currency: req.body.currency,
        ticket_quantity: req.body.ticket_quantity,
        time_left: req.body.time_left,
        main_image: main_image,
        list_image: list_image,

        description: req.body.description,
        // specification: req.body.key_feature,
        highlights: req.body.highlights,
        specification: feature,
        // key: req.body.features_key, value: req.body.features_value

        status: req.body.status,
        // is_promo: Boolean(req.body.is_promo),
        is_banner: Boolean(req.body.is_banner),
        banner_image: is_banner_image,
        // flag: Boolean(req.body.flag),
        category: req.body.category,
        rounds: rounds,
        // brand: req.body.brand,
        // country_id: req.body.country_id,
    }
    console.log(data);
    try {
        // Create a new Mongoose document using your model
        const ticket = new Ticket(data);
        // Save the document to the database
        const savedDoc = await ticket.save();
        console.log('Saved document:', savedDoc);
        // res.status(200).json({ Saved: data });
    } catch (error) {
        console.error('Error saving document:', error);
        // res.status(200).json({ Error: error });
    }



    let category;
    try {
        category = await Category.find({});
    } catch (error) {
        category = error;
    }

    // return;
    let meta = {
        title: pageTitle = "Add Ticket",
        url: req.protocol + '://' + req.get('host') + "/admin",
        category: category
    }
    res.render("Admin/Ticket/add-ticket", { meta });
}

// List Ticket
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

// Edit Ticket
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