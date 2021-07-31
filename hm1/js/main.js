const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class ProductsList {
  constructor(container = '.products') {
    this.container = container;
    this.goods = [];
    this._getProducts()
      .then(data => {
        this.goods = [...data];
        this.render()
      });
  }
  _getProducts() {
    return fetch(`${API}/catalogData.json`)
      .then(result => result.json())
      .catch(error => {
        console.log(error);
      })
  }
  calcSum() {
    return this.allProducts.reduce((accum, item) => accum += item.price, 0);
  }
  render() {
    const block = document.querySelector(this.container);
    for (let product of this.goods) {
      const productObj = new ProductItem(product);
      block.insertAdjacentHTML('beforeend', productObj.render());
    }
  }
}

class ProductItem {
  constructor(product, img = 'https://via.placeholder.com/200x150') {
    this.title = product.product_name;
    this.price = product.price;
    this.id = product.id_product;
    this.img = img;
  }
  render() {
    return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.title}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn">Купить</button>
                </div>
            </div>`
  }
}

let list = new ProductsList();

class Basket {
  constructor(container = '.cart__list') {
    this.container = container;
    this.goods = [];
    this._hiddenBasket();
    this._getBasketElem()
      .then(data => {
        this.goods = [...data.contents];
        this.render()
      })
  }
  _getBasketElem() {
    return fetch(`${API}/getBasket.json`)
      .then(result => result.json())
      .catch(error => {
        console.log(error);
      })
  }
  render() {
    const block = document.querySelector(this.container);
    for (let product of this.goods) {
      const productElem = new BasketElem();
      block.insertAdjacentHTML('beforeend', productElem.render(product));
    }
  }
  _hiddenBasket() {
    document.querySelector(".btn-cart").addEventListener('click', () => {
      document.querySelector(this.container).classList.toggle('hidden');
    });
  }
}
class BasketElem {
  render(product) {
    return `<div class="cart__elem" data-id="${product.id_product}">
              <div class="product__wrap-left">
                <img src="${product.img}" alt="Some img">
                <div class="product__desc">
                  <p class="product__name">${product.product_name}</p>
                  <p class="product__quantity">Количетсво: ${product.quantity}</p>
                  <p class="product__price">${product.price}$</p>
                </div>
              </div>
              <div class="product__wrap-right">
                <p class="product_price_total">${product.quantity * product.price}$</p>
                <button class="del-product" data-id="${product.id_product}">X</button>
              </div>
            </div>`
  }
}

let bask = new Basket();