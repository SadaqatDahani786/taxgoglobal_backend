const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** France Tax Rates
 ** ====================================
 */
const taxRatesFrance = [
  //2020-21
  {
    taxSlabs: [
      [
        {
          from: "less",
          to: 10064,
          tax: 0,
        },
        {
          from: 10065,
          to: 25659,
          tax: 11,
        },
        {
          from: 25660,
          to: 73369,
          tax: 30,
        },
        {
          from: 73370,
          to: 157806,
          tax: 41,
        },
        {
          from: 157807,
          to: "more",
          tax: 45,
        },
      ],
      [
        {
          from: 250001,
          to: 500000,
          tax: 3,
        },
        {
          from: 500001,
          to: "more",
          tax: 5,
        },
      ],
    ],
    csg: {
      deductable: 6.8,
      non_deductable: 2.4,
    },
    crds: 0.5,
    year: "2020/21",
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear, filingStatus, noOfChilds) => {
  //1) Find the tax rates of the year given
  const taxRate = taxRatesFrance.find((rate) => rate.year === taxYear);

  //2) Calc no of shares per household
  let shares = filingStatus === "Single" ? 1 : 2 + noOfChilds * 0.5;

  //3) Calc CSG
  const csgDeducatable =
    (((grossIncome * 97) / 100) * taxRate.csg.deductable) / 100;
  const csgNonDeducatable =
    (((grossIncome * 97) / 100) * taxRate.csg.non_deductable) / 100;
  const csg = parseFloat(csgDeducatable) + parseFloat(csgNonDeducatable);

  //4) Calc CRDS
  const crds = (((grossIncome * 97) / 100) * taxRate.crds) / 100;

  //3) Calc taxable income
  const taxableIncome = grossIncome / shares - csgDeducatable;

  return {
    taxableIncome,
    csg,
    crds,
    taxSlabs: taxRate.taxSlabs,
    currency: "€",
  };
};

/**
 ** ====================================
 ** CALCULATE FRANCE TAXES
 ** ====================================
 */
const calculateFranceTaxes = (req, res) => {
  //1) Get params from query
  const income = req.query.income;
  const taxYear = req.query["tax-year"];
  const filingStatus = req.query["filing-status"];
  const noOfChilds = req.query["number-of-childs"];

  //2) Get tax rates for the given year
  const taxRates = getTaxRates(income, taxYear, filingStatus, noOfChilds);

  //3) Check if income is a valid value
  if (!isIncomeValid(income)) {
    return res.status(400).json({
      status: "failed",
      error_message: "Please provide a valid income value.",
    });
  }

  //4) Calculate Tax
  const calculatedTaxInfo = calculateTax(
    taxRates.taxableIncome,
    taxRates.taxSlabs
  );

  //5) Transform Data
  const taxInfo = {
    tax: calculatedTaxInfo[0].totalTax.toFixed(2),
    tax_breakup: calculatedTaxInfo[0].slabWiseTax,
    surcharges: calculatedTaxInfo[1].totalTax.toFixed(2),
    csg: parseFloat(taxRates.csg).toFixed(2),
    crds: parseFloat(taxRates.crds).toFixed(2),
    deduction: (
      parseFloat(calculatedTaxInfo[0].totalTax) +
      parseFloat(calculatedTaxInfo[1].totalTax) +
      parseFloat(taxRates.csg) +
      parseFloat(taxRates.crds)
    ).toFixed(2),
    gross_income: parseFloat(income).toFixed(2),
    net_income: (
      parseFloat(income) -
      parseFloat(calculatedTaxInfo[0].totalTax) -
      parseFloat(calculatedTaxInfo[1].totalTax) -
      parseFloat(taxRates.csg) -
      parseFloat(taxRates.crds)
    ).toFixed(2),
    currency: taxRates.currency,
  };

  //6) Send a response
  res.status(200).json({
    status: "success",
    taxInfo,
  });
};

/**
 ** ====================================
 ** EXPORTS
 ** ====================================
 */
module.exports.calculateFranceTaxes = calculateFranceTaxes;
