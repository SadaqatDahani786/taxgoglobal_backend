const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** Kenya Tax Rates
 ** ====================================
 */
const taxRatesKenya = [
  //2020-21
  {
    taxSlabs: [
      {
        from: "less",
        to: 147576,
        tax: 10,
      },
      {
        from: 147577,
        to: 286620,
        tax: 15,
      },
      {
        from: 286621,
        to: 425664,
        tax: 20,
      },
      {
        from: 425665,
        to: 564708,
        tax: 25,
      },
      {
        from: 564709,
        to: "more",
        tax: 30,
      },
    ],
    nhif: [
      {
        from: "less",
        to: 5999,
        tax: 150,
        type: "flat",
      },
      {
        from: 6000,
        to: 7999,
        tax: 300,
        type: "flat",
      },
      {
        from: 8000,
        to: 11999,
        tax: 400,
        type: "flat",
      },
      {
        from: 12000,
        to: 14999,
        tax: 500,
        type: "flat",
      },
      {
        from: 15000,
        to: 19999,
        tax: 600,
        type: "flat",
      },
      {
        from: 20000,
        to: 24999,
        tax: 750,
        type: "flat",
      },
      {
        from: 25000,
        to: 29999,
        tax: 850,
        type: "flat",
      },
      {
        from: 30000,
        to: 34999,
        tax: 900,
        type: "flat",
      },
      {
        from: 35000,
        to: 39999,
        tax: 950,
        type: "flat",
      },
      {
        from: 40000,
        to: 44999,
        tax: 1000,
        type: "flat",
      },
      {
        from: 45000,
        to: 49999,
        tax: 1100,
        type: "flat",
      },
      {
        from: 50000,
        to: 59999,
        tax: 1200,
        type: "flat",
      },
      {
        from: 60000,
        to: 69999,
        tax: 1300,
        type: "flat",
      },
      {
        from: 70000,
        to: 79999,
        tax: 1400,
        type: "flat",
      },
      {
        from: 80000,
        to: 89999,
        tax: 1500,
        type: "flat",
      },
      {
        from: 90000,
        to: 99999,
        tax: 1600,
        type: "flat",
      },
      {
        from: 100000,
        to: "more",
        tax: 1700,
        type: "flat",
      },
    ],
    nssf: {
      tax: 6,
      upper_limit: 216000,
      lower_limit: 72000,
    },
    tax_relief: 16896,
    year: "2020/21",
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear) => {
  //1) Find the tax rates of the year given
  const taxRate = taxRatesKenya.find((rate) => rate.year === taxYear);

  //2) Calc the National Social Security Fund (NSSF)
  const nssf =
    (Math.min(
      Math.max(grossIncome, taxRate.nssf.lower_limit),
      taxRate.nssf.upper_limit
    ) *
      taxRate.nssf.tax) /
    100;

  //3) Calc the National Health Insurance Fund (NHIF)
  const nhif = calculateTax(grossIncome / 12, taxRate.nhif).totalTax * 12;

  //3) Cacl Taxable Income
  const taxableIncome = Math.max(grossIncome - nssf, 0);

  //4) Tax Slabs
  const taxSlabs = taxRate.taxSlabs;

  return {
    taxableIncome,
    nssf,
    nhif,
    taxSlabs,
    taxRelief: taxRate.tax_relief,
    currency: "KES",
  };
};

/**
 ** ====================================
 ** CALCULATE KENYA TAXES
 ** ====================================
 */
const calculateKenyaTaxes = (req, res) => {
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
    paye: Math.max(
      parseFloat(calculatedTaxInfo.totalTax) - parseFloat(taxRates.taxRelief),
      0
    ).toFixed(2),
    nssf: parseFloat(taxRates.nssf).toFixed(2),
    nhif: parseFloat(taxRates.nhif).toFixed(2),
    deduction: (
      Math.max(
        parseFloat(calculatedTaxInfo.totalTax) - parseFloat(taxRates.taxRelief),
        0
      ) +
      parseFloat(taxRates.nssf) +
      parseFloat(taxRates.nhif)
    ).toFixed(2),
    gross_income: parseFloat(income).toFixed(2),
    net_income: (
      parseFloat(income) -
      Math.max(
        parseFloat(calculatedTaxInfo.totalTax) - parseFloat(taxRates.taxRelief),
        0
      ) -
      parseFloat(taxRates.nssf) -
      parseFloat(taxRates.nhif)
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
module.exports.calculateKenyaTaxes = calculateKenyaTaxes;
