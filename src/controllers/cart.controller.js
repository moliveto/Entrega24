import { cartsService } from "../services/index.js";
import { productsService } from "../services/index.js";
import CartDTO from "../dto/cart.dto.js";

const getCart = async (req, res) => {
    const user = req.user;
    res.locals.email = user.email;
    res.locals.avatar = user.avatar;
    res.locals.is_admin = user.role === 'admin';

    let cart;
    let products;
    let total = 0;

    if (req.user) {
        const cartDB = await cartsService.getById(user.cart);
        if (cartDB.status === 'error') {
            req.flash('error', `No se encontró carrito con id: ${req.params.id}`);
        }
        else {
            cart = new CartDTO(cartDB.data, user);
            //console.log("🚀 ~ getCart ~ cart:", cart)
            products = cart.products;
            //console.log("🚀 ~ getCart ~ products:", products)
            products.forEach((p, index) => {
                total += p.price * p.quantity;
            });
        }
    }
    else {
        req.flash('error', 'El ID es requerido');
    }

    // console.log("🚀 ~ getCart ~ products:", products)
    res.render('pages/cart', { cart, products, total, notifications: req.flash() });
}

const addProductToCart = async (req, res) => {
    const { pid, quantity } = req.body;
    const cartId = req.user ? req.user.cart : null;
    const q = parseInt(quantity);

    const product = await productsService.getById(pid);
    if (product.status === 'error') {
        req.flash('error', `No hay producto con id: ${pid}`);
        return res.redirect(`../products`);
    }

    if (product.data.stock < q) {
        req.flash('error', `No hay suficiente stock para agregar ${q} productos al carrito`);
        return res.redirect(`../products`);
    }

    const cartDB = await cartsService.getById(cartId);
    if (cartDB.status === 'error') {
        req.flash('error', `No hay carrito con id: ${cartId}`);
        return res.redirect(`../products`);
    }

    const cartData = cartDB.data;
    let productExists = false;
    cartData.products.forEach(ps => {
        if (ps.product._id.toString() === pid) {
            productExists = true;
            return;
        }
    });

    if (productExists) {
        req.flash('error', `El producto ya se encuentra en el carrito. ${pid}`);
        return res.redirect(`../products`);
    }

    const newCartProducts = cartData.products;
    newCartProducts.push({ product: product.data, quantity });

    const cart = await cartsService.addProductToCart(cartId, newCartProducts);
    if (cart.status === 'error') {
        req.flash('error', cart.message);
    } else {
        req.flash(cart.status, `Producto agregado al carrito.`);
    }

    return res.redirect(`../products`);
}

const removeProductFromCart = async (req, res) => {
    const user = req.user;
    res.locals.email = user.email;
    res.locals.avatar = user.avatar;
    res.locals.is_admin = user.role === 'admin';

    const { pid } = req.body;
    const cartId = req.user ? req.user.cart : null;
    if (cartId && pid) {
        const cartDB = await cartsService.removeProductFromCart(cartId, pid);
        req.flash(cartDB.status, cartDB.message);
    } else {
        req.flash('error', 'El ID del producto y el carrito son necesarios.');
    }

    return res.redirect(`../cart`);
}

const cleanCart = async (req, res) => {
    const user = req.user;
    res.locals.email = user.email;
    res.locals.avatar = user.avatar;
    res.locals.is_admin = user.role === 'admin';

    const cartId = req.user ? req.user.cart : null;
    if (cartId) {
        const cartDB = await cartsService.update(cartId, { products: [] });
        req.flash(cartDB.status, 'Se vacio el carrito con exito');
    } else {
        req.flash('error', 'El ID del carrito es necesario.');
    }

    return res.redirect(`/cart`);
}

export default {
    getCart,
    addProductToCart,
    removeProductFromCart,
    cleanCart
}