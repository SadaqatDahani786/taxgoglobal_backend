const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** UK TAX RATES
 ** ====================================
 */
const taxRatesUK = [
  //2022-23
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
          from: 12571,
          to: 50268,
          tax: 13.25,
        },
        {
          from: 50269,
          to: "more",
          tax: 3.25,
        },
      ],
    ],
    levy: 0, //1.25 -> Next year
    personalAllowance: 12570,
    personalAllowanceLimit: 100000,
    year: "2022/23",
  },
  //2021-22
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
          to: 9568,
          tax: 0,
        },
        {
          from: 9569,
          to: 50270,
          tax: 12,
        },
        {
          from: 50271,
          to: "more",
          tax: 2,
        },
      ],
    ],
    levy: 0,
    personalAllowance: 12570,
    personalAllowanceLimit: 100000,
    year: "2021/22",
  },
  //2020-21
  {
    taxSlabs: [
      [
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
      [
        {
          from: "less",
          to: 9500,
          tax: 0,
        },
        {
          from: 9501,
          to: 50000,
          tax: 12,
        },
        {
          from: 50001,
          to: "more",
          tax: 2,
        },
      ],
    ],
    levy: 0,
    personalAllowance: 12500,
    personalAllowanceLimit: 100000,
    year: "2020/21",
  },
  //2019-20
  {
    taxSlabs: [
      [
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
      [
        {
          from: "less",
          to: 8632,
          tax: 0,
        },
        {
          from: 8633,
          to: 50000,
          tax: 12,
        },
        {
          from: 50001,
          to: "more",
          tax: 2,
        },
      ],
    ],
    levy: 0,
    personalAllowance: 12500,
    personalAllowanceLimit: 100000,
    year: "2019/20",
  },
  //2018-19
  {
    taxSlabs: [
      [
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
      [
        {
          from: "less",
          to: 8424,
          tax: 0,
        },
        {
          from: 8425,
          to: 46350,
          tax: 12,
        },
        {
          from: 46351,
          to: "more",
          tax: 2,
        },
      ],
    ],
    levy: 0,
    personalAllowance: 11850,
    personalAllowanceLimit: 100000,
    year: "2018/19",
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear, age) => {
  //Retirement age - UK
  const RETIREMENT_AGE = 65;

  //1) Find the tax rates of the year given
  const taxRate = taxRatesUK.find((rate) => rate.year === taxYear);

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
  let taxSlabs = [...taxRate.taxSlabs];
  taxSlabs[0][0].to = personalAllowance;
  taxSlabs[0][1].from = personalAllowance + 1;

  //4) If past retirement age, no NIC taxes
  if (age > RETIREMENT_AGE)
    taxSlabs = [taxSlabs[0], [{ from: "less", to: "more", tax: 0 }]];

  //5 Calc levy
  let socialLevy = (grossIncome * taxRate.levy) / 100;

  //5) Return tax rates
  return {
    taxSlabs,
    socialLevy,
    currency: "£",
  };
};

/**
 ** ====================================
 ** CALCULATE UK TAXES
 ** ====================================
 */
const calculateUKTaxes = (req, res) => {
  //1) Get params from query
  const income = req.query.income;
  const taxYear = req.query["tax-year"];
  const age = req.query.age;

  //2) Get tax rates for the given year
  const taxRates = getTaxRates(income, taxYear, age);

  //4) Check if income is a valid value
  if (!isIncomeValid(income)) {
    return res.status(400).json({
      status: "failed",
      error_message: "Please provide a valid income value.",
    });
  }

  //5) Calculate Tax
  const calculatedTaxInfo = calculateTax(income, taxRates.taxSlabs);

  //6) Transform Data
  const nic = parseFloat(calculatedTaxInfo[1].totalTax).toFixed(2);
  const levies = parseFloat(taxRates.socialLevy).toFixed(2);
  const tax = parseFloat(calculatedTaxInfo[0].totalTax).toFixed(2);
  const tax_breakup = calculatedTaxInfo[0].slabWiseTax;
  const deduction = parseFloat(tax + nic + levies).toFixed(2);
  const gross_income = parseFloat(income).toFixed(2);
  const net_income = parseFloat(
    gross_income - (parseFloat(tax) + parseFloat(nic) + parseFloat(levies))
  ).toFixed(2);

  const taxInfo = {
    nic,
    levies,
    tax,
    tax_breakup,
    deduction,
    gross_income,
    net_income,
    currency: taxRates.currency,
  };

  //7) Send response back to the client
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
module.exports.calculateUKTaxes = calculateUKTaxes;
