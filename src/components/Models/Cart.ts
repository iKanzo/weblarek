import {IProduct} from '../../types';

export class Cart {
    private items: IProduct[] = [];


    constructor() {
        this.items = [];
    }

    set basketProducts(data: IProduct[]) {
        this.items = data;
    }

    get basketProducts() {
        return this.items.filter(p => p !== undefined && p !== null);
    }

    // количество товара в корзине
    getCounter() {
        return this.basketProducts.length;
    }

    // сумма всех товаров в корзине
    getSumAllProducts() {
        return this.basketProducts
            .filter((p) => p)                // <-- убираем undefined
            .reduce((sum, p) => sum + p.price, 0);
    }

    // добавить карточку товара в корзину
    setSelectedCard(data: IProduct) {
        this.items.push(data);
    }

    // удалить карточку товара из корзины
    deleteCardToBasket(item: IProduct) {
        const index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
    }

    clearBasketProducts() {
        this.basketProducts = []
    }
}
