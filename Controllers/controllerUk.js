const TaxCalculator = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** UK TAX RATES
 ** ====================================
 */
const taxRatesUK = [
  {
    taxSlabs: [
      [
        {
          from: "less",
          to: 12570,
          tax: 0,
        },
        {
          from: 12571,
          to: 50270,
          tax: 20,
        },
        {
          from: 50271,
          to: 150000,
          tax: 40,
        },
        {
          from: 150001,
          to: "more",
          tax: 45,
        },
      ],
      [
        {
          from: "less",
          to: 12570,
          tax: 0,
        },
        {
          from: 1048,
          to: 4189,
          tax: 13.25,
        },
        {
          from: 4190,
          to: "more",
          tax: 3.25,
        },
      ],
    ],
    acc: 0,
    personalAllowance: 12570,
    personalAllowanceLimit: 100000,
    year: ["2022/23", "2021/22"],
  },
  {
    taxSlabs: [
      {
        from: "less",
        to: 12500,
        tax: 0,
      },
      {
        from: 12501,
        to: 50000,
        tax: 20,
      },
      {
        from: 50001,
        to: 150000,
        tax: 40,
      },
      {
        from: 150001,
        to: "more",
        tax: 45,
      },
    ],
    acc: 0,
    personalAllowance: 12500,
    personalAllowanceLimit: 100000,
    year: ["2020/21", "2019/20"],
  },
  {
    taxSlabs: [
      {
        from: "less",
        to: 11850,
        tax: 0,
      },
      {
        from: 11851,
        to: 34500,
        tax: 20,
      },
      {
        from: 34501,
        to: 150000,
        tax: 40,
      },
      {
        from: 150001,
        to: "more",
        tax: 45,
      },
    ],
    acc: 0,
    personalAllowance: 11850,
    personalAllowanceLimit: 100000,
    year: ["2018/19"],
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear) => {
  //1) Find the tax rates of the year given
  const taxRate = taxRatesUK.find((rate) => rate.year.includes(taxYear));

  //2) For each 2 euro earned over allowance limit (100000), 1 euro will be deducted from personal allowance(12570)
  const personalAllowance = Math.max(
    grossIncome > taxRate.personalAllowanceLimit
      ? Math.round(
          taxRate.personalAllowance -
            (grossIncome - taxRate.personalAllowanceLimit) / 2
        )
      : taxRate.personalAllowance,
    0
  );

  //3) Apply calculated personal allowance on tax slab
  const taxSlabs = taxRate.taxSlabs;
  taxSlabs[0][0].to = personalAllowance;
  taxSlabs[0][1].from = personalAllowance + 1;

  //4) Return tax rates
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
const calculateUKTaxes = (req, res) => {
  //1) Get income from query
  const income = req.query.income;
  const taxYear = req.query["tax-year"];

  //2) Get tax rates for the given year
  const taxRates = getTaxRates(income, taxYear);

  //3) Instantiate tax calculator
  const TaxCalculatorUK = new TaxCalculator(
    income,
    taxRates.taxSlabs,
    taxRates.acc,
    taxRates.currency
  );

  //4) Check if income is a valid value
  if (!TaxCalculatorUK.isIncomeValid()) {
    return res.status(400).json({
      status: "failed",
      error_message: "Please provide a valid income value.",
    });
  }

  //5) Calculate Tax
  const calculatedTaxInfo = TaxCalculatorUK.calculateTax();

  //6) Send response back to the client
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
module.exports.calculateUKTaxes = calculateUKTaxes;
