import {Card} from "./Card";
import {IActions, IProduct} from "../../types";
import {IEvents} from "../base/Events";

export interface ICard {
    text: HTMLElement;
    button: HTMLElement;
    render(data: IProduct): HTMLElement;
}

export class CardPreview extends Card implements ICard {
    text: HTMLElement;
    button: HTMLElement;
    protected _product: IProduct;

    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
        super(template, events, actions);
        this.text = this._cardElement.querySelector('.card__text');
        this.button = this._cardElement.querySelector('.card__button');
        // обработка клика по кнопке "Купить / Удалить из корзины"
        this.button.addEventListener('click', () => {
            if (!this._product) return;
            this.updateButtonText();
            const inBasket = this.button.dataset.inBasket === 'true';

            if (inBasket) {
                this.events.emit('basket:basketItemRemove', this._product);
            } else {
                this.events.emit('card:addBasket', this._product);
            }
            // переключаем текст кнопки
            this.toggleButtonState(!inBasket);
        });

    }

    // метод для переключения состояния кнопки
    toggleButtonState(inBasket: boolean) {
        this.button.textContent = inBasket ? 'Удалить из корзины' : 'Купить';
        this.button.dataset.inBasket = inBasket ? 'true' : 'false';
    }

    // метод проверки, продаётся ли товар
    notSale(data: IProduct) {
        if (data.price === null || data.price === undefined) {
            this.button.setAttribute('disabled', 'true');
            this.button.textContent = 'Недоступно';
            this.button.dataset.inBasket = 'false';
        } else {
            this.button.removeAttribute('disabled');
        }
    }

    updateButtonText() {
        if (!this._product) return;
        const id = this._product.id;
        const handler = (exists: boolean) => {
            this.toggleButtonState(exists);
            this.events.off(`cart:checkResponse:${id}`, handler);
        };

        this.events.on(`cart:checkResponse:${id}`, handler);
        this.events.emit('cart:checkRequest', id);
    }


    // рендер карточки товара
    render(data: IProduct): HTMLElement {
        this._product = data;
        this._cardCategory.textContent = data.category;
        this.cardCategory = data.category;
        this._cardTitle.textContent = data.title;
        this._cardImage.src = data.image;
        this._cardImage.alt = this._cardTitle.textContent;
        this._cardPrice.textContent = this.setPrice(data.price);
        this.text.textContent = data.description;
        this.button.textContent = this.notSale(data);
        this.notSale(data);
        // если товар доступен, обновляем текст кнопки по состоянию корзины
        if (data.price !== null && data.price !== undefined) {
            this.updateButtonText();
        }
        return this._cardElement;
    }
}
