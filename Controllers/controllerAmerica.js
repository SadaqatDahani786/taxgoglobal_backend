const { calculateTax, isIncomeValid } = require("../Controllers/TaxCalculator");

/**
 ** ====================================
 ** America Tax Rates
 ** ====================================
 */
const taxRatesAmerica = [
  //2021-22
  {
    federalTax: [
      {
        type: "Single",
        taxSlabs: [
          {
            from: "less",
            to: 9875,
            tax: 10,
          },
          {
            from: 9876,
            to: 40125,
            tax: 12,
          },
          {
            from: 40126,
            to: 85525,
            tax: 22,
          },
          {
            from: 85526,
            to: 163300,
            tax: 24,
          },
          {
            from: 163301,
            to: 207350,
            tax: 32,
          },
          {
            from: 207351,
            to: 518400,
            tax: 35,
          },
          {
            from: 518400,
            to: "more",
            tax: 37,
          },
        ],
      },
      {
        type: "Married - Filing Seperately",
        taxSlabs: [
          {
            from: "less",
            to: 9875,
            tax: 10,
          },
          {
            from: 9876,
            to: 40125,
            tax: 12,
          },
          {
            from: 40126,
            to: 85525,
            tax: 22,
          },
          {
            from: 85526,
            to: 163300,
            tax: 24,
          },
          {
            from: 163301,
            to: 207350,
            tax: 32,
          },
          {
            from: 207351,
            to: 311025,
            tax: 35,
          },
          {
            from: 311026,
            to: "more",
            tax: 37,
          },
        ],
      },
      {
        type: "Married - Filing Jointly",
        taxSlabs: [
          {
            from: "less",
            to: 19750,
            tax: 10,
          },
          {
            from: 19751,
            to: 80250,
            tax: 12,
          },
          {
            from: 80251,
            to: 171050,
            tax: 22,
          },
          {
            from: 171051,
            to: 326600,
            tax: 24,
          },
          {
            from: 326601,
            to: 414700,
            tax: 32,
          },
          {
            from: 414701,
            to: 622050,
            tax: 35,
          },
          {
            from: 622051,
            to: "more",
            tax: 37,
          },
        ],
      },
      {
        type: "Head of Household",
        taxSlabs: [
          {
            from: "less",
            to: 14100,
            tax: 10,
          },
          {
            from: 14101,
            to: 53700,
            tax: 12,
          },
          {
            from: 53701,
            to: 85500,
            tax: 22,
          },
          {
            from: 85501,
            to: 163300,
            tax: 24,
          },
          {
            from: 163301,
            to: 207350,
            tax: 32,
          },
          {
            from: 207351,
            to: 518400,
            tax: 35,
          },
          {
            from: 518401,
            to: "more",
            tax: 37,
          },
        ],
      },
    ],
    stateTax: [
      {
        state: "Alabama",
        singleTaxRates: [
          {
            from: "less",
            to: 500,
            tax: 2,
          },
          {
            from: 501,
            to: 3000,
            tax: 4,
          },
          {
            from: 3001,
            to: "more",
            tax: 5,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 1000,
            tax: 2,
          },
          {
            from: 1001,
            to: 6000,
            tax: 4,
          },
          {
            from: 6001,
            to: "more",
            tax: 5,
          },
        ],
      },
      {
        state: "Alaska",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
      },
      {
        state: "Arizona",
        singleTaxRates: [
          {
            from: "less",
            to: 26500,
            tax: 2.59,
          },
          {
            from: 26501,
            to: 53000,
            tax: 3.34,
          },
          {
            from: 53001,
            to: 159000,
            tax: 4.17,
          },
          {
            from: 159001,
            to: "more",
            tax: 4.5,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 53000,
            tax: 2.59,
          },
          {
            from: 53001,
            to: 106000,
            tax: 3.34,
          },
          {
            from: 106001,
            to: 318000,
            tax: 4.17,
          },
          {
            from: 318001,
            to: "more",
            tax: 4.5,
          },
        ],
      },
      {
        state: "Arkansas",
        singleTaxRates: [
          {
            from: "less",
            to: 4000,
            tax: 2,
          },
          {
            from: 4001,
            to: 8000,
            tax: 4,
          },
          {
            from: 8001,
            to: 79300,
            tax: 5.9,
          },
          {
            from: 79301,
            to: "more",
            tax: 6.6,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 4000,
            tax: 2,
          },
          {
            from: 4001,
            to: 8000,
            tax: 4,
          },
          {
            from: 8001,
            to: 79300,
            tax: 5.9,
          },
          {
            from: 79301,
            to: "more",
            tax: 6.6,
          },
        ],
      },
      {
        state: "California",
        singleTaxRates: [
          {
            from: "less",
            to: 8809,
            tax: 1,
          },
          {
            from: 8810,
            to: 20883,
            tax: 2,
          },
          {
            from: 20884,
            to: 32960,
            tax: 4,
          },
          {
            from: 32961,
            to: 45753,
            tax: 6,
          },
          {
            from: 45754,
            to: 57824,
            tax: 8,
          },
          {
            from: 57825,
            to: 295373,
            tax: 9.3,
          },
          {
            from: 295374,
            to: 354445,
            tax: 10.3,
          },
          {
            from: 354446,
            to: 590742,
            tax: 11.3,
          },
          {
            from: 590743,
            to: 1000000,
            tax: 12.3,
          },
          {
            from: 1000001,
            to: "more",
            tax: 13.3,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 17618,
            tax: 1,
          },
          {
            from: 17619,
            to: 41766,
            tax: 2,
          },
          {
            from: 41767,
            to: 65920,
            tax: 4,
          },
          {
            from: 65921,
            to: 91506,
            tax: 6,
          },
          {
            from: 91507,
            to: 115648,
            tax: 8,
          },
          {
            from: 115649,
            to: 590746,
            tax: 9.3,
          },
          {
            from: 590747,
            to: 708890,
            tax: 10.3,
          },
          {
            from: 708891,
            to: 1000000,
            tax: 11.3,
          },
          {
            from: 1000001,
            to: 1181484,
            tax: 12.3,
          },
          {
            from: 1181485,
            to: "more",
            tax: 13.3,
          },
        ],
      },
      {
        state: "Colorado",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 4.63,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 4.63,
          },
        ],
      },
      {
        state: "Connecticut",
        singleTaxRates: [
          {
            from: "less",
            to: 10000,
            tax: 3,
          },
          {
            from: 10001,
            to: 50000,
            tax: 5,
          },
          {
            from: 50001,
            to: 100000,
            tax: 5.5,
          },
          {
            from: 100001,
            to: 200000,
            tax: 6,
          },
          {
            from: 200001,
            to: 250000,
            tax: 6.5,
          },
          {
            from: 250001,
            to: 500000,
            tax: 6.9,
          },
          {
            from: 500001,
            to: "more",
            tax: 6.99,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 20000,
            tax: 3,
          },
          {
            from: 20001,
            to: 100000,
            tax: 5,
          },
          {
            from: 100001,
            to: 200000,
            tax: 5.5,
          },
          {
            from: 200001,
            to: 400000,
            tax: 6,
          },
          {
            from: 400001,
            to: 500000,
            tax: 6.5,
          },
          {
            from: 500001,
            to: 1000000,
            tax: 6.9,
          },
          {
            from: 1000001,
            to: "more",
            tax: 6.99,
          },
        ],
      },
      {
        state: "Delaware",
        singleTaxRates: [
          {
            from: "less",
            to: 2000,
            tax: 0,
          },
          {
            from: 2001,
            to: 5000,
            tax: 2.2,
          },
          {
            from: 5001,
            to: 10000,
            tax: 3.9,
          },
          {
            from: 10001,
            to: 20000,
            tax: 4.8,
          },
          {
            from: 20001,
            to: 25000,
            tax: 5.2,
          },
          {
            from: 25001,
            to: 60000,
            tax: 5.55,
          },
          {
            from: 60001,
            to: "more",
            tax: 6.6,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 2000,
            tax: 0,
          },
          {
            from: 2001,
            to: 5000,
            tax: 2.2,
          },
          {
            from: 5001,
            to: 10000,
            tax: 3.9,
          },
          {
            from: 10001,
            to: 20000,
            tax: 4.8,
          },
          {
            from: 20001,
            to: 25000,
            tax: 5.2,
          },
          {
            from: 25001,
            to: 60000,
            tax: 5.55,
          },
          {
            from: 60001,
            to: "more",
            tax: 6.6,
          },
        ],
      },
      {
        state: "District of Columbia",
        singleTaxRates: [
          {
            from: "less",
            to: 10000,
            tax: 4,
          },
          {
            from: 10001,
            to: 40000,
            tax: 6,
          },
          {
            from: 40001,
            to: 60000,
            tax: 6.5,
          },
          {
            from: 60001,
            to: 350000,
            tax: 8.5,
          },
          {
            from: 350001,
            to: 1000000,
            tax: 8.75,
          },
          {
            from: 1000001,
            to: "more",
            tax: 8.95,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 10000,
            tax: 4,
          },
          {
            from: 10001,
            to: 40000,
            tax: 6,
          },
          {
            from: 40001,
            to: 60000,
            tax: 6.5,
          },
          {
            from: 60001,
            to: 350000,
            tax: 8.5,
          },
          {
            from: 350001,
            to: 1000000,
            tax: 8.75,
          },
          {
            from: 1000001,
            to: "more",
            tax: 8.95,
          },
        ],
      },
      {
        state: "Florida",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
      },
      {
        state: "Georgia",
        singleTaxRates: [
          {
            from: "less",
            to: 750,
            tax: 1,
          },
          {
            from: 751,
            to: 2250,
            tax: 2,
          },
          {
            from: 2251,
            to: 3750,
            tax: 3,
          },
          {
            from: 3751,
            to: 5250,
            tax: 4,
          },
          {
            from: 5251,
            to: 7000,
            tax: 5,
          },
          {
            from: 7001,
            to: "more",
            tax: 5.75,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 1000,
            tax: 1,
          },
          {
            from: 1001,
            to: 3000,
            tax: 2,
          },
          {
            from: 3001,
            to: 5000,
            tax: 3,
          },
          {
            from: 5001,
            to: 7000,
            tax: 4,
          },
          {
            from: 7001,
            to: 10000,
            tax: 5,
          },
          {
            from: 10001,
            to: "more",
            tax: 5.75,
          },
        ],
      },
      {
        state: "Hawaii",
        singleTaxRates: [
          {
            from: "less",
            to: 2400,
            tax: 1.4,
          },
          {
            from: 2401,
            to: 4800,
            tax: 3.2,
          },
          {
            from: 4801,
            to: 9600,
            tax: 5.5,
          },
          {
            from: 9601,
            to: 14400,
            tax: 6.4,
          },
          {
            from: 14401,
            to: 19200,
            tax: 6.8,
          },
          {
            from: 19201,
            to: 24000,
            tax: 7.2,
          },
          {
            from: 24001,
            to: 36000,
            tax: 7.6,
          },
          {
            from: 36001,
            to: 48000,
            tax: 7.9,
          },
          {
            from: 48001,
            to: 150000,
            tax: 8.25,
          },
          {
            from: 150001,
            to: 175000,
            tax: 9,
          },
          {
            from: 175001,
            to: 200000,
            tax: 10,
          },
          {
            from: 200001,
            to: "more",
            tax: 11,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 4800,
            tax: 1.4,
          },
          {
            from: 4801,
            to: 9600,
            tax: 3.2,
          },
          {
            from: 9601,
            to: 19200,
            tax: 5.5,
          },
          {
            from: 19201,
            to: 28800,
            tax: 6.4,
          },
          {
            from: 28801,
            to: 38400,
            tax: 6.8,
          },
          {
            from: 38401,
            to: 48000,
            tax: 7.2,
          },
          {
            from: 48001,
            to: 72000,
            tax: 7.6,
          },
          {
            from: 72001,
            to: 96000,
            tax: 7.9,
          },
          {
            from: 96001,
            to: 300000,
            tax: 8.25,
          },
          {
            from: 300001,
            to: 350000,
            tax: 9,
          },
          {
            from: 350001,
            to: 400000,
            tax: 10,
          },
          {
            from: 400001,
            to: "more",
            tax: 11,
          },
        ],
      },
      {
        state: "Idaho",
        singleTaxRates: [
          {
            from: "less",
            to: 1541,
            tax: 1.13,
          },
          {
            from: 1542,
            to: 3081,
            tax: 3.13,
          },
          {
            from: 3082,
            to: 4622,
            tax: 3.63,
          },
          {
            from: 4623,
            to: 6162,
            tax: 4.63,
          },
          {
            from: 6163,
            to: 7703,
            tax: 5.63,
          },
          {
            from: 7704,
            to: 11554,
            tax: 6.63,
          },
          {
            from: 11555,
            to: "more",
            tax: 6.93,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 3082,
            tax: 1.13,
          },
          {
            from: 3083,
            to: 6162,
            tax: 3.13,
          },
          {
            from: 6163,
            to: 9244,
            tax: 3.63,
          },
          {
            from: 9245,
            to: 12324,
            tax: 4.63,
          },
          {
            from: 12325,
            to: 15406,
            tax: 5.63,
          },
          {
            from: 15407,
            to: 23108,
            tax: 6.63,
          },
          {
            from: 23109,
            to: "more",
            tax: 6.93,
          },
        ],
      },
      {
        state: "Illinois",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 4.95,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 4.95,
          },
        ],
      },
      {
        state: "Indiana",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 3.23,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 3.23,
          },
        ],
      },
      {
        state: "Iowa",
        singleTaxRates: [
          {
            from: "less",
            to: 1638,
            tax: 0.33,
          },
          {
            from: 1639,
            to: 3276,
            tax: 0.67,
          },
          {
            from: 3277,
            to: 6552,
            tax: 2.25,
          },
          {
            from: 6553,
            to: 14742,
            tax: 4.14,
          },
          {
            from: 14743,
            to: 24570,
            tax: 5.63,
          },
          {
            from: 24571,
            to: 32760,
            tax: 5.96,
          },
          {
            from: 32761,
            to: 49140,
            tax: 6.25,
          },
          {
            from: 49141,
            to: 73710,
            tax: 7.44,
          },
          {
            from: 73711,
            to: "more",
            tax: 8.53,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 1638,
            tax: 0.33,
          },
          {
            from: 1639,
            to: 3276,
            tax: 0.67,
          },
          {
            from: 3277,
            to: 6552,
            tax: 2.25,
          },
          {
            from: 6553,
            to: 14742,
            tax: 4.14,
          },
          {
            from: 14743,
            to: 24570,
            tax: 5.63,
          },
          {
            from: 24571,
            to: 32760,
            tax: 5.96,
          },
          {
            from: 32761,
            to: 49140,
            tax: 6.25,
          },
          {
            from: 49141,
            to: 73710,
            tax: 7.44,
          },
          {
            from: 73711,
            to: "more",
            tax: 8.53,
          },
        ],
      },
      {
        state: "Kansas",
        singleTaxRates: [
          {
            from: "less",
            to: 15000,
            tax: 3.1,
          },
          {
            from: 15001,
            to: 30000,
            tax: 5.25,
          },
          {
            from: 30001,
            to: "more",
            tax: 5.7,
          },
        ],
        marriedTaxRates: [
          [
            {
              from: "less",
              to: 30000,
              tax: 3.1,
            },
            {
              from: 30001,
              to: 60000,
              tax: 5.25,
            },
            {
              from: 60001,
              to: "more",
              tax: 5.7,
            },
          ],
        ],
      },
      {
        state: "Kentucky",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 5,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 5,
          },
        ],
      },
      {
        state: "Louisiana",
        singleTaxRates: [
          {
            from: "less",
            to: 12500,
            tax: 2,
          },
          {
            from: 12501,
            to: 50000,
            tax: 4,
          },
          {
            from: 50001,
            to: "more",
            tax: 6,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 25000,
            tax: 2,
          },
          {
            from: 25001,
            to: 100000,
            tax: 4,
          },
          {
            from: 100001,
            to: "more",
            tax: 6,
          },
        ],
      },
      {
        state: "Maine",
        singleTaxRates: [
          {
            from: "less",
            to: 22200,
            tax: 5.8,
          },
          {
            from: 22201,
            to: 52600,
            tax: 6.75,
          },
          {
            from: 52601,
            to: "more",
            tax: 7.15,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 44450,
            tax: 5.8,
          },
          {
            from: 44451,
            to: 105200,
            tax: 6.75,
          },
          {
            from: 105201,
            to: "more",
            tax: 7.15,
          },
        ],
      },
      {
        state: "Maryland",
        singleTaxRates: [
          {
            from: "less",
            to: 1000,
            tax: 2,
          },
          {
            from: 1001,
            to: 2000,
            tax: 3,
          },
          {
            from: 2001,
            to: 3000,
            tax: 4,
          },
          {
            from: 3001,
            to: 100000,
            tax: 4.75,
          },
          {
            from: 100001,
            to: 125000,
            tax: 5,
          },
          {
            from: 125001,
            to: 150000,
            tax: 5.25,
          },
          {
            from: 150001,
            to: 250000,
            tax: 5.5,
          },
          {
            from: 250001,
            to: "more",
            tax: 5.75,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 1000,
            tax: 2,
          },
          {
            from: 1001,
            to: 2000,
            tax: 3,
          },
          {
            from: 2001,
            to: 3000,
            tax: 4,
          },
          {
            from: 3001,
            to: 150000,
            tax: 4.75,
          },
          {
            from: 150001,
            to: 175000,
            tax: 5,
          },
          {
            from: 175001,
            to: 225000,
            tax: 5.25,
          },
          {
            from: 225001,
            to: 300000,
            tax: 5.5,
          },
          {
            from: 300001,
            to: "more",
            tax: 5.75,
          },
        ],
      },
      {
        state: "Massachusetts",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 5,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 5,
          },
        ],
      },
      {
        state: "Michigan",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 4.25,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 4.25,
          },
        ],
      },
      {
        state: "Minnesota",
        singleTaxRates: [
          {
            from: "less",
            to: 26960,
            tax: 5.35,
          },
          {
            from: 26961,
            to: 88550,
            tax: 6.8,
          },
          {
            from: 88551,
            to: 164400,
            tax: 7.85,
          },
          {
            from: 164401,
            to: "more",
            tax: 9.85,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 39410,
            tax: 5.35,
          },
          {
            from: 39411,
            to: 156570,
            tax: 6.8,
          },
          {
            from: 156571,
            to: 273470,
            tax: 7.85,
          },
          {
            from: 273471,
            to: "more",
            tax: 9.85,
          },
        ],
      },
      {
        state: "Mississippi",
        singleTaxRates: [
          {
            from: "less",
            to: 1000,
            tax: 0,
          },
          {
            from: 1001,
            to: 5000,
            tax: 3,
          },
          {
            from: 5001,
            to: 10000,
            tax: 4,
          },
          {
            from: 10001,
            to: "more",
            tax: 5,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 1000,
            tax: 0,
          },
          {
            from: 1001,
            to: 5000,
            tax: 3,
          },
          {
            from: 5001,
            to: 10000,
            tax: 4,
          },
          {
            from: 10001,
            to: "more",
            tax: 5,
          },
        ],
      },
      {
        state: "Missouri",
        singleTaxRates: [
          {
            from: "less",
            to: 105,
            tax: 0,
          },
          {
            from: 106,
            to: 1053,
            tax: 1.5,
          },
          {
            from: 1054,
            to: 2106,
            tax: 2,
          },
          {
            from: 2107,
            to: 3159,
            tax: 2.5,
          },
          {
            from: 3160,
            to: 4212,
            tax: 3,
          },
          {
            from: 4213,
            to: 5265,
            tax: 3.5,
          },
          {
            from: 5266,
            to: 6318,
            tax: 4,
          },
          {
            from: 6319,
            to: 7371,
            tax: 4.5,
          },
          {
            from: 7372,
            to: 8424,
            tax: 5,
          },
          {
            from: 8425,
            to: "more",
            tax: 5.4,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 105,
            tax: 0,
          },
          {
            from: 106,
            to: 1053,
            tax: 1.5,
          },
          {
            from: 1054,
            to: 2106,
            tax: 2,
          },
          {
            from: 2107,
            to: 3159,
            tax: 2.5,
          },
          {
            from: 3160,
            to: 4212,
            tax: 3,
          },
          {
            from: 4213,
            to: 5265,
            tax: 3.5,
          },
          {
            from: 5266,
            to: 6318,
            tax: 4,
          },
          {
            from: 6319,
            to: 7371,
            tax: 4.5,
          },
          {
            from: 7372,
            to: 8424,
            tax: 5,
          },
          {
            from: 8425,
            to: "more",
            tax: 5.4,
          },
        ],
      },
      {
        state: "Montana",
        singleTaxRates: [
          {
            from: "less",
            to: 3100,
            tax: 1,
          },
          {
            from: 3101,
            to: 5400,
            tax: 2,
          },
          {
            from: 5401,
            to: 8200,
            tax: 3,
          },
          {
            from: 8201,
            to: 11100,
            tax: 4,
          },
          {
            from: 11101,
            to: 14300,
            tax: 5,
          },
          {
            from: 14301,
            to: 18400,
            tax: 6,
          },
          {
            from: 18401,
            to: "more",
            tax: 6.9,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 3100,
            tax: 1,
          },
          {
            from: 3101,
            to: 5400,
            tax: 2,
          },
          {
            from: 5401,
            to: 8200,
            tax: 3,
          },
          {
            from: 8201,
            to: 11100,
            tax: 4,
          },
          {
            from: 11101,
            to: 14300,
            tax: 5,
          },
          {
            from: 14301,
            to: 18400,
            tax: 6,
          },
          {
            from: 18401,
            to: "more",
            tax: 6.9,
          },
        ],
      },
      {
        state: "Nebraska",
        singleTaxRates: [
          {
            from: "less",
            to: 3230,
            tax: 2.46,
          },
          {
            from: 3231,
            to: 19330,
            tax: 3.51,
          },
          {
            from: 19331,
            to: 31160,
            tax: 5.01,
          },
          {
            from: 31161,
            to: "more",
            tax: 6.84,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 6440,
            tax: 2.46,
          },
          {
            from: 6441,
            to: 38680,
            tax: 3.51,
          },
          {
            from: 38681,
            to: 62320,
            tax: 5.01,
          },
          {
            from: 62321,
            to: "more",
            tax: 6.84,
          },
        ],
      },
      {
        state: "Nevada",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
      },
      {
        state: "New Hampshire",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 5,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 5,
          },
        ],
      },
      {
        state: "New Jersey",
        singleTaxRates: [
          {
            from: "less",
            to: 20000,
            tax: 1.4,
          },
          {
            from: 20001,
            to: 35000,
            tax: 1.75,
          },
          {
            from: 35001,
            to: 40000,
            tax: 3.5,
          },
          {
            from: 40001,
            to: 75000,
            tax: 5.53,
          },
          {
            from: 75001,
            to: 500000,
            tax: 6.37,
          },
          {
            from: 500001,
            to: 5000000,
            tax: 8.97,
          },
          {
            from: 5000001,
            to: "more",
            tax: 10.75,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 20000,
            tax: 1.4,
          },
          {
            from: 20001,
            to: 50000,
            tax: 1.75,
          },
          {
            from: 50001,
            to: 70000,
            tax: 2.45,
          },
          {
            from: 70001,
            to: 80000,
            tax: 3.5,
          },
          {
            from: 80001,
            to: 150000,
            tax: 5.53,
          },
          {
            from: 150001,
            to: 500000,
            tax: 6.37,
          },
          {
            from: 500001,
            to: 5000000,
            tax: 8.97,
          },
          {
            from: 5000001,
            to: "more",
            tax: 10.75,
          },
        ],
      },
      {
        state: "New Mexico",
        singleTaxRates: [
          {
            from: "less",
            to: 5500,
            tax: 1.7,
          },
          {
            from: 5501,
            to: 11000,
            tax: 3.2,
          },
          {
            from: 11001,
            to: 16000,
            tax: 4.7,
          },
          {
            from: 16001,
            to: "more",
            tax: 4.9,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 8000,
            tax: 1.7,
          },
          {
            from: 8001,
            to: 16000,
            tax: 3.2,
          },
          {
            from: 16001,
            to: 24000,
            tax: 4.7,
          },
          {
            from: 24001,
            to: "more",
            tax: 4.9,
          },
        ],
      },
      {
        state: "New York",
        singleTaxRates: [
          {
            from: "less",
            to: 8500,
            tax: 4,
          },
          {
            from: 8501,
            to: 11700,
            tax: 4.5,
          },
          {
            from: 11701,
            to: 13900,
            tax: 5.25,
          },
          {
            from: 13901,
            to: 21400,
            tax: 5.9,
          },
          {
            from: 21401,
            to: 80650,
            tax: 6.21,
          },
          {
            from: 80651,
            to: 215400,
            tax: 6.49,
          },
          {
            from: 215401,
            to: 1077550,
            tax: 6.85,
          },
          {
            from: 1077551,
            to: "more",
            tax: 8.82,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 17150,
            tax: 4,
          },
          {
            from: 17151,
            to: 23600,
            tax: 4.5,
          },
          {
            from: 23601,
            to: 27900,
            tax: 5.25,
          },
          {
            from: 27901,
            to: 43000,
            tax: 5.9,
          },
          {
            from: 43001,
            to: 161550,
            tax: 6.09,
          },
          {
            from: 161551,
            to: 323200,
            tax: 6.41,
          },
          {
            from: 323201,
            to: 2155350,
            tax: 6.85,
          },
          {
            from: 2155351,
            to: "more",
            tax: 8.82,
          },
        ],
      },
      {
        state: "North Carolina",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 5.25,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 5.25,
          },
        ],
      },
      {
        state: "North Dakota",
        singleTaxRates: [
          {
            from: "less",
            to: 39450,
            tax: 1.1,
          },
          {
            from: 39451,
            to: 95500,
            tax: 2.04,
          },
          {
            from: 95501,
            to: 199250,
            tax: 2.27,
          },
          {
            from: 199251,
            to: 433200,
            tax: 2.64,
          },
          {
            from: 433201,
            to: "more",
            tax: 2.9,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 65900,
            tax: 1.1,
          },
          {
            from: 65901,
            to: 159200,
            tax: 2.04,
          },
          {
            from: 159201,
            to: 242550,
            tax: 2.27,
          },
          {
            from: 242551,
            to: 433200,
            tax: 2.64,
          },
          {
            from: 433201,
            to: "more",
            tax: 2.9,
          },
        ],
      },
      {
        state: "Ohio",
        singleTaxRates: [
          {
            from: "less",
            to: 21750,
            tax: 0,
          },
          {
            from: 21751,
            to: 43450,
            tax: 2.85,
          },
          {
            from: 43451,
            to: 86900,
            tax: 3.33,
          },
          {
            from: 86901,
            to: 108700,
            tax: 3.8,
          },
          {
            from: 108701,
            to: 217400,
            tax: 4.41,
          },
          {
            from: 217401,
            to: "more",
            tax: 4.8,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 21750,
            tax: 0,
          },
          {
            from: 21751,
            to: 43450,
            tax: 2.85,
          },
          {
            from: 43451,
            to: 86900,
            tax: 3.33,
          },
          {
            from: 86901,
            to: 108700,
            tax: 3.8,
          },
          {
            from: 108701,
            to: 217400,
            tax: 4.41,
          },
          {
            from: 217401,
            to: "more",
            tax: 4.8,
          },
        ],
      },
      {
        state: "Oklahoma",
        singleTaxRates: [
          {
            from: "less",
            to: 1000,
            tax: 0.5,
          },
          {
            from: 1001,
            to: 2500,
            tax: 1,
          },
          {
            from: 2501,
            to: 3750,
            tax: 2,
          },
          {
            from: 3751,
            to: 4900,
            tax: 3,
          },
          {
            from: 4901,
            to: 7200,
            tax: 4,
          },
          {
            from: 7201,
            to: "more",
            tax: 5,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 2000,
            tax: 0.5,
          },
          {
            from: 2001,
            to: 5000,
            tax: 1,
          },
          {
            from: 5001,
            to: 7500,
            tax: 2,
          },
          {
            from: 7501,
            to: 9800,
            tax: 3,
          },
          {
            from: 9801,
            to: 12200,
            tax: 4,
          },
          {
            from: 12201,
            to: "more",
            tax: 5,
          },
        ],
      },
      {
        state: "Oregon",
        singleTaxRates: [
          {
            from: "less",
            to: 3550,
            tax: 5,
          },
          {
            from: 3551,
            to: 8900,
            tax: 7,
          },
          {
            from: 8901,
            to: 125000,
            tax: 9,
          },
          {
            from: 125001,
            to: "more",
            tax: 9.9,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 7100,
            tax: 5,
          },
          {
            from: 7101,
            to: 17800,
            tax: 7,
          },
          {
            from: 17801,
            to: 250000,
            tax: 9,
          },
          {
            from: 250001,
            to: "more",
            tax: 9.9,
          },
        ],
      },
      {
        state: "Pennsylvania",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 3.07,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 3.07,
          },
        ],
      },
      {
        state: "Rhode Island",
        singleTaxRates: [
          {
            from: "less",
            to: 65250,
            tax: 3.75,
          },
          {
            from: 65251,
            to: 148350,
            tax: 4.75,
          },
          {
            from: 148351,
            to: "more",
            tax: 5.99,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 65250,
            tax: 3.75,
          },
          {
            from: 65251,
            to: 148350,
            tax: 4.75,
          },
          {
            from: 148351,
            to: "more",
            tax: 5.99,
          },
        ],
      },
      {
        state: "South Carolina",
        singleTaxRates: [
          {
            from: "less",
            to: 3070,
            tax: 0,
          },
          {
            from: 3071,
            to: 6150,
            tax: 3,
          },
          {
            from: 6151,
            to: 9230,
            tax: 4,
          },
          {
            from: 9231,
            to: 12310,
            tax: 5,
          },
          {
            from: 12311,
            to: 15400,
            tax: 6,
          },
          {
            from: 15401,
            to: "more",
            tax: 7,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 3070,
            tax: 0,
          },
          {
            from: 3071,
            to: 6150,
            tax: 3,
          },
          {
            from: 6151,
            to: 9230,
            tax: 4,
          },
          {
            from: 9231,
            to: 12310,
            tax: 5,
          },
          {
            from: 12311,
            to: 15400,
            tax: 6,
          },
          {
            from: 15401,
            to: "more",
            tax: 7,
          },
        ],
      },
      {
        state: "South Dakota",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
      },
      {
        state: "Tennessee",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 1,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 1,
          },
        ],
      },
      {
        state: "Texas",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
      },
      {
        state: "Utah",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 4.95,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 4.95,
          },
        ],
      },
      {
        state: "Vermont",
        singleTaxRates: [
          {
            from: "less",
            to: 39600,
            tax: 3.35,
          },
          {
            from: 39601,
            to: 96000,
            tax: 6.6,
          },
          {
            from: 96001,
            to: 200200,
            tax: 7.6,
          },
          {
            from: 200201,
            to: "more",
            tax: 8.75,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 66150,
            tax: 3.35,
          },
          {
            from: 66151,
            to: 159950,
            tax: 6.6,
          },
          {
            from: 159951,
            to: 243750,
            tax: 7.6,
          },
          {
            from: 243751,
            to: "more",
            tax: 8.75,
          },
        ],
      },
      {
        state: "Virginia",
        singleTaxRates: [
          {
            from: "less",
            to: 3000,
            tax: 2,
          },
          {
            from: 3001,
            to: 5000,
            tax: 3,
          },
          {
            from: 5001,
            to: 17000,
            tax: 5,
          },
          {
            from: 17001,
            to: "more",
            tax: 5.75,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 3000,
            tax: 2,
          },
          {
            from: 3001,
            to: 5000,
            tax: 3,
          },
          {
            from: 5001,
            to: 17000,
            tax: 5,
          },
          {
            from: 17001,
            to: "more",
            tax: 5.75,
          },
        ],
      },
      {
        state: "Washington",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
      },
      {
        state: "West Virginia",
        singleTaxRates: [
          {
            from: "less",
            to: 10000,
            tax: 3,
          },
          {
            from: 10001,
            to: 25000,
            tax: 4,
          },
          {
            from: 25001,
            to: 40000,
            tax: 4.5,
          },
          {
            from: 40001,
            to: 60000,
            tax: 6,
          },
          {
            from: 60001,
            to: "more",
            tax: 6.5,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 10000,
            tax: 3,
          },
          {
            from: 10001,
            to: 25000,
            tax: 4,
          },
          {
            from: 25001,
            to: 40000,
            tax: 4.5,
          },
          {
            from: 40001,
            to: 60000,
            tax: 6,
          },
          {
            from: 60001,
            to: "more",
            tax: 6.5,
          },
        ],
      },
      {
        state: "Wisconsin",
        singleTaxRates: [
          {
            from: "less",
            to: 11970,
            tax: 4,
          },
          {
            from: 11971,
            to: 23930,
            tax: 5.21,
          },
          {
            from: 23931,
            to: 263480,
            tax: 6.27,
          },
          {
            from: 263481,
            to: "more",
            tax: 7.65,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: 15960,
            tax: 4,
          },
          {
            from: 15961,
            to: 31910,
            tax: 5.21,
          },
          {
            from: 31911,
            to: 351310,
            tax: 6.27,
          },
          {
            from: 351311,
            to: "more",
            tax: 7.65,
          },
        ],
      },
      {
        state: "Wyoming",
        singleTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
        marriedTaxRates: [
          {
            from: "less",
            to: "more",
            tax: 0,
          },
        ],
      },
    ],
    standard_deduction: 12400,
    social_security: 6.2,
    medicare: 1.45,
    year: "2021/22",
  },
];

