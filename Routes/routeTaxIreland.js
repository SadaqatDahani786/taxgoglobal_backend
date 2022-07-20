/**
 ** ====================================
 ** IMPORTS
 ** ====================================
 */
const Router = require("express").Router();
const { calculateIrelandTaxes } = require("../Controllers/controllerIreland");

/**
 ** ====================================
 ** ROUTES
 ** ====================================
 */
Router.route("/").get(calculateIrelandTaxes);

/**
 ** ====================================
 ** EXPORTS
 ** ====================================
 */
module.exports = Router;
