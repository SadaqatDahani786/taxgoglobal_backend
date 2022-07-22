/**
 ** ====================================
 ** IMPORTS
 ** ====================================
 */
const express = require("express");
const cors = require("cors");

//Routers
const RouterIreland = require("./Routes/routeTaxIreland");
const RouterNetherland = require("./Routes/routeTaxNetherland");
const RouterUK = require("./Routes/routeTaxUk");

/**
 ** ====================================
 ** INIT & VARS
 ** ====================================
 */
const PORT_NO = 5000;
const API_ENDPOINT = "/api/v1";
const app = express();

/**
 ** ====================================
 ** MIDDLEWARES
 ** ====================================
 */
app.use(cors({ origin: "*" }));

/**
 ** ====================================
 ** ROUTERS
 ** ====================================
 */
app.use(`${API_ENDPOINT}/calculate-tax/ireland`, RouterIreland);
app.use(`${API_ENDPOINT}/calculate-tax/netherland`, RouterNetherland);
app.use(`${API_ENDPOINT}/calculate-tax/uk`, RouterUK);

/**
 ** ====================================
 ** HTTP SERVER
 ** ====================================
 */
app.listen(PORT_NO, () => {
  console.log(`Web Server Running On Port:\t\t[${PORT_NO}]`);
});
