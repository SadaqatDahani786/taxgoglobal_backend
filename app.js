/**
 ** ====================================
 ** IMPORTS
 ** ====================================
 */
const express = require("express");
const cors = require("cors");

//Routers
const RouterUS = require("./Routes/routeTaxUs");

/**
 ** ====================================
 ** INIT
 ** ====================================
 */
const app = express();
const PORT_NO = 5000;
const API_ENDPOINT = "/api/v1";

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
app.use(`${API_ENDPOINT}/calculate-tax/us`, RouterUS);

/**
 ** ====================================
 ** HTTP SERVER
 ** ====================================
 */
app.listen(PORT_NO, () => {
  console.log(`Web Server Running On Port:\t\t[${PORT_NO}]`);
});
