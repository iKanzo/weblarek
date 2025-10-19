import {IProduct} from '../../types';

export class Cart {
    private items: IProduct[] = [];

    constructor() {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
        }
    }

    removeItem(id: string): void {
        this.items = this.items.filter((i) => i.id !== id);
    }

    clear(): void {
        this.items = [];
    }

    getTotal(): number {
        return this.items.reduce((sum, i) => sum + (i.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some((i) => i.id === id);
    }
}
