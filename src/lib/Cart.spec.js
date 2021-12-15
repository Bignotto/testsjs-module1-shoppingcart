import Cart from './Cart';

describe('Cart', () => {
  let cart;
  let product;
  let product2;

  beforeEach(() => {
    cart = new Cart();
    product = {
      title: 'Fraldinha Red Angus',
      price: 6875,
    };
    product2 = {
      title: 'Entranha Fina',
      price: 11990,
    };
  });

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created cart', () => {
      expect(cart.getTotal().getAmount()).toEqual(0);
    });

    it('should multiply quantity and price and calculate the total amount', () => {
      const item = {
        product,
        quantity: 2, //70776
      };
      cart.add(item);

      expect(cart.getTotal().getAmount()).toEqual(13750);
    });

    it('should ensure only one of each product in shopping cart', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product,
        quantity: 1,
      });
      expect(cart.getTotal().getAmount()).toEqual(6875);
    });

    it('should update total when a product gets included then removed', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      cart.remove(product);

      expect(cart.getTotal().getAmount()).toEqual(11990);
    });
  });

  describe('checkout()', () => {
    it('should return an object with the total and a list of items', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      expect(cart.checkout()).toMatchSnapshot();
    });

    it('should return an object with the total and a list of items when sumary() is calle', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      expect(cart.summary()).toMatchSnapshot();
      expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
    });

    it('should return formatted amount when summary is called', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      expect(cart.summary().formattedTotal).toEqual('R$257.40');
    });

    it('should reset the cart when checkout() is called', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.checkout();

      expect(cart.getTotal().getAmount()).toEqual(0);
    });
  });

  describe('special conditions', () => {
    it('should apply a discount over the item total when a minimum quantity threshold is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 3,
      });

      expect(cart.getTotal().getAmount()).toEqual(14437);
    });

    it('should apply a discount over the item total for even quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 4,
      });

      expect(cart.getTotal().getAmount()).toEqual(13750);
    });

    it('should apply a discount over the item total for odd quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toEqual(20625);
    });

    //
    it('should not apply a discount over the item total when a minimum quantity threshold is not passed', () => {
      const condition = {
        percentage: 30,
        minimum: 4,
      };

      cart.add({
        product,
        condition,
        quantity: 3,
      });

      expect(cart.getTotal().getAmount()).toEqual(20625);
    });

    it('should not apply a discount over the item total for even quantities', () => {
      const condition = {
        quantity: 6,
      };

      cart.add({
        product,
        condition,
        quantity: 4,
      });

      expect(cart.getTotal().getAmount()).toEqual(27500);
    });

    it('should receive two or more conditions and apply the one with higher discount case 1', () => {
      const condition1 = {
        quantity: 2,
      };
      const condition2 = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition: [condition1, condition2],
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toEqual(20625);
    });

    it('should receive two or more conditions and apply the one with higher discount case 2', () => {
      const condition1 = {
        quantity: 2,
      };
      const condition2 = {
        percentage: 80,
        minimum: 2,
      };

      cart.add({
        product,
        condition: [condition1, condition2],
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toEqual(6875);
    });
  });
});
