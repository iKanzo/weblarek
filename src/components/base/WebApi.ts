import {IApi, IApiProductsResponse, IOrderPayload, IProduct,} from '../../types';

export class WebApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async fetchProducts(): Promise<IProduct[]> {
        const response = (await this.api.get('/product/')) as IApiProductsResponse;
        if (response && Array.isArray(response.items)) {
            return response.items;
        }
        throw new Error('Некорректный формат данных с сервера');
    }

    async sendOrder(payload: IOrderPayload): Promise<object> {
        return this.api.post('/order/', payload);
    }
}
