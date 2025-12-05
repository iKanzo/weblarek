import {Api, ApiListResponse} from '../base/Api';
import {IOrderLot, IOrderResult, IProduct} from '../../types';

export interface IApiModel {
    cdn: string;
    items: IProduct[];
    getListProductCard: () => Promise<IProduct[]>;
    postOrderLot: (order: IOrderLot) => Promise<IOrderResult>;
}

export class ApiModel extends Api {
    cdn: string;
    items: IProduct[];

    constructor(baseUrl: string, cdn: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    // получаем массив объектов(карточек) с сервера
    getListProductCard(): Promise<IProduct[]> {
        return this.get('/product')
            .then((data: ApiListResponse<IProduct>) => {
                return data.items.map((item) => ({
                    ...item,
                    image: this.cdn + item.image,
                }));
            });
    }

    // получаем ответ от сервера по сделанному заказу
    async postOrderLot(data: any) {
        const response = await fetch(`${this.baseUrl}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

}