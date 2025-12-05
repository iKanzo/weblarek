import {IActions, IProduct} from "../../types";
import {IEvents} from "../base/Events";

export interface ICard {
    render(data: IProduct): HTMLElement;
}

export class Card implements ICard {
    protected _cardElement: HTMLElement;
    protected _cardCategory: HTMLElement;
    protected _cardTitle: HTMLElement;
    protected _cardImage: HTMLImageElement;
    protected _cardPrice: HTMLElement;
    protected _product: IProduct;

    protected _colors = {
        "дополнительное": "additional",
        "софт-скил": "soft",
        "кнопка": "button",
        "хард-скил": "hard",
        "другое": "other",
    }

    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
        this._cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
        this._cardCategory = this._cardElement.querySelector('.card__category');
        this._cardTitle = this._cardElement.querySelector('.card__title');
        this._cardImage = this._cardElement.querySelector('.card__image');
        this._cardPrice = this._cardElement.querySelector('.card__price');

        if (actions?.onClick) {
            this._cardElement.addEventListener('click', () => actions.onClick(this._product));
        }
    }

    public setPrice(value: number | null): string {
        if (value === null) return 'Бесценно';
        return `${value} синапсов`;
    }


    render(data: IProduct): HTMLElement {
        this._product = data;

        this._cardCategory.textContent = data.category;
        this._cardCategory.className = `card__category card__category_${this._colors[data.category]}`;
        this._cardTitle.textContent = data.title;
        this._cardImage.src = data.image;
        this._cardImage.alt = data.title;
        this._cardPrice.textContent = data.price === null ? 'Бесценно' : `${data.price} синапсов`;

        return this._cardElement;
    }
}
