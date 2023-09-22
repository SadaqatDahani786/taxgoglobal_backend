/**
 ** ====================================
 ** IMPORTS
 ** ====================================
 */
const Router = require("express").Router();
const { calculateKenyaTaxes } = require("../Controllers/controllerKenya");

/**
 ** ====================================
 ** ROUTES
 ** ====================================
 */
Router.route("/").get(calculateKenyaTaxes);

/**
 ** ====================================
 ** EXPORTS
 ** ====================================
 */
module.exports = Router;
