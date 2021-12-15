import { remove, find } from 'lodash';
import Dinero from 'dinero.js';

const Money = Dinero;
Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

import { calculateDiscount } from './discount.utils';

export default class Cart {
  items = [];

  add(item) {
    if (find(this.items, { product: item.product }))
      remove(this.items, { product: item.product });
    this.items.push(item);
  }

  remove(product) {
    remove(this.items, { product });
  }

  summary() {
    const total = this.getTotal().getAmount();
    const items = this.items;
    const formattedTotal = this.getTotal().toFormat('$0,0.00');

    return {
      total,
      formattedTotal,
      items,
    };
  }

  checkout() {
    const { total, items } = this.summary();

    this.items = [];

    return {
      total,
      items,
    };
  }

  getTotal() {
    return this.items.reduce((acc, { quantity, product, condition }) => {
      const amount = Money({ amount: quantity * product.price });
      let discount = Money({ amount: 0 });

      if (condition) {
        discount = calculateDiscount(amount, quantity, condition);
      }

      return acc.add(amount.subtract(discount));
    }, Money({ amount: 0 }));
  }
}
