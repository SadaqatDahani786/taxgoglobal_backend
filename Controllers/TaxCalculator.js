/**
 ** ====================================
 ** IsIncomeValid
 ** ====================================
 */
const isIncomeValid = (income) => {
  return !isNaN(income) && income >= 0;
};

/**
 ** ====================================
 ** CalculateTax
 ** ====================================
 */
const calculateTax = (income, taxSlabs) => {
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
    if (income >= from && taxBand[i].type !== "flat") {
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
    } else if (income >= from && income <= to && taxBand[i].type === "flat") {
      totalTax = taxBand[i].tax;
      slabWiseTax.push({
        taxSlab: {
          from: from,
          to: to,
          tax: taxBand[i].tax,
        },
        tax: taxBand[i].tax,
      });
    }
  }

  //If more than one taxSlabs, use recursion to calc all
  if (taxSlabs.length > 1 && Array.isArray(taxSlabs[1])) {
    const calcc = calculateTax(income, [...taxSlabs].splice(1));
    return [
      { income: income, totalTax: totalTax, slabWiseTax: slabWiseTax },
      calcc,
    ];
  } else
    return {
      income: income,
      totalTax: totalTax,
      slabWiseTax: slabWiseTax,
    };
};

/**
 ** ====================================
 ** EXPORTS
 ** ====================================
 */
module.exports.calculateTax = calculateTax;
module.exports.isIncomeValid = isIncomeValid;
