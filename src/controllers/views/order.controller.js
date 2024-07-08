
import { cartsService } from "../../services/index.js";
import { ordersService } from "../../services/index.js";
import { productsService } from "../../services/index.js";

const createOrder = async (req, res) => {
    const user = req.user;
    if (!user) {
        req.flash('error', 'El usuario no tiene una sesión activa');
        return res.redirect(`../../productos`);
    }

    const cartDB = await cartsService.getById(user.cart);
    // console.log("🚀 ~ createOrder ~ cart:", cartDB)
    if (cartDB.status === 'error') {
        req.flash('error', `No se encontró carrito con id: ${req.params.id}`);
        return res.redirect(`../../productos`);
    }

    const cid = user.cart;
    const cart = cartDB.data;
    let productsOutOfStock = [];
    let productsInStock = [];
    // Recorremos los productos del carrito
    for (const product of cart.products) {
        // Si el stock es mayor a la cantidad de productos que están en el carrito lo almacenamos en un array de productsInStock
        if (product.product.stock > product.quantity) {
            productsInStock.push(product);
            // Quitamos el producto del cart
            await cartsService.removeProductFromCart(cid, product.product._id);
            // Descontamos stock de los productos
            await productsService.update(product.product._id, { stock: product.product.stock - product.quantity });
        } else {
            productsOutOfStock.push(product);
        }
    };

    // Validamos si hay productos que no se pueden comprar
    if (productsInStock.length === 0) {
        req.flash('error', `No hay suficiente stock para realizar la compra con id: ${req.params.id}`);
        return res.redirect(`../../productos`);
    }

    // Calcular la suma de los productos que si se pueden comprar
    const total = productsInStock.reduce((acc, product) => {
        let subtotal = product.product.price * product.quantity;
        product.price = product.product.price;
        product.subtotal = subtotal;
        return acc + subtotal;
    }, 0);

    // Generar el ticket
    const order = await ordersService.createOrder({
        user: user.id,
        products: productsInStock,
        delivery_address: user.address,
        email: user.email,
        total: total,
    });
    // console.log("🚀 ~ createOrder ~ order:", order)

    res.redirect(`../../products`);
}

const getOrders = async (req, res) => {
    const orders = await ordersService.getOrders();
    // console.log("🚀 ~ getOrders ~ orders:", orders)
    res.render('pages/ordersAll', { orders: orders.data, notifications: req.flash() });
}

export default {
    getOrders,
    createOrder
}