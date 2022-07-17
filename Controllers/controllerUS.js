const TaxCalculator = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** TAX US CRITERIA
 ** ====================================
 */
const taxUSCriteria = {
  taxSlabs: [
    {
      from: "-",
      to: 14000,
      tax: 10.5,
    },
    {
      from: 14001,
      to: 48000,
      tax: 17.5,
    },
    {
      from: 48001,
      to: 70000,
      tax: 30,
    },
    {
      from: 70001,
      to: "more",
      tax: 33,
    },
  ],
  acc: 1.39,
  currency: "$",
};

/**
 ** ====================================
 ** CALCULATE US TAXES
 ** ====================================
 */
const calculateUSTaxes = (req, res) => {
  //Get income from query
  const income = req.query.income;

  //Instantiate tax calculator
  const TaxCalculatorUS = new TaxCalculator(
    income,
    taxUSCriteria.taxSlabs,
    taxUSCriteria.acc,
    taxUSCriteria.currency
  );

  //Check if income is a valid value
  if (!TaxCalculatorUS.isIncomeValid()) {
    return res.status(400).json({
      status: "failed",
      error_message: "Please provide a valid income value.",
    });
  }

  //Calculate Tax
  const calculatedTaxInfo = TaxCalculatorUS.calculateTax();

  //Send response back to the client
  res.status(200).json({
    status: "success",
    taxInfo: calculatedTaxInfo,
  });
};

/**
 ** ====================================
 ** EXPORTS
 ** ====================================
 */
module.exports.calculateUSTaxes = calculateUSTaxes;
