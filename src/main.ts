import './scss/styles.scss';
import {API_URL, CDN_URL} from './utils/constants';
import {ensureElement} from './utils/utils';
import {IOrderForm, IProduct} from './types';

import {EventEmitter} from './components/base/Events';
import {ApiModel} from './components/Models/ApiModel';
import {Products} from './components/Models/Products';
import {Cart} from './components/Models/Cart';
import {Buyer} from './components/Models/Buyer';

import {Card} from './components/View/Card';
import {CardPreview} from './components/View/CardPreview';
import {Modal} from './components/View/Modal';
import {Basket} from './components/View/Basket';
import {BasketItem} from './components/View/BasketItem';
import {OrderModel} from './components/View/OrderModel';
import {FormOrder} from './components/View/FormOrder';
import {Contacts} from './components/View/FormContacts';
import {Success} from './components/View/Success';
import {GalleryView} from "./components/View/GalleryView";
import {HeaderView} from './components/View/HeaderView';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const events = new EventEmitter();

const apiModel = new ApiModel(API_URL, CDN_URL);
const productsModel = new Products(events);
const cartModel = new Cart();
const buyerModel = new Buyer(events);
const orderModel = new OrderModel();

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const formOrder = new FormOrder(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);

const headerView = new HeaderView(ensureElement<HTMLElement>('header'), events);
const gallery = new GalleryView(ensureElement<HTMLElement>('.gallery'), events);

/**********  **********/
/********** Отображение карточек **********/
events.on('productItems:receive', () => {
    const cardElements = productsModel.productCards.map(item => {
        const card = new Card(cardCatalogTemplate, events, {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });

    gallery.setItems(cardElements);
});

/********** Выбор карточки **********/
events.on('card:select', (item: IProduct) => {
    productsModel.setPreview(item);
});

/********** Модальное окно карточки **********/
events.on('modalCard:open', (item: IProduct) => {
    const cardPreview = new CardPreview(cardPreviewTemplate, events);
    modal.content = cardPreview.render(item);
    modal.render();
});

/********** Добавление в корзину **********/
events.on('card:addBasket', (item: IProduct) => {
    cartModel.setSelectedCard(item);
    headerView.counter = cartModel.getCounter();
    modal.close();
});

/********** Проверка состояния товара **********/
events.on('cart:checkRequest', (id: string) => {
    const exists = cartModel.basketProducts.some(p => p.id === id);
    events.emit(`cart:checkResponse:${id}`, exists);
});

/********** Открытие корзины **********/
events.on('basket:open', () => {
    basket.renderSumAllProducts(cartModel.getSumAllProducts());
    basket.items = cartModel.basketProducts.map((product, index) => {
        const basketItem = new BasketItem(cardBasketTemplate, events, {
            onClick: () => events.emit('basket:basketItemRemove', product)
        });
        return basketItem.render(product, index + 1);
    });
    modal.content = basket.render();
    modal.render();
});

/********** Удаление товара из корзины **********/
events.on('basket:basketItemRemove', (item: IProduct) => {
    cartModel.deleteCardToBasket(item);
    headerView.counter = cartModel.getCounter();
    basket.renderSumAllProducts(cartModel.getSumAllProducts());
    basket.items = cartModel.basketProducts.map((product, index) => {
        const basketItem = new BasketItem(cardBasketTemplate, events, {
            onClick: () => events.emit('basket:basketItemRemove', product)
        });
        return basketItem.render(product, index + 1);
    });
    modal.close();
});

/********** Открытие формы заказа **********/
events.on('order:open', () => {
    modal.content = formOrder.render();
    modal.render();
});

/********** Выбор способа оплаты **********/
events.on('order:paymentSelection', (paymentName: string) => {
    buyerModel.payment = paymentName;
    orderModel.setPaymentMethod(paymentName);
    formOrder.paymentSelection = paymentName;
});

/********** Ввод адреса **********/
events.on('order:changeAddress', (data: { field: string, value: string }) => {
    buyerModel.setOrderAddress(data.field, data.value);
    orderModel.setAddress(data.value);           // синхронизация с OrderModel
    formOrder.valid = orderModel.validate();
});

/********** Валидация данных строки "address" и payment **********/
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
    const { address, payment } = errors;
    formOrder.valid = !address && !payment;
    formOrder.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

/********** Открытие формы контактов **********/
events.on('contacts:open', () => {
    modal.content = contacts.render();
    modal.render();
});

/********** Отслеживаем изменение в полях вода "Email" и "Телефон" **********/
events.on('contacts:changeInput', (data: { field: string, value: string }) => {
    buyerModel.setOrderData(data.field, data.value);
});

/********** Валидация данных строки "Email" и "Телефон" **********/
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

/********** Обработка отправки формы **********/
events.on('contacts:submit', () => {
    const isOrderValid = orderModel.validate();
    const isContactsValid = buyerModel.validateContacts();

    formOrder.valid = isOrderValid && isContactsValid;

    if (isOrderValid && isContactsValid) {
        events.emit('success:open');
    } else {
        // показываем ошибки в форме
        formOrder.formErrors.textContent = [
            !orderModel.paymentMethod ? 'Выберите способ оплаты' : null,
            !orderModel.address ? 'Введите адрес доставки' : null
        ].filter(Boolean).join('; ');

        contacts.formErrors.textContent = Object.values(buyerModel.formErrors)
            .filter(Boolean)
            .join('; ');
    }
});

/********** Открытие окна "Успех"  **********/
events.on('success:open', () => {
    const success = new Success(successTemplate, events);
    modal.content = success.render(cartModel.getSumAllProducts());
    cartModel.clearBasketProducts();
    headerView.counter = cartModel.getCounter();
    modal.render();
});

events.on('success:close', () => modal.close());

/********** Получение данных с сервера **********/
apiModel.getListProductCard()
    .then((data: IProduct[]) => {
        productsModel.productCards = data;
        events.emit('productItems:receive');
    })
    .catch(error => console.log(error));
