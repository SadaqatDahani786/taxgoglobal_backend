const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** Ireland Tax Rates
 ** ====================================
 */
const taxRatesIreland = [
  //2022-23
  {
    singleTaxSlabs: [
      {
        from: "less",
        to: 36800,
        tax: 20,
      },
      {
        from: 36801,
        to: "over",
        tax: 40,
      },
    ],
    marriedSingleIncomeTaxSlabs: [
      {
        from: "less",
        to: 45800,
        tax: 20,
      },
      {
        from: 45801,
        to: "over",
        tax: 40,
      },
    ],
    oneParentFamilyTaxSlabs: [
      {
        from: "less",
        to: 40800,
        tax: 20,
      },
      {
        from: 40801,
        to: "over",
        tax: 40,
      },
    ],
    usc: [
      {
        from: "less",
        to: 12012,
        tax: 0.5,
      },
      {
        from: 12013,
        to: 21295,
        tax: 2,
      },
      {
        from: 21296,
        to: 70044,
        tax: 4.5,
      },
      {
        from: 21296,
        to: "over",
        tax: 8,
      },
    ],
    uscReduced: [
      {
        from: "less",
        to: 12012,
        tax: 0.5,
      },
      {
        from: 12013,
        to: "over",
        tax: 2,
      },
    ],
    uscLimit: 13000,
    year: ["2022/23"],
  },
  //2021-22 / 2020-21 / 2019/20
  {
    singleTaxSlabs: [
      {
        from: "less",
        to: 35300,
        tax: 20,
      },
      {
        from: 35301,
        to: "over",
        tax: 40,
      },
    ],
    marriedSingleIncomeTaxSlabs: [
      {
        from: "less",
        to: 44300,
        tax: 20,
      },
      {
        from: 44301,
        to: "over",
        tax: 40,
      },
    ],
    oneParentFamilyTaxSlabs: [
      {
        from: "less",
        to: 39300,
        tax: 20,
      },
      {
        from: 39301,
        to: "over",
        tax: 40,
      },
    ],
    usc: [
      {
        from: "less",
        to: 12012,
        tax: 0.5,
      },
      {
        from: 12013,
        to: 20687,
        tax: 2,
      },
      {
        from: 20688,
        to: 70044,
        tax: 4.5,
      },
      {
        from: 70045,
        to: "over",
        tax: 8,
      },
    ],
    uscReduced: [
      {
        from: "less",
        to: 12012,
        tax: 0.5,
      },
      {
        from: 12013,
        to: 20687,
        tax: 2,
      },
    ],
    uscLimit: 13000,
    year: ["2021/22", "2020/21", "2019/20"],
  },
  //2018-19
  {
    singleTaxSlabs: [
      {
        from: "less",
        to: 34550,
        tax: 20,
      },
      {
        from: 34551,
        to: "over",
        tax: 40,
      },
    ],
    marriedSingleIncomeTaxSlabs: [
      {
        from: "less",
        to: 43550,
        tax: 20,
      },
      {
        from: 43551,
        to: "over",
        tax: 40,
      },
    ],
    oneParentFamilyTaxSlabs: [
      {
        from: "less",
        to: 38550,
        tax: 20,
      },
      {
        from: 38551,
        to: "over",
        tax: 40,
      },
    ],
    usc: [
      {
        from: "less",
        to: 12012,
        tax: 0.5,
      },
      {
        from: 12013,
        to: 18772,
        tax: 2,
      },
      {
        from: 18773,
        to: 70044,
        tax: 5,
      },
      {
        from: 70045,
        to: "over",
        tax: 8,
      },
    ],
    uscReduced: [
      {
        from: "less",
        to: 12012,
        tax: 0.5,
      },
      {
        from: 12013,
        to: 18772,
        tax: 2,
      },
    ],
    uscLimit: 13000,
    year: ["2018/19"],
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear, filingStatus, age) => {
  //1) Find the tax rates of the year given
  const taxRate = taxRatesIreland.find((rate) => rate.year.includes(taxYear));

  //2) Find tax band based on filing status
  let taxSlabs;
  switch (filingStatus) {
    case "One Parent Family":
      taxSlabs = taxRate.oneParentFamilyTaxSlabs;
      break;
    case "Marriend - One Income":
      taxSlabs = taxRate.marriedSingleIncomeTaxSlabs;
      break;
    default:
      taxSlabs = taxRate.singleTaxSlabs;
  }

  //3) Determine wether use reduced rates or no for usc
  const taxRateUSC =
    age > 70 && grossIncome <= 60000 ? taxRate.uscReduced : taxRate.usc;

  //4) If income greater than limit, send usc for calculation, else do nothing
  if (grossIncome > taxRate.uscLimit) {
    taxSlabs = [taxSlabs, taxRateUSC];
  }

  //5) Return tax rates
  return {
    taxSlabs,
    acc: taxRate.acc,
    currency: "£",
  };
};

/**
 ** ====================================
 ** CALCULATE UK TAXES
 ** ====================================
 */
const calculateIrelandTaxes = (req, res) => {
  //1) Get params from query
  const income = req.query.income;
  const taxYear = req.query["tax-year"];
  const filingStatus = req.query["filing-status"];
  const age = req.query.age;

  //2) Get tax rates for the given year
  const taxRates = getTaxRates(income, taxYear, filingStatus, age);

  //3) Check if income is a valid value
  if (!isIncomeValid(income)) {
    return res.status(400).json({
      status: "failed",
      error_message: "Please provide a valid income value.",
    });
  }

  //4) Calculate Tax
  const calculatedTaxInfo = calculateTax(
    income,
    taxRates.taxSlabs,
    taxRates.acc,
    taxRates.currency
  );

  //5) Send response back to the client
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
module.exports.calculateIrelandTaxes = calculateIrelandTaxes;
