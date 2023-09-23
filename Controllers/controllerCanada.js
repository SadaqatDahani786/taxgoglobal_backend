const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** Canada Tax Rates
 ** ====================================
 */
const taxRatesCanada = [
  //2021-22
  {
    taxSlabs: [
      {
        from: "less",
        to: 13808,
        tax: 0,
      },
      {
        from: 13809,
        to: 49020,
        tax: 15,
      },
      {
        from: 49021,
        to: 98040,
        tax: 20.5,
      },
      {
        from: 98041,
        to: 151978,
        tax: 26,
      },
      {
        from: 151979,
        to: 216511,
        tax: 29,
      },
      {
        from: 216512,
        to: "more",
        tax: 33,
      },
    ],
    provincial_tax: [
      {
        province: "Alberta",
        taxSlabs: [
          {
            from: "less",
            to: 19369,
            tax: 0,
          },
          {
            from: 19370,
            to: 131220,
            tax: 10,
          },
          {
            from: 131221,
            to: 157464,
            tax: 12,
          },
          {
            from: 157465,
            to: 209952,
            tax: 13,
          },
          {
            from: 209953,
            to: 314928,
            tax: 14,
          },
          {
            from: 314929,
            to: "more",
            tax: 15,
          },
        ],
      },
      {
        province: "British Columbia",
        taxSlabs: [
          {
            from: "less",
            to: 11070,
            tax: 0,
          },
          {
            from: 11071,
            to: 42184,
            tax: 5.06,
          },
          {
            from: 42185,
            to: 84369,
            tax: 7.7,
          },
          {
            from: 84370,
            to: 96866,
            tax: 10.5,
          },
          {
            from: 96867,
            to: 117623,
            tax: 12.29,
          },
          {
            from: 117624,
            to: 159483,
            tax: 14.7,
          },
          {
            from: 159484,
            to: 222430,
            tax: 16.8,
          },
          {
            from: 222431,
            to: "more",
            tax: 20.5,
          },
        ],
      },
      {
        province: "Nova Scotia",
        taxSlabs: [
          {
            from: "less",
            to: 11481,
            tax: 0,
          },
          {
            from: 11482,
            to: 29590,
            tax: 8.79,
          },
          {
            from: 29591,
            to: 59180,
            tax: 14.95,
          },
          {
            from: 59181,
            to: 93000,
            tax: 16.67,
          },
          {
            from: 93001,
            to: 150000,
            tax: 17.5,
          },
          {
            from: 150001,
            to: "more",
            tax: 21.0,
          },
        ],
      },
      {
        province: "Prince Edward Island",
        taxSlabs: [
          {
            from: "less",
            to: 10500,
            tax: 0,
          },
          {
            from: 10501,
            to: 31984,
            tax: 9.8,
          },
          {
            from: 31985,
            to: 63969,
            tax: 13.8,
          },
          {
            from: 63970,
            to: "more",
            tax: 16.7,
          },
        ],
      },
      {
        province: "Ontario",
        taxSlabs: [
          {
            from: "less",
            to: 10880,
            tax: 0,
          },
          {
            from: 10881,
            to: 45142,
            tax: 5.05,
          },
          {
            from: 45143,
            to: 90287,
            tax: 9.15,
          },
          {
            from: 90288,
            to: 150000,
            tax: 11.16,
          },
          {
            from: 150001,
            to: 220000,
            tax: 12.16,
          },
          {
            from: 220001,
            to: "more",
            tax: 13.16,
          },
        ],
      },
      {
        province: "Quebec",
        taxSlabs: [
          {
            from: "less",
            to: 15728,
            tax: 0,
          },
          {
            from: 15729,
            to: 45105,
            tax: 15,
          },
          {
            from: 45106,
            to: 90200,
            tax: 20,
          },
          {
            from: 90201,
            to: 109755,
            tax: 24,
          },
          {
            from: 109756,
            to: "more",
            tax: 25.75,
          },
        ],
      },
      {
        province: "Manitoba",
        taxSlabs: [
          {
            from: "less",
            to: 9936,
            tax: 0,
          },
          {
            from: 9937,
            to: 33723,
            tax: 10.8,
          },
          {
            from: 33724,
            to: 72885,
            tax: 12.75,
          },
          {
            from: 72886,
            to: "more",
            tax: 17.4,
          },
        ],
      },
      {
        province: "New Brunswick",
        taxSlabs: [
          {
            from: "less",
            to: 10564,
            tax: 0,
          },
          {
            from: 10565,
            to: 43835,
            tax: 9.68,
          },
          {
            from: 43836,
            to: 87671,
            tax: 14.82,
          },
          {
            from: 87672,
            to: 142534,
            tax: 16.52,
          },
          {
            from: 142534,
            to: 162383,
            tax: 17.84,
          },
          {
            from: 162384,
            to: "more",
            tax: 20.3,
          },
        ],
      },
      {
        province: "Newfoundland & Labrador",
        taxSlabs: [
          {
            from: "less",
            to: 9536,
            tax: 0,
          },
          {
            from: 9537,
            to: 38081,
            tax: 8.7,
          },
          {
            from: 38082,
            to: 76161,
            tax: 14.5,
          },
          {
            from: 76162,
            to: 135973,
            tax: 15.8,
          },
          {
            from: 135974,
            to: 190363,
            tax: 17.3,
          },
          {
            from: 190364,
            to: "more",
            tax: 18.3,
          },
        ],
      },
      {
        province: "Saskatchewan",
        taxSlabs: [
          {
            from: "less",
            to: 16225,
            tax: 0,
          },
          {
            from: 16226,
            to: 45667,
            tax: 10.5,
          },
          {
            from: 45668,
            to: 130506,
            tax: 12.5,
          },
          {
            from: 130507,
            to: "more",
            tax: 14.5,
          },
        ],
      },
      {
        province: "Northwest Territories",
        taxSlabs: [
          {
            from: "less",
            to: 15243,
            tax: 0,
          },
          {
            from: 15244,
            to: 44396,
            tax: 5.9,
          },
          {
            from: 44397,
            to: 88796,
            tax: 8.6,
          },
          {
            from: 88797,
            to: 144362,
            tax: 12.2,
          },
          {
            from: 144363,
            to: "more",
            tax: 14.05,
          },
        ],
      },
      {
        province: "Nunavut",
        taxSlabs: [
          {
            from: "less",
            to: 16467,
            tax: 0,
          },
          {
            from: 16468,
            to: 46740,
            tax: 4,
          },
          {
            from: 46741,
            to: 93480,
            tax: 7,
          },
          {
            from: 93481,
            to: 151978,
            tax: 9,
          },
          {
            from: 151979,
            to: "more",
            tax: 11.5,
          },
        ],
      },
      {
        province: "Yukon",
        taxSlabs: [
          {
            from: "less",
            to: 13808,
            tax: 0,
          },
          {
            from: 13809,
            to: 49020,
            tax: 6.4,
          },
          {
            from: 49021,
            to: 98040,
            tax: 9,
          },
          {
            from: 98041,
            to: 151978,
            tax: 10.9,
          },
          {
            from: 151979,
            to: 500000,
            tax: 12.8,
          },
          {
            from: 500001,
            to: "more",
            tax: 15,
          },
        ],
      },
    ],
    cpp: {
      exemption: 3500,
      tax: 5.45,
      max_limit: 3166.45,
    },
    ei: {
      tax: 1.58,
      max_limit: 889.54,
    },
    year: "2021/22",
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear, province) => {
  //1) Find the tax rates of the year given
  const taxRate = taxRatesCanada.find((rate) => rate.year === taxYear);

  //2) Find the tax rates of the province
  const taxRateProvincial = taxRate.provincial_tax.find(
    (rate) => rate.province === province
  );

  //3) Calc Canada Pension Play (CPP)
  const cpp = Math.min(
    ((grossIncome - taxRate.cpp.exemption) * taxRate.cpp.tax) / 100,
    taxRate.cpp.max_limit
  );

  //4) Calc Employment Insurance (EI)
  const ei = Math.min(
    (grossIncome * taxRate.ei.tax) / 100,
    taxRate.ei.max_limit
  );

  //5) Calc Taxable Income
  const taxableIncome = grossIncome - cpp - ei;

  //6 Tax slabs
  const taxSlabs = [taxRate.taxSlabs, taxRateProvincial.taxSlabs];

  return {
    taxableIncome,
    cpp,
    ei,
    taxSlabs,
    currency: "$",
  };
};

/**
 ** ====================================
 ** CALCULATE CANADA TAXES
 ** ====================================
 */
const calculateCanadaTaxes = (req, res) => {
  //1) Get params from query
  const income = req.query.income;
  const taxYear = req.query["tax-year"];
  const province = req.query["state_or_province"];

  //2) Get tax rates for the given year
  const taxRates = getTaxRates(income, taxYear, province);

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
    tax: calculatedTaxInfo[0].totalTax.toFixed(2),
    tax_breakup: calculatedTaxInfo[0].slabWiseTax,
    tax_provincial: calculatedTaxInfo[1].totalTax.toFixed(2),
    deduction: (
      parseFloat(calculatedTaxInfo[0].totalTax) +
      parseFloat(calculatedTaxInfo[1].totalTax) +
      parseFloat(taxRates.cpp) +
      parseFloat(taxRates.ei)
    ).toFixed(2),
    cpp: parseFloat(taxRates.cpp).toFixed(2),
    ei: parseFloat(taxRates.ei).toFixed(2),
    gross_income: parseFloat(income).toFixed(2),
    net_income: (
      parseFloat(income) -
      parseFloat(calculatedTaxInfo[0].totalTax) -
      parseFloat(calculatedTaxInfo[1].totalTax) -
      parseFloat(taxRates.cpp) -
      parseFloat(taxRates.ei)
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
module.exports.calculateCanadaTaxes = calculateCanadaTaxes;
