export const totalSale = (itemsSale) => {
  return itemsSale.length == 0
    ? 0
    : itemsSale.length == 1
    ? itemsSale[0].price_sale * itemsSale[0].amount
    : itemsSale.reduce((acumulator, currentValue) => {
        let acum = acumulator.price_sale * acumulator.amount;
        let current = currentValue.price_sale * currentValue.amount;
        return { price_sale: acum + current, amount: 1 };
      }).price_sale;
};
