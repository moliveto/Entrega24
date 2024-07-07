
import { cartsService } from "../../services/index.js";
import { ordersService } from "../../services/index.js";

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

    const cart = cartDB.data;
    let productsOutOfStock = [];
    let productsInStock = [];
    // Recorremos los productos del carrito
    for (const product of cart.products) {
        // Si el stock es mayor a la cantidad de productos que están en el carrito lo almacenamos en un array de productsInStock
        if (product.product.stock > product.quantity) {
            productsInStock.push(product);
            // Quitamos el producto del carrtio
            await deleteProductFromCart(cid, product.product._id);
            // Descontamos stock de los productos
            await productService.updateProduct(product.product._id, { stock: product.product.stock - product.quantity });
            await sumTotal(cid);
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
        return acc + product.product.price * product.quantity;
    }, 0);

    // Generar el ticket
    const order = await ordersService.createOrder({
        user: user._id,
        products: productsInStock,
        delivery_address : user.address,
        email : user.email,
        amount: total,
    });

    res.redirect(`../../productos`);
}

export default {
    createOrder
}