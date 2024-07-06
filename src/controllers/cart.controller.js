import { cartsService } from "../services/index.js";
import { productsService } from "../services/index.js";
import CartDTO from "../dto/cart.dto.js";

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

const getCart = async (req, res) => {
    let cart;
    let products;
    let total = 0;

    if (req.user) {
        const answer = await cartsService.getById(req.user.cart);
        if (answer.status === 'error') {
            req.flash('error', `No se encontró carrito con id: ${req.params.id}`);
        }
        else {
            cart = new CartDTO(answer.data);
            products = cart.products;
            products.forEach((p, index) => {
                total += p.product.price * p.quantity;
            });

            console.log("🚀 ~ getCart ~ cart:", cart)
        }
    } 
    else 
    {
        req.flash('error', 'El ID es requerido');
    }

    res.render('pages/cart', { cart, products, total, notifications: req.flash() });
}

export default {
    addProductToCart,
    getCart,
}