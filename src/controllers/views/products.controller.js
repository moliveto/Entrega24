import ProductsModel from "../../models/product.model.js"
import { productsService } from "../../services/index.js"
import { validationResult } from 'express-validator';

const products = async (req, res) => {
    const user = req.user;
    res.locals.email = user.email;
    res.locals.avatar = user.avatar;
    res.locals.is_admin = user.role === 'admin';

    const cartId = user.carts;
    const is_admin = user.role === 'admin';

    const { page = 1, limit = 10, sort, filter } = req.query;
    try {

        const sortTogle = (sort) => {
            let srt = parseInt(sort)
            if (sort === undefined) return 1
            else { return srt *= -1 }
        }

        const sorting = sortTogle(sort)

        const response = await ProductsModel.paginate({ filter }, { limit: limit, page: page, sort: { price: sorting } })

        if (page > response.totalPages) {
            return res.json({ status: "failed", message: "LA PAGINA SELECCIONADA NO EXISTE" })
        }

        var maxLength = 10;
        const products = response.docs.map(doc => {
            return {
                id: doc._id,
                cart: cartId,
                name: doc.name,
                description: doc.description.split(' ').slice(0, maxLength).join(' ') + '...',
                category: doc.category,
                thumbnail: doc.thumbnail,
                price: doc.price,
                stock: doc.stock,
                status: doc.status
            }
        })

        res.render("pages/products.hbs", {
            title: "Trabajo practico E-Commerce",
            products: products,
            page: response.page,
            sort: sorting,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            totalPages: response.totalPages,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            hide_navigation: false,
            is_admin,
            notifications: req.flash()
        })

    } catch (error) {
        req.flash('error', `Hubo un problema: ${error.message}`);
        res.render("pages/products.hbs", {
            title: "Trabajo practico E-Commerce",
            notifications: req.flash()
        })
    }
};

const getProductById = async (req, res) => {
    const user = req.user;
    res.locals.email = user.email;
    res.locals.avatar = user.avatar;
    res.locals.is_admin = user.role === 'admin';
    let product;
    const prodId = req.params.id;
    if (prodId) {
        const productDB = await productsService.getProductById(prodId);
        product = productDB.data;
        // console.log("🚀 ~ getProductById ~ product:", product)
        if (product.status === 'error') {
            req.flash('error', `No se encontró producto con id: ${prodId}`);
        }
        // product.id = product.data.id;
    } else {
        req.flash('error', 'El ID es requerido');
    }
    res.render('pages/updateProduct', { product, notifications: req.flash() });
}

const updateProduct = async (req, res) => {
    const user = req.user;
    res.locals.email = user.email;
    res.locals.avatar = user.avatar;
    res.locals.is_admin = user.role === 'admin';
    const productId = req.body.id;
    try {
        const { name, description, price, stock, thumbnail, status } = req.body;
        const updateBody = { name, description, price, stock, thumbnail, status: (status === 'on' ? true : false) };
        const result = await productsService.update(productId, updateBody);
        req.flash('success', `Producto actualizado con éxito`);
        res.redirect('/products');
    } catch (error) {
        req.flash('error', `Error al actualizar producto con id: ${productId}`);
    }
}

const deleteProductAndRedirect = async (req, res) => {
    const user = req.user;
    res.locals.email = user.email;
    res.locals.avatar = user.avatar;
    res.locals.is_admin = user.role === 'admin';
    const { id } = req.body;
    try {
        const result = await productsService.delete(id);
        req.flash('success', `Producto eliminado con éxito`);
    } catch (error) {
        req.flash('error', `Error en producto con id: ${id}`);
    }
    res.redirect('/products');
}

const addProduct = async (req, res) => {
    const user = req.user;
    res.locals.email = user.email;
    res.locals.avatar = user.avatar;
    res.locals.is_admin = user.role === 'admin';
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsMsg = errors.array().map(err => err.msg).join(', ');
            req.flash('error', `Error al crear producto: ${errorsMsg}`);
            return res.redirect('/products');
        }
        const { name, description, price, stock, thumbnail, status } = req.body;
        const newProduct = { name, description, price, stock, thumbnail, status: (status === 'on' ? true : false) };
        newProduct.owner = req.user.id
        const result = await productsService.create(newProduct);
        req.flash('success', `Producto creado con éxito`);
    } catch (error) {
        req.flash('error', `Error al crear producto`);
    }
    res.redirect('/products');
}

export default {
    products,
    getProductById,
    updateProduct,
    deleteProductAndRedirect,
    addProduct
}