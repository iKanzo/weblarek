import {IProduct} from "../../types";
import {IEvents} from "../base/Events";

export interface IProducts {
    productCards: IProduct[];
    selectedCard: IProduct;
    setPreview(item: IProduct): void;
}

export class Products implements IProducts {
    protected _productCards: IProduct[];
    selectedCard: IProduct;

    constructor(protected events: IEvents) {
        this._productCards = []
    }

    set productCards(data: IProduct[]) {
        this._productCards = data;
        this.events.emit('productCards:receive');
    }

    get productCards() {
        return this._productCards;
    }

    setPreview(item: IProduct) {
        this.selectedCard = item;
        this.events.emit('modalCard:open', item)
    }
}