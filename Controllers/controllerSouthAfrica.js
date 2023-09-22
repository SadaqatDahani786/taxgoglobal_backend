const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** South Africa Tax Rates
 ** ====================================
 */
const taxRatesSouthAfrica = [
  //2021-22
  {
    taxSlabs: [
      {
        from: "less",
        to: 216200,
        tax: 18,
      },
      {
        from: 216201,
        to: 337800,
        tax: 26,
      },
      {
        from: 337801,
        to: 467500,
        tax: 31,
      },
      {
        from: 467501,
        to: 613600,
        tax: 36,
      },
      {
        from: 613601,
        to: 782200,
        tax: 39,
      },
      {
        from: 782201,
        to: 1656600,
        tax: 41,
      },
      {
        from: 1656601,
        to: "more",
        tax: 45,
      },
    ],
    income_threshold: {
      under: {
        amount: 87300,
        age: 65,
      },
      between: {
        amount: 135150,
      },
      over: {
        amount: 151100,
        age: 75,
      },
      limit: 2125.44,
    },
    uif: 1,
    year: "2021/22",
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear, age) => {
  //1) Find the tax rates of the year given
  const taxRate = taxRatesSouthAfrica.find((rate) => rate.year === taxYear);

  //2)Find income threshold
  let threshold = 0;
  if (age < taxRate.income_threshold.under.age)
    threshold = taxRate.income_threshold.under.amount;
  else if (
    age >= taxRate.income_threshold.under.age &&
    age <= taxRate.income_threshold.over.age
  )
    threshold = taxRate.income_threshold.between.amount;
  else {
    threshold = taxRate.income_threshold.over.amount;
  }

  //3) Calc Unemployement Insurance Fund (UIF)
  const uif = Math.min(
    (grossIncome * taxRate.uif) / 100,
    taxRate.income_threshold.limit
  );

  //3) Cacl Taxable Income
  const taxableIncome = grossIncome - threshold;

  //4) Tax Slabs
  const taxSlabs = taxRate.taxSlabs;

  return {
    taxableIncome,
    uif,
    taxSlabs,
    currency: "R",
  };
};

/**
 ** ====================================
 ** CALCULATE SOUTH AFRICA TAXES
 ** ====================================
 */
const calculateSouthAfricaTaxes = (req, res) => {
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
    taxRates.taxableIncome,
    taxRates.taxSlabs
  );

  //5) Transform Data
  const taxInfo = {
    tax: calculatedTaxInfo.totalTax.toFixed(2),
    tax_breakup: calculatedTaxInfo.slabWiseTax,
    paye: parseFloat(calculatedTaxInfo.totalTax).toFixed(2),
    uif: parseFloat(taxRates.uif).toFixed(2),
    deduction: (
      parseFloat(calculatedTaxInfo.totalTax) + parseFloat(taxRates.uif)
    ).toFixed(2),
    gross_income: parseFloat(income).toFixed(2),
    net_income: (
      parseFloat(income) -
      parseFloat(calculatedTaxInfo.totalTax) -
      parseFloat(taxRates.uif)
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
module.exports.calculateSouthAfricaTaxes = calculateSouthAfricaTaxes;
