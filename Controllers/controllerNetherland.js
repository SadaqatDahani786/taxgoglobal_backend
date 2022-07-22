const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** Netherland Tax Rates
 ** ====================================
 */
const taxRatesNetherland = [
  //2022-23
  {
    taxSlabs: [
      {
        from: "less",
        to: 69399,
        tax: 37.07,
      },
      {
        from: 69400,
        to: "more",
        tax: 49.5,
      },
    ],
    taxSlabsRetiredPerson: [
      {
        from: "less",
        to: 35473,
        tax: 19.17, //19.17-35.58 (Depending on the month) -> No clue how it works, go no info on net
      },
      {
        from: 35474,
        to: 69399,
        tax: 37.07,
      },
      {
        from: 69400,
        to: "more",
        tax: 49.5,
      },
    ],
    taxSlabsRetiredPersonSpecial: [
      {
        from: "less",
        to: 36410,
        tax: 19.17,
      },
      {
        from: 36411,
        to: 69399,
        tax: 37.07,
      },
      {
        from: 69400,
        to: "more",
        tax: 49.5,
      },
    ],
    year: "2022/23",
  },
  //2019-20
  {
    taxSlabs: [
      {
        from: "less",
        to: 20384,
        tax: 36.65,
      },
      {
        from: 20385,
        to: 34300,
        tax: 38.1,
      },
      {
        from: 34301,
        to: 68507,
        tax: 38.1,
      },
      {
        from: 68508,
        to: "more",
        tax: 51.75,
      },
    ],
    taxSlabsRetiredPerson: [
      {
        from: "less",
        to: 20384,
        tax: 18.75,
      },
      {
        from: 20385,
        to: 34300,
        tax: 20.2,
      },
      {
        from: 34301,
        to: 68507,
        tax: 38.1,
      },
      {
        from: 68508,
        to: "more",
        tax: 51.75,
      },
    ],
    taxSlabsRetiredPersonSpecial: [
      {
        from: "less",
        to: 20384,
        tax: 18.75,
      },
      {
        from: 20385,
        to: 34817,
        tax: 20.2,
      },
      {
        from: 34818,
        to: 68507,
        tax: 38.1,
      },
      {
        from: 68508,
        to: "more",
        tax: 51.75,
      },
    ],
    generalTaxCredit: {
      taxCredit: {
        maxCredit: 2477,
        maxWage: 20384,
        creditPercent: 5.147,
      },
      taxCreditRetiredPerson: {
        maxCredit: 1268,
        maxWage: 20384,
        creditPercent: 2.633,
      },
      taxCreditRetiredPersonSpecial: {
        maxCredit: 1268,
        maxWage: 20384,
        creditPercent: 2.633,
      },
    },
    labourTaxCredit: {
      taxCredit: {
        maxCredit: 3399,
        maxWage: 34060,
        creditPercent: 6,
      },
      taxCreditRetiredPerson: {
        maxCredit: 1740,
        maxWage: 34060,
        creditPercent: 3.069,
      },
      taxCreditRetiredPersonSpecial: {
        maxCredit: 1740,
        maxWage: 34060,
        creditPercent: 3.069,
      },
    },
    year: "2019/20",
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear, age) => {
  //Retirement age & special case -> people born after 1946
  const RETIREMENT_AGE = 66;
  const SPECIAL_CASE = 1946;

  //1) Find the tax rates of the year given
  const taxRate = taxRatesNetherland.find((rate) => rate.year == taxYear);

  ///2) Select tax band, general & labour tax credit based on age
  let taxSlabs;
  let generalTaxCreditInfo;
  let labourTaxCreditInfo;

  if (age < RETIREMENT_AGE) {
    taxSlabs = taxRate.taxSlabs;
    generalTaxCreditInfo = taxRate.generalTaxCredit.taxCredit;
    labourTaxCreditInfo = taxRate.labourTaxCredit.taxCredit;
  } else if (2022 - age <= SPECIAL_CASE && age >= RETIREMENT_AGE) {
    taxSlabs = taxRate.taxSlabsRetiredPersonSpecial;
    generalTaxCreditInfo =
      taxRate.generalTaxCredit.taxCreditRetiredPersonSpecial;
    labourTaxCreditInfo = taxRate.labourTaxCredit.taxCreditRetiredPersonSpecial;
  } else if (age >= RETIREMENT_AGE) {
    taxSlabs = taxRate.taxSlabsRetiredPerson;
    generalTaxCreditInfo = taxRate.generalTaxCredit.taxCreditRetiredPerson;
    labourTaxCreditInfo = taxRate.labourTaxCredit.taxCreditRetiredPerson;
  }

  //3) Calc general tax credit
  const generalTaxCredit = Math.max(
    generalTaxCreditInfo.maxCredit -
      (generalTaxCreditInfo.creditPercent *
        (grossIncome - generalTaxCreditInfo.maxWage)) /
        100,
    0
  );

  //4) Calc labout tax credit
  const labourTaxCredit = Math.max(
    labourTaxCreditInfo.maxCredit -
      (labourTaxCreditInfo.creditPercent *
        (grossIncome - labourTaxCreditInfo.maxWage)) /
        100,
    0
  );

  //5 Return response back to client
  return {
    taxSlabs,
    generalTaxCredit,
    labourTaxCredit,
    currency: "£",
  };
};

/**
 ** ====================================
 ** CALCULATE NETHERLAND TAXES
 ** ====================================
 */
const calculateNetherlandTaxes = (req, res) => {
  //1) Get params from query
  const income = req.query.income;
  const taxYear = req.query["tax-year"];
  const age = req.query.age;

  //2) Get tax rates for the given year
  const taxRates = getTaxRates(income, taxYear, age);

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
  console.log(calculatedTaxInfo.totalTax);

  //5) Transform Data
  const taxInfo = {
    tax: calculatedTaxInfo.totalTax.toFixed(2),
    tax_breakup: calculatedTaxInfo.slabWiseTax,
    general_tax_credit: taxRates.generalTaxCredit.toFixed(2),
    labour_tax_credit: taxRates.labourTaxCredit.toFixed(2),
    deduction: (
      calculatedTaxInfo.totalTax -
      (taxRates.generalTaxCredit + taxRates.labourTaxCredit)
    ).toFixed(2),
    gross_income: parseFloat(calculatedTaxInfo.income).toFixed(2),
    net_income: (
      calculatedTaxInfo.income -
      (calculatedTaxInfo.totalTax -
        (taxRates.generalTaxCredit + taxRates.labourTaxCredit))
    ).toFixed(2),
    currency: calculatedTaxInfo.currency,
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
module.exports.calculateNetherlandTaxes = calculateNetherlandTaxes;
