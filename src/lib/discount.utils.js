import Dinero from 'dinero.js';

const Money = Dinero;
Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

const calculatePercentageDiscount = (amount, { condition, quantity }) => {
  debugger;
  if (condition?.percentage && quantity > condition.minimum)
    return amount.percentage(condition.percentage);

  return Money({ amount: 0 });
};

const calculateQuantityDiscount = (amount, { condition, quantity }) => {
  const isEven = quantity % 2 === 0;

  if (condition?.quantity && quantity > condition.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }
  return Money({ amount: 0 });
};

export const calculateDiscount = (amount, quantity, condition) => {
  const conditionsList = Array.isArray(condition) ? condition : [condition];

  const [higherDiscount] = conditionsList
    .map(condition => {
      if (condition?.percentage)
        return calculatePercentageDiscount(amount, {
          condition,
          quantity,
        }).getAmount();
      else if (condition?.quantity)
        return calculateQuantityDiscount(amount, {
          condition,
          quantity,
        }).getAmount();
    })
    .sort((a, b) => b - a);

  return Money({ amount: higherDiscount });
};
