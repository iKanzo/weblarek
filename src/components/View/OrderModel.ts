export class OrderModel {
    paymentMethod: string | null = null;
    address: string = '';
    valid: boolean = false;

    setPaymentMethod(method: string) {
        this.paymentMethod = method;
    }

    setAddress(value: string) {
        this.address = value;
    }

    validate(): boolean {
        this.valid = !!this.paymentMethod && !!this.address;
        return this.valid;
    }
}
