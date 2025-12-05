import {IEvents} from "../base/Events";

export interface IModal {
    open(): void;
    close(): void;
    render(): HTMLElement
}

export class Modal implements IModal {
    protected modalContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected _pageWrapper: HTMLElement;
    private _handleEsc: (e: KeyboardEvent) => void;
    private _scrollPosition: number = 0;

    constructor(modalContainer: HTMLElement, protected events: IEvents) {
        this.modalContainer = modalContainer;
        this.closeButton = modalContainer.querySelector('.modal__close');
        this._content = modalContainer.querySelector('.modal__content');
        this._pageWrapper = document.querySelector('.page__wrapper');

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.modalContainer.addEventListener('click', this.close.bind(this));
        this.modalContainer.querySelector('.modal__container').addEventListener('click', event => event.stopPropagation());

        this._handleEsc = this._onEsc.bind(this);
    }

    private _onEsc(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    // принимает элемент разметки которая будет отображаться в "modal__content" модального окна
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    // открытие модального окна
    open() {
        this._scrollPosition = window.scrollY || window.pageYOffset;
        this.modalContainer.classList.add('modal_active');
        document.addEventListener('keydown', this._handleEsc);
        this.locked = true;
        this._pageWrapper.style.top = `-${this._scrollPosition}px`;
        this.events.emit('modal:open');
    }

    // закрытие модального окна
    close() {
        this.modalContainer.classList.remove('modal_active');
        this.content = null;
        document.removeEventListener('keydown', this._handleEsc);
        this.locked = false;
        this._pageWrapper.style.top = '';
        window.scrollTo(0, this._scrollPosition);
        this.events.emit('modal:close');
    }

    set locked(value: boolean) {
        if (value) {
            this._pageWrapper.classList.add('page__wrapper_locked');
        } else {
            this._pageWrapper.classList.remove('page__wrapper_locked');
        }
    }

    render(): HTMLElement {
        this._content;
        this.open();
        return this.modalContainer
    }
}