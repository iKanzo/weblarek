import {IBuyer, TPayment} from '../../types';

export class Buyer {
    private payment: TPayment | null = null;
    private email = '';
    private phone = '';
    private address = '';

    constructor() {}

    save(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
    }

    get(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    validate(): Record<string, string> {
        const errors: Record<string, string> = {};
        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.address.trim()) errors.address = 'Укажите адрес доставки';
        if (!this.email.trim()) errors.email = 'Укажите емэйл';
        if (!this.phone.trim()) errors.phone = 'Укажите телефон';
        return errors;
    }

    validateStep1(): Record<string, string> {
        const errors: Record<string, string> = {};
        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.address.trim()) errors.address = 'Укажите адрес доставки';
        return errors;
    }

    validateStep2(): Record<string, string> {
        const errors: Record<string, string> = {};
        if (!this.email.trim()) errors.email = 'Укажите емэйл';
        if (!this.phone.trim()) errors.phone = 'Укажите телефон';
        return errors;
    }
}
