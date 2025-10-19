import {IProduct} from '../../types';

export class Products {
    private items: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    constructor() {}

    setItems(items: IProduct[]): void {
        this.items = Array.isArray(items) ? [...items] : [];
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    getById(id: string): IProduct | undefined {
        return this.items.find((product) => product.id === id);
    }

    setSelectedItem(item: IProduct | null): void {
        this.selectedItem = item;
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}
