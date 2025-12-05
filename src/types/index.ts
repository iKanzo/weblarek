export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface IApiProductsResponse {
    items: IProduct[];
}

export interface IOrderPayload extends IBuyer {
    items: string[];
    total: number;
}

export interface IActions {
    onClick: (event: MouseEvent) => void;
}

// интерфейс формы заказа
export interface IOrderForm {
    payment?: string;
    address?: string;
    phone?: string;
    email?: string;
    total?: string | number;
}

export interface IOrder extends IOrderForm {
    items: string[];
}

export interface IOrderLot{
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

// тип ошибки формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;