import './scss/styles.scss';

import {API_URL, CDN_URL} from './utils/constants';
import {ensureElement} from './utils/utils';

import {IOrderForm, IProduct} from './types';

import {EventEmitter} from './components/base/Events';

import {ApiModel} from './components/Models/ApiModel';
import {Products} from './components/Models/Products';
import {Cart} from './components/Models/Cart';
import {Buyer} from './components/Models/Buyer';

import {Card} from './components/./View/Card';
import {CardPreview} from './components/./View/CardPreview';
import {Modal} from './components/./View/Modal';
import {Basket} from './components/./View/Basket';
import {BasketItem} from './components/./View/BasketItem';
import {Order} from './components/./View/FormOrder';
import {Contacts} from './components/./View/FormContacts';
import {Success} from './components/./View/Success';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const apiModel = new ApiModel(API_URL, CDN_URL);
const events = new EventEmitter();

const productsModel = new Products(events);
const cartModel = new Cart();
const buyerModel = new Buyer(events);


const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);


/********** Отображения карточек товара на странице **********/
events.on('productItems:receive', () => {
    productsModel.productCards.forEach(item => {
        const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
        ensureElement<HTMLElement>('.gallery').append(card.render(item));
    });
});

/********** Получить объект данных "IProduct" карточки по которой кликнули **********/
events.on('card:select', (item: IProduct) => { productsModel.setPreview(item) });

/********** Открываем модальное окно карточки товара **********/
events.on('modalCard:open', (item: IProduct) => {
    const cardPreview = new CardPreview(cardPreviewTemplate, events)
    modal.content = cardPreview.render(item);
    modal.render();
});

/********** Добавление карточки товара в корзину **********/
events.on('card:addBasket', (item: IProduct) => {
    cartModel.setSelectedCard(item);// передаём реальный товар
    basket.renderHeaderBasketCounter(cartModel.getCounter());
    modal.close();
});

/********** Проверка состояния товара куплено/не куплено**********/
events.on('cart:check', (id: string, callback: (exists: boolean) => void) => {
    const exists = cartModel.basketProducts.some(p => p.id === id);
    callback(exists);
});

/********** Возвращает true/false, есть ли товар в корзине **********/
events.on('cart:checkRequest', (id: string) => {
    const exists = cartModel.basketProducts.some(p => p.id === id);
    events.emit(`cart:checkResponse:${id}`, exists);
});

/********** Открытие модального окна корзины **********/
events.on('basket:open', () => {
    const products = cartModel.basketProducts;
    basket.renderSumAllProducts(cartModel.getSumAllProducts());
    basket.items = products.map((product, index) => {
        const basketItem = new BasketItem(cardBasketTemplate, events, {
            onClick: () => events.emit('basket:basketItemRemove', product)
        });
        return basketItem.render(product, index + 1);
    });
    modal.content = basket.render();
    modal.render();
});

/********** Удаление карточки товара из корзины **********/
events.on('basket:basketItemRemove', (item: IProduct) => {
    cartModel.deleteCardToBasket(item);
    basket.renderHeaderBasketCounter(cartModel.getCounter());
    basket.renderSumAllProducts(cartModel.getSumAllProducts());
    let i = 0;
    basket.items = cartModel.basketProducts.map((item) => {
        const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
        i = i + 1;
        return basketItem.render(item, i);
    })
    modal.close();
});

/********** Открытие модального окна "способа оплаты" и "адреса доставки" **********/
events.on('order:open', () => {
    modal.content = order.render();
    modal.render();
    buyerModel.items = cartModel.basketProducts.map(item => item.id);
});

/********** Отслеживаем изменение в поле в вода "адреса доставки" **********/
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
    buyerModel.setOrderAddress(data.field, data.value);
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => { buyerModel.payment = button.name })

/********** Открытие модального окна "Email" и "Телефон" **********/
events.on('contacts:open', () => {
    buyerModel.total = cartModel.getSumAllProducts();
    modal.content = contacts.render();
    modal.render();
});

/********** Отслеживаем изменение в полях вода "Email" и "Телефон" **********/
events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
    buyerModel.setOrderData(data.field, data.value);
});
/********** Валидация данных строки "Email" и "Телефон" **********/
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

/********** Валидация данных строки "address" и payment **********/
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
    const { address, payment } = errors;
    order.valid = !address && !payment;
    order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

/********** Обработка нажатия кнопки "Оформить заказ" в модальном окне контактов **********/
events.on('contacts:submit', () => {
    // Сначала проверяем, все ли поля заполнены корректно
    const isContactsValid = buyerModel.validateContacts();
    const isOrderValid = buyerModel.validateOrder();

    if (isContactsValid && isOrderValid) {
        // Если всё валидно — открываем окно успеха и отправляем заказ на сервер
        events.emit('success:open');
    } else {
        // Если не валидно — ничего не отправляем, ошибки уже отобразятся через EventEmitter
        console.log('Форма заполнена неверно');
    }
});

/********** Открытие модального окна "Заказ оформлен" **********/
events.on('success:open', () => {
    apiModel.postOrderLot(buyerModel.getOrderLot())
        .then((data) => {
            const success = new Success(successTemplate, events);
            modal.content = success.render(cartModel.getSumAllProducts());
            cartModel.clearBasketProducts();
            basket.renderHeaderBasketCounter(cartModel.getCounter());
            modal.render();
        })
        .catch(error => console.log('Ошибка при отправке заказа:', error));
});

events.on('success:close', () => modal.close());

/********** Получаем данные с сервера **********/
apiModel.getListProductCard()
    .then(function (data: IProduct[]) {
        productsModel.productCards = data;
        events.emit('productItems:receive');
    })
    .catch(error => console.log(error))