const express = require("express");
const router = express.Router();
const configCtrl = require("../Controllers/ConfigController");
const countries_cities = require("../Controllers/CountriesCitiesController");

router.get("/setting/config", configCtrl.getSettingConfig);

router.get("/countries", countries_cities.countries);
router.get("/state/:id", countries_cities.state);

module.exports = router;
