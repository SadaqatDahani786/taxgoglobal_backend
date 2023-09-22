const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** Hong Kong Tax Rates
 ** ====================================
 */
const taxRatesHongKong = [
  //2022-23
  {
    taxSlabs: [
      {
        from: "less",
        to: 50000,
        tax: 2,
      },
      {
        from: 50001,
        to: 100000,
        tax: 6,
      },
      {
        from: 100001,
        to: 150000,
        tax: 10,
      },
      {
        from: 150000,
        to: 200000,
        tax: 14,
      },
      {
        from: 200001,
        to: "more",
        tax: 17,
      },
    ],
    standard_rate: 15,
    standard_rate_thresholds: {
      single: 2022000,
      married: 3144000,
      married_one_child: 4164000,
      married_two_child: 5184000,
      married_three_child: 6204000,
    },
    allowances: {
      basic: 132000,
      married: 264000,
      one_parent: 132000,
      child: 120000,
    },
    year: "2022/23",
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear, filingStatus, noOfChilds) => {
  //1) Find the tax rates of the year given
  const taxRate = taxRatesHongKong.find((rate) => rate.year === taxYear);

  //2) Find standard rate income threshold for a given filingStatus
  let threshold;
  if (filingStatus === "Single")
    threshold = taxRate.standard_rate_thresholds.single;
  else if (
    (filingStatus === "Married" || filingStatus === "One Parent Family") &&
    noOfChilds <= 0
  )
    threshold = taxRate.standard_rate_thresholds.married;
  else if (
    (filingStatus === "Married" || filingStatus === "One Parent Family") &&
    noOfChilds <= 1
  )
    threshold = taxRate.standard_rate_thresholds.married_one_child;
  else if (
    (filingStatus === "Married" || filingStatus === "One Parent Family") &&
    noOfChilds <= 2
  )
    threshold = taxRate.standard_rate_thresholds.married_two_child;
  else if (
    (filingStatus === "Married" || filingStatus === "One Parent Family") &&
    noOfChilds >= 3
  )
    threshold = taxRate.standard_rate_thresholds.married_three_child;

  //3) Calc Personal Allowance
  let personalAllowance;
  if (filingStatus === "Single") personalAllowance = taxRate.allowances.basic;
  else if (filingStatus === "Married")
    personalAllowance = taxRate.allowances.married;
  else
    personalAllowance =
      taxRate.allowances.basic + taxRate.allowances.one_parent;

  //4)Calc Children Allowance
  const childrenAllowance = noOfChilds * taxRate.allowances.child;

  //5) Check whether grossIncome over the threshold for standard tax rate
  const taxSlabs =
    grossIncome > threshold
      ? [{ from: "less", to: "more", tax: taxRate.standard_rate }]
      : taxRate.taxSlabs;

  //5) Calc Taxable Income
  const taxableIncome = Math.max(
    grossIncome - personalAllowance - childrenAllowance,
    0
  );

  return {
    taxSlabs,
    taxableIncome,
    personalAllowance,
    childrenAllowance,
    currency: "HK$",
  };
};

/**
 ** ====================================
 ** CALCULATE NIGERIA TAXES
 ** ====================================
 */
const calculateHongKongTaxes = (req, res) => {
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
    tax: calculatedTaxInfo.totalTax.toFixed(2),
    tax_breakup: calculatedTaxInfo.slabWiseTax,
    personal_allowance: parseFloat(taxRates.personalAllowance).toFixed(2),
    children_allowance: parseFloat(taxRates.childrenAllowance).toFixed(2),
    deduction: parseFloat(calculatedTaxInfo.totalTax).toFixed(2),
    taxable_income: parseFloat(taxRates.taxableIncome).toFixed(2),
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
module.exports.calculateHongKongTaxes = calculateHongKongTaxes;