/**
 ** ====================================
 ** Get Tax Rates
 ** ====================================
 */
const getTaxRates = (grossIncome, taxYear, filingStatus, state) => {
  //1) Find the tax rates of the year given
  const taxRate = taxRatesAmerica.find((rate) => rate.year === taxYear);

  //2) Find the federal tax rates
  let taxRateFederal = taxRate.federalTax.find(
    (rate) => rate.type === filingStatus
  ).taxSlabs;

  //3) Find the state tax rates
  const taxRateState = taxRate.stateTax.find((rate) => rate.state === state);

  //4) Calc the social security
  const socialSecurity = (grossIncome * taxRate.social_security) / 100;

  //5) Calc the medicare
  const medicare = (grossIncome * taxRate.medicare) / 100;

  //6) Calc total FICA
  const fica = parseFloat(socialSecurity) + parseFloat(medicare);

  //7) TaxSlabs
  const taxSlabs = [
    taxRateFederal,
    filingStatus === "Married - Filing Jointly"
      ? taxRateState.marriedTaxRates
      : taxRateState.singleTaxRates,
  ];

  //8) Calc Taxable Income
  const taxableIncome =
    grossIncome -
    (filingStatus === "Married - Filing Jointly"
      ? taxRate.standard_deduction * 2
      : taxRate.standard_deduction);

  return {
    taxableIncome,
    taxRateFederal,
    taxRateState,
    socialSecurity,
    medicare,
    fica,
    taxSlabs,
    currency: "$",
  };
};

