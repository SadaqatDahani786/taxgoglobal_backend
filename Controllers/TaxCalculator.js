class TaxCalculator {
  //Tax Calculate Constructor
  constructor(income, taxSlabs, acc, currency) {
    this.income = parseFloat(income);
    this.taxSlabs = taxSlabs;
    this.acc = acc;
    this.currency = currency;
  }

  //Check if income is a valid number
  isIncomeValid = () => {
    return !isNaN(this.income) && this.income >= 0;
  };

  //Calculate Tax
  calculateTax = () => {
    let totalTax = 0;
    let slabWiseTax = [];

    //Loop over each taxslabs to check if income is in range
    for (let i = 0; i < this.taxSlabs.length; i++) {
      //From -> If not a number, 1 will be return
      let from = isNaN(parseFloat(this.taxSlabs[i].from))
        ? 1
        : this.taxSlabs[i].from;

      //To -> If not a number, income will be used
      let to = isNaN(parseFloat(this.taxSlabs[i].to))
        ? this.income
        : this.taxSlabs[i].to;

      //If income is in range for current tax slab
      if (this.income >= from) {
        let taxableIncome = (this.income > to ? to : this.income) - from + 1;
        let slabTax = (taxableIncome * this.taxSlabs[i].tax) / 100;
        totalTax += slabTax;
        slabWiseTax.push({
          taxSlab: {
            from: from,
            to: to,
            tax: this.taxSlabs[i].tax,
          },
          tax: slabTax,
        });
      }
    }

    //Calculate acc tax
    let calcAccTax = (this.income * this.acc) / 100;

    //Return the tax calculated
    return {
      income: this.income,
      totalTax: totalTax,
      slabWiseTax: slabWiseTax,
      acc: {
        tax: calcAccTax,
        percentage: this.acc,
      },
      currency: this.currency,
    };
  };
}

module.exports = TaxCalculator;
