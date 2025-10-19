import './scss/styles.scss';

import {Products} from './components/Models/Products';
import {Cart} from './components/Models/Cart';
import {Buyer} from './components/Models/Buyer';
import {Api} from './components/base/Api';
import {WebApi} from './components/base/WebApi';
import {apiProducts} from './utils/data';

(async () => {
    const productsModel = new Products();
    const cartModel = new Cart();
    const buyerModel = new Buyer();

    // --- Тестируем Products ---
    productsModel.setItems(apiProducts.items);
    console.log('Каталог (локальные данные):', productsModel.getItems());

    const firstProduct = productsModel.getById(productsModel.getItems()[0].id);
    productsModel.setSelectedItem(firstProduct || null);
    console.log('Выбранный товар:', productsModel.getSelectedItem());

    // --- Тестируем Cart ---
    if (firstProduct) {
        cartModel.addItem(firstProduct);
        console.log('После добавления в корзину:', cartModel.getItems());
        console.log('Общая сумма:', cartModel.getTotal());
        console.log('Кол-во товаров:', cartModel.getCount());
        console.log('Есть ли товар:', cartModel.hasItem(firstProduct.id));

        cartModel.removeItem(firstProduct.id);
        console.log('После удаления из корзины:', cartModel.getItems());
    }

    // --- Тестируем Buyer ---
    buyerModel.save({ payment: 'card', address: 'Москва, ул. Ленина, 1' });
    buyerModel.save({ email: 'test@mail.ru', phone: '+79999999999' });
    console.log('Данные покупателя:', buyerModel.get());
    console.log('Проверка ошибок (всё валидно):', buyerModel.validate());

    // --- Тестируем API, не срабатывает запрос, ошибка 404 ---
    const api = new Api(import.meta.env.VITE_API_ORIGIN );
    const webApi = new WebApi(api);

    try {
        const products = await webApi.fetchProducts();
        productsModel.setItems(products);
        console.log('Товары с сервера:', productsModel.getItems());
    } catch (err) {
        console.error('Ошибка при загрузке товаров с сервера:', err);
    }
})();


