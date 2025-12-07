import {IEvents} from "../base/Events";

export class HeaderView {
    protected basketButton: HTMLButtonElement;
    protected basketCounter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        this.basketButton = container.querySelector('.header__basket');
        this.basketCounter = container.querySelector('.header__basket-counter');

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.basketCounter.textContent = String(value);
    }
}