/**
 ** ====================================
 ** CALCULATE AMERICA TAXES
 ** ====================================
 */
const calculateAmericaTaxes = (req, res) => {
  //1) Get params from query
  const income = req.query.income;
  const taxYear = req.query["tax-year"];
  const filingStatus = req.query["filing-status"];
  const state = req.query["state_or_province"];

  //2) Get tax rates for the given year
  const taxRates = getTaxRates(income, taxYear, filingStatus, state);

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
    state_tax: calculatedTaxInfo[1].totalTax.toFixed(2),
    social_security: parseFloat(taxRates.socialSecurity).toFixed(2),
    medicare: parseFloat(taxRates.medicare).toFixed(2),
    fica: parseFloat(taxRates.fica).toFixed(2),
    deduction: (
      parseFloat(calculatedTaxInfo[0].totalTax) +
      parseFloat(calculatedTaxInfo[1].totalTax) +
      parseFloat(taxRates.fica)
    ).toFixed(2),
    gross_income: parseFloat(income).toFixed(2),
    net_income: (
      parseFloat(income) -
      parseFloat(calculatedTaxInfo[0].totalTax) -
      parseFloat(calculatedTaxInfo[1].totalTax) -
      parseFloat(taxRates.fica)
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
module.exports.calculateAmericaTaxes = calculateAmericaTaxes;
