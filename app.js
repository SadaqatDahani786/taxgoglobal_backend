/**
 ** ====================================
 ** IMPORTS
 ** ====================================
 */
const express = require("express");
const cors = require("cors");

//Routers
const RouterAmerica = require("./Routes/routeTaxAmerica");
const RouterCanada = require("./Routes/routeTaxCanada");
const RouterFrance = require("./Routes/routeTaxFrance");
const RouterHongKong = require("./Routes/routeTaxHongKong");
const RouterIreland = require("./Routes/routeTaxIreland");
const RouterKenya = require("./Routes/routeTaxKenya");
const RouterNetherland = require("./Routes/routeTaxNetherland");
const RouterNigeria = require("./Routes/routeTaxNigeria");
const RouterSerbia = require("./Routes/routeTaxSerbia");
const RouterSouthAfrica = require("./Routes/routeTaxSouthAfrica");
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
app.use(`${API_ENDPOINT}/calculate-tax/america`, RouterAmerica);
app.use(`${API_ENDPOINT}/calculate-tax/canada`, RouterCanada);
app.use(`${API_ENDPOINT}/calculate-tax/france`, RouterFrance);
app.use(`${API_ENDPOINT}/calculate-tax/hong-kong`, RouterHongKong);
app.use(`${API_ENDPOINT}/calculate-tax/ireland`, RouterIreland);
app.use(`${API_ENDPOINT}/calculate-tax/kenya`, RouterKenya);
app.use(`${API_ENDPOINT}/calculate-tax/netherland`, RouterNetherland);
app.use(`${API_ENDPOINT}/calculate-tax/nigeria`, RouterNigeria);
app.use(`${API_ENDPOINT}/calculate-tax/serbia`, RouterSerbia);
app.use(`${API_ENDPOINT}/calculate-tax/south-africa`, RouterSouthAfrica);
app.use(`${API_ENDPOINT}/calculate-tax/uk`, RouterUK);

/**
 ** ====================================
 ** HTTP SERVER
 ** ====================================
 */
app.listen(PORT_NO, () => {
  console.log(`Web Server Running On Port:\t\t[${PORT_NO}]`);
});
