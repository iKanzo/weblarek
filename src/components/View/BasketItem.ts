import {IActions, IProduct} from "../../types";
import {IEvents} from "../base/Events";
import {formatPrice} from '../../utils/utils';

export interface IBasketItem {
    basketItem: HTMLElement;
    index:HTMLElement;
    title: HTMLElement;
    price: HTMLElement;
    buttonDelete: HTMLButtonElement;
    render(data: IProduct, item: number): HTMLElement;
}

export class BasketItem implements IBasketItem {
    basketItem: HTMLElement;
    index:HTMLElement;
    title: HTMLElement;
    price: HTMLElement;
    buttonDelete: HTMLButtonElement;

    constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
        this.basketItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
        this.index = this.basketItem.querySelector('.basket__item-index');
        this.title = this.basketItem.querySelector('.card__title');
        this.price = this.basketItem.querySelector('.card__price');
        this.buttonDelete = this.basketItem.querySelector('.basket__item-delete');

        if (actions?.onClick) {
            this.buttonDelete.addEventListener('click', actions.onClick);
        }
    }

    protected getPrice(value: number | null): string {
        return formatPrice(value);
    }

    render(data: IProduct, item: number) {
        this.index.textContent = String(item);
        this.title.textContent = data.title;
        this.price.textContent = this.getPrice(data.price);
        return this.basketItem;
    }
}