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

  //5) Calculate PRSI
  const PRSI_TAX_PERCENT = 4;
  const MAX_PRSI_CREDIT = 12;
  const PRSI_LIMIT = 352.01;
  const PRSI_AGE_LIMIT = 66;
  const incomeWeekly = grossIncome / 26;

  const tax_credit = MAX_PRSI_CREDIT - (incomeWeekly - PRSI_LIMIT) / 6; //A credit will reduce the tax amount
  const prsi =
    age >= PRSI_AGE_LIMIT || incomeWeekly <= PRSI_LIMIT - 0.01
      ? 0
      : ((incomeWeekly * PRSI_TAX_PERCENT) / 100 - tax_credit) * 26; //multiply by 26 to go to anunual tax

  //6) Return tax rates
  return {
    taxSlabs,
    prsi,
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

  //Transform Data
  const taxInfo = {
    usc: parseFloat(calculatedTaxInfo.ncc.totalTax).toFixed(2),
    prsi: parseFloat(taxRates.prsi).toFixed(2),
    tax: parseFloat(calculatedTaxInfo.totalTax).toFixed(2),
    tax_breakup: calculatedTaxInfo.slabWiseTax,
    deduction: parseFloat(
      calculatedTaxInfo.totalTax +
        calculatedTaxInfo.ncc.totalTax +
        taxRates.prsi
    ).toFixed(2),
    gross_income: parseFloat(calculatedTaxInfo.income).toFixed(2),
    net_income: parseFloat(
      calculatedTaxInfo.income -
        (calculatedTaxInfo.totalTax +
          calculatedTaxInfo.ncc.totalTax +
          taxRates.prsi)
    ).toFixed(2),
    currency: calculatedTaxInfo.currency,
  };

  //5) Send response back to the client
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
module.exports.calculateIrelandTaxes = calculateIrelandTaxes;
