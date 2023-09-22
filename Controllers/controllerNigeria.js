const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** Nigeria Tax Rates
 ** ====================================
 */
const taxRatesNigeria = [
  //2022-23
  {
    taxSlabs: [
      {
        from: "less",
        to: 300000,
        tax: 7,
      },
      {
        from: 300001,
        to: 600000,
        tax: 11,
      },
      {
        from: 600001,
        to: 1100000,
        tax: 15,
      },
      {
        from: 1100001,
        to: 1600000,
        tax: 19,
      },
      {
        from: 1600001,
        to: 3200000,
        tax: 21,
      },
      {
        from: 3200001,
        to: "more",
        tax: 24,
      },
    ],
    cra_threshold: 200000,
    nhf_threshold: 3000,
    pension: 8,
    year: "2022/23",
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear) => {
  //1) Find the tax rates of the year given
  const taxRate = taxRatesNigeria.find((rate) => rate.year === taxYear);

  //2) Calc CRA (Consolidated Relief Allowance)
  const cra = Math.max(taxRate.cra_threshold, (grossIncome * 1) / 100);

  //3) Calc GIA (Gross Income Allowance)
  const gia = (grossIncome * 20) / 100;

  //4) Calc Pension
  const pension = (grossIncome * taxRate.pension) / 100;

  //5) Calc NHF (National Housing Fund) contributions
  const nhf =
    grossIncome > taxRate.nhf_threshold ? (grossIncome * 2.5) / 100 : 0;

  //6) Calc Taxable Income
  const taxableIncome = grossIncome - (cra + gia + nhf + pension);

  return {
    taxSlabs: taxRate.taxSlabs,
    nhf,
    cra,
    gia,
    pension,
    taxableIncome,
    currency: "₦",
  };
};

/**
 ** ====================================
 ** CALCULATE NIGERIA TAXES
 ** ====================================
 */
const calculateNigeriaTaxes = (req, res) => {
  //1) Get params from query
  const income = req.query.income;
  const taxYear = req.query["tax-year"];

  //2) Get tax rates for the given year
  const taxRates = getTaxRates(income, taxYear);

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
    nhf: parseFloat(taxRates.nhf).toFixed(2),
    cra: parseFloat(taxRates.cra).toFixed(2),
    gia: parseFloat(taxRates.gia).toFixed(2),
    pension: parseFloat(taxRates.pension).toFixed(2),
    deduction: parseFloat(calculatedTaxInfo.totalTax).toFixed(2),
    gross_income: parseFloat(income).toFixed(2),
    net_income: (
      parseFloat(income) - parseFloat(calculatedTaxInfo.totalTax)
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
module.exports.calculateNigeriaTaxes = calculateNigeriaTaxes;
