import {IEvents} from '../base/Events';

export class GalleryView {
    constructor(
        private container: HTMLElement,
        private events: IEvents
    ) {}

    setItems(items: HTMLElement[]) {
        this.container.innerHTML = '';
        items.forEach(item => this.container.append(item));
    }
}
