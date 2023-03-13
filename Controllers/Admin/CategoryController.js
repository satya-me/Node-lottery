const Category = require("../../Models/Category");

// Show Category Form
exports.addCategory = async (req, res) => {
    // console.log(fs.readFileSync('/'));
    let category;
    try {
        category = await Category.find({});
    } catch (error) {
        category = error;
    }
    let meta = {
        title: pageTitle = "Add Category",
        url: req.protocol + '://' + req.get('host') + "/admin",
        category: category
    }
    res.render("Admin/Category/add-category", { meta });
}

exports.addCategoryPost = async (req, res) => {
    const words = req.body.category_name.trim().split(/\s+/);
    const maxWords = words.slice(0, 5); // select max 4 words
    const media_folder_name = maxWords.join('_').toLowerCase(); // join with underscore and convert to lowercase
    try {
        const category = new Category({
            name: req.body.category_name,
            image: "images/uploads/category/" + media_folder_name + "/" + req.files.category_image[0].filename,
        });
        // Save the document to the database
        const savedDoc = await category.save();
        // console.log('Saved document:', savedDoc);
        res.status(200).json({ Saved: savedDoc });
    } catch (error) {
        // console.error('Error saving document:', error);
        res.status(200).json({ Error: error });
    }
}