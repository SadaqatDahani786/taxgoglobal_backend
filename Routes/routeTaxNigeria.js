/**
 ** ====================================
 ** IMPORTS
 ** ====================================
 */
const Router = require("express").Router();
const { calculateNigeriaTaxes } = require("../Controllers/controllerNigeria");

/**
 ** ====================================
 ** ROUTES
 ** ====================================
 */
Router.route("/").get(calculateNigeriaTaxes);

/**
 ** ====================================
 ** EXPORTS
 ** ====================================
 */
module.exports = Router;
