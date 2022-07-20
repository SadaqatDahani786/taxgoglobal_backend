//Check if income is a valid number
const isIncomeValid = (income) => {
  return !isNaN(income) && income >= 0;
};

//Calculate Tax
const calculateTax = (income, taxSlabs, acc, currency) => {
  let totalTax = 0;
  let slabWiseTax = [];
  let taxBand =
    taxSlabs.length > 0 && Array.isArray(taxSlabs[0]) ? taxSlabs[0] : taxSlabs;

  //Loop over each taxslabs to check if income is in range
  for (let i = 0; i < taxBand.length; i++) {
    //From -> If not a number, 1 will be return
    let from = isNaN(parseFloat(taxBand[i].from)) ? 0 : taxBand[i].from;

    //To -> If not a number, income will be used
    let to = isNaN(parseFloat(taxBand[i].to)) ? income : taxBand[i].to;

    //If income is in range for current tax slab
    if (income >= from) {
      let taxableIncome = (income > to ? to : income) - from + 1;
      let slabTax = (taxableIncome * taxBand[i].tax) / 100;
      totalTax += slabTax;
      slabWiseTax.push({
        taxSlab: {
          from: from,
          to: to,
          tax: taxBand[i].tax,
        },
        tax: slabTax,
      });
    }
  }

  //Calc ncc using recursion
  let ncc = { totalTax: 0 };
  if (taxSlabs.length > 1 && Array.isArray(taxSlabs[1]))
    ncc = calculateTax(income, taxSlabs[1], acc, currency);

  //Calculate acc tax
  let calcAccTax = (income * acc) / 100;

  //Return the tax calculated
  return {
    income: income,
    totalTax: totalTax,
    slabWiseTax: slabWiseTax,
    ncc: ncc,
    acc: {
      tax: calcAccTax,
      percentage: acc,
    },
    currency: currency,
  };
};

module.exports.calculateTax = calculateTax;
module.exports.isIncomeValid = isIncomeValid;
