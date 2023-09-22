/**
 ** ====================================
 ** IMPORTS
 ** ====================================
 */
const Router = require("express").Router();
const { calculateFranceTaxes } = require("../Controllers/controllerFrance");

/**
 ** ====================================
 ** ROUTES
 ** ====================================
 */
Router.route("/").get(calculateFranceTaxes);

/**
 ** ====================================
 ** EXPORTS
 ** ====================================
 */
module.exports = Router;
