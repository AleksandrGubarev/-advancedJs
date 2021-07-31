const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class List {
  constructor(url, container, list = list2) {
    this.container = container;
    this.list = list;
    this.url = url;
    this.goods = [];
    this.allProducts = [];
    this._init();
  }
  getJson(url) {
    return fetch(url ? url : `${API + this.url}`)
      .then(result => result.json())
      .catch(error => {
        cosole.log('error');
      })
  }
  handleData(data) {
    this.goods = [...data];
    this.render();
  }
  calcSum() {
    return this.allProducts.reduce((accum, item) => accum += item.price, 0);
  }
  render() {
    const block = document.querySelector(this.container);
    for (let product of this.goods) {
      const productObj = new this.list[this.constructor.name](product);
      this.allProducts.push(productObj);
      block.insertAdjacentHTML('beforeend', productObj.render());
    }
  }
  _init() {
    return false
  }
}

class Item {
  constructor(el, img = 'https://via.placeholder.com/200x150') {
    this.product_name = el.product_name;
    this.price = el.price;
    this.id_product = el.id_product;
    this.img = img;
  }
  render() {
    return `<div class="product-item" data-id="${this.id_product}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.product_name}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn"
                    data-id="${this.id_product}"
                    data-name="${this.product_name}"
                    data-price="${this.price}">Купить</button>
                </div>
            </div>`
  }
}

class ProductsList extends List {
  constructor(cart, container = '.products', url = "/catalogData.json") {
    super(url, container);
    this.cart = cart;
    this.getJson()
      .then(data => this.handleData(data));
  }
  _init() {
    document.querySelector(this.container).addEventListener('click', e => {
      if (e.target.classList.contains('buy-btn')) {
        this.cart.addProduct(e.target);
      }
    })
  }
}

class ProductItem extends Item { }

class Cart extends List {
  constructor(container = ".cart__list", url = "/getBasket.json") {
    super(url, container);
    this.getJson()
      .then(data => {
        this.handleData(data.contents);
      });
  }
  addProduct(element) {
    this.getJson(`${API}/addToBasket.json`)
      .then(data => {
        if (data.result === 1) {
          let productId = +element.dataset['id'];
          let find = this.allProducts.find(product => product.id_product === productId);
          if (find) {
            find.quantity++;
            this._updateCart(find);
          } else {
            let product = {
              id_product: productId,
              price: +element.dataset['price'],
              product_name: element.dataset['name'],
              quantity: 1
            };
            this.goods = [product];
            this.render();
          }
        } else {
          alert('Error');
        }
      })
  }
  removeProduct(element) {
    this.getJson(`${API}/deleteFromBasket.json`)
      .then(data => {
        if (data.result === 1) {
          let productId = +element.dataset['id'];
          let find = this.allProducts.find(product => product.id_product === productId);
          if (find.quantity > 1) {
            find.quantity--;
            this._updateCart(find);
          } else {
            this.allProducts.splice(this.allProducts.indexOf(find), 1);
            document.querySelector(`.cart__elem[data-id="${productId}"]`).remove();
          }
        } else {
          alert('Error');
        }
      })
  }
  _updateCart(product) {
    let block = document.querySelector(`.cart__elem[data-id='${product.id_product}]`);
    block.querySelector('.product__quantity').textContent = `Количетсво: ${product.quantity}`;
    block.querySelector('.product_price_total').textContent = `${product.quantity * product.price}$`;
  }
  _init() {
    document.querySelector('.btn-cart').addEventListener('click', () => {
      document.querySelector(this.container).classList.toggle('hidden');
    });
    document.querySelector(this.container).addEventListener('click', e => {
      if (e.target.classList.contains('del-btn')) {
        this.removeProduct(e.target);
      }
    })
  }
}

class CartItem extends Item {
  constructor(el, img = 'https://placehold.it/50x100') {
    super(el, img);
    this.quantity = el.quantity;
  }
  render() {
    return `
      <div class="cart__elem" data-id="${this.id_product}">
        <div class="product__wrap-left">
          <img src="${this.img}" alt="Some ibage">
          <div class="product__desc">
            <p class="product__name">${this.product_name}</p>
            <p class="product__quantity">Количетсво: ${this.quantity}</p>
            <p class="product-price">${this.price} $</p>
          </div>
        </div>-
        <div class="product__wrap-right">
          <p class="product_price_total">${this.quantity * this.price}</p>
          <button class="del-btn" data-id="${this.id_product}">X</button>
        </div>
      </div>
    `
  }
}
const list2 = {
  ProductsList: ProductItem,
  Cart: CartItem
};

let cart = new Cart();
let products = new ProductsList(cart);

// class ProductsList {
//   constructor(container = '.products') {
//     this.container = container;
//     this.goods = [];
//     this._getProducts()
//       .then(data => {
//         this.goods = [...data];
//         this.render()
//       });
//   }
//   _getProducts() {
//     return fetch(`${API}/catalogData.json`)
//       .then(result => result.json())
//       .catch(error => {
//         console.log(error);
//       })
//   }
//   calcSum() {
//     return this.allProducts.reduce((accum, item) => accum += item.price, 0);
//   }
//   render() {
//     const block = document.querySelector(this.container);
//     for (let product of this.goods) {
//       const productObj = new ProductItem(product);
//       block.insertAdjacentHTML('beforeend', productObj.render());
//     }
//   }
// }

// class ProductItem {
//   constructor(product, img = 'https://via.placeholder.com/200x150') {
//     this.title = product.product_name;
//     this.price = product.price;
//     this.id = product.id_product;
//     this.img = img;
//   }
//   render() {
//     return `<div class="product-item" data-id="${this.id}">
//                 <img src="${this.img}" alt="Some img">
//                 <div class="desc">
//                     <h3>${this.title}</h3>
//                     <p>${this.price} $</p>
//                     <button class="buy-btn">Купить</button>
//                 </div>
//             </div>`
//   }
// }

// let list = new ProductsList();

// class Basket {
//   constructor(container = '.cart__list') {
//     this.container = container;
//     this.goods = [];
//     this._hiddenBasket();
//     this._getBasketElem()
//       .then(data => {
//         this.goods = [...data.contents];
//         this.render()
//       })
//   }
//   _getBasketElem() {
//     return fetch(`${API}/getBasket.json`)
//       .then(result => result.json())
//       .catch(error => {
//         console.log(error);
//       })
//   }
//   render() {
//     const block = document.querySelector(this.container);
//     for (let product of this.goods) {
//       const productElem = new BasketElem();
//       block.insertAdjacentHTML('beforeend', productElem.render(product));
//     }
//   }
//   _hiddenBasket() {
//     document.querySelector(".btn-cart").addEventListener('click', () => {
//       document.querySelector(this.container).classList.toggle('hidden');
//     });
//   }
// }
// class BasketElem {
//   render(product) {
//     return `<div class="cart__elem" data-id="${product.id_product}">
//               <div class="product__wrap-left">
//                 <img src="${product.img}" alt="Some img">
//                 <div class="product__desc">
//                   <p class="product__name">${product.product_name}</p>
//                   <p class="product__quantity">Количетсво: ${product.quantity}</p>
//                   <p class="product__price">${product.price}$</p>
//                 </div>
//               </div>
//               <div class="product__wrap-right">
//                 <p class="product_price_total">${product.quantity * product.price}$</p>
//                 <button class="del-btn" data-id="${product.id_product}">X</button>
//               </div>
//             </div>`
//   }
// }

// let bask = new Basket();