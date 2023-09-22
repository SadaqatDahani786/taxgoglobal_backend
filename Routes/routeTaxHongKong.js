/**
 ** ====================================
 ** IMPORTS
 ** ====================================
 */
const Router = require("express").Router();
const { calculateHongKongTaxes } = require("../Controllers/contollerHongKong");

/**
 ** ====================================
 ** ROUTES
 ** ====================================
 */
Router.route("/").get(calculateHongKongTaxes);

/**
 ** ====================================
 ** EXPORTS
 ** ====================================
 */
module.exports = Router;
