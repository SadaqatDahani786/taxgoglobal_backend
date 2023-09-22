const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** Serbia Tax Rates
 ** ====================================
 */
const taxRatesSerbia = [
  //2019-20
  {
    taxSlabs: [
      {
        from: "less",
        to: "more",
        tax: 10,
      },
    ],
    pension: 14,
    health_insurance: 5.15,
    unemployment_insurance: 0.75,
    year: "2019/20",
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear, age) => {
  //1) Find the tax rates of the year given
  const taxRate = taxRatesSerbia.find((rate) => rate.year === taxYear);

  //2) Calc Pension Contribution
  const pension = (grossIncome * taxRate.pension) / 100;

  //3) Calc Health Insurance Contribution
  const health_insurance = (grossIncome * taxRate.health_insurance) / 100;

  //4) Calc Unemployment Insurance Contribution
  const unemployment_insurance =
    (grossIncome * taxRate.unemployment_insurance) / 100;

  //5) Calc Taxable Income
  const taxableIncome =
    grossIncome - pension - health_insurance - unemployment_insurance;

  return {
    taxableIncome,
    pension,
    health_insurance,
    unemployment_insurance,
    taxSlabs: taxRate.taxSlabs,
    currency: "RSD",
  };
};

/**
 ** ====================================
 ** CALCULATE SERBIA TAXES
 ** ====================================
 */
const calculateSerbiaTaxes = (req, res) => {
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
    pension: parseFloat(taxRates.pension).toFixed(2),
    health_insurance: parseFloat(taxRates.health_insurance).toFixed(2),
    unemployment_insurance: parseFloat(taxRates.unemployment_insurance).toFixed(
      2
    ),
    deduction: (
      parseFloat(calculatedTaxInfo.totalTax) +
      parseFloat(taxRates.pension) +
      parseFloat(taxRates.health_insurance) +
      parseFloat(taxRates.unemployment_insurance)
    ).toFixed(2),
    gross_income: parseFloat(income).toFixed(2),
    net_income: (
      parseFloat(income) -
      parseFloat(calculatedTaxInfo.totalTax) -
      parseFloat(taxRates.pension) -
      parseFloat(taxRates.health_insurance) -
      parseFloat(taxRates.unemployment_insurance)
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
module.exports.calculateSerbiaTaxes = calculateSerbiaTaxes;
