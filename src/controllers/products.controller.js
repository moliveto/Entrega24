import { productsService } from "../services/index.js"

const getAllProducts = async (req, res) => {
    const products = await productsService.getAll();
    res.send({ status: "success", payload: products })
}

const createProduct = async (req, res) => {
    const product = req.body;
    const owner = req.user;
    console.log("🚀 ~ createProduct ~ owner:", owner)
    product.owner = owner.id;
    console.log("🚀 ~ createProduct ~ product:", product)
    const newProduct = await productsService.create(product);
    res.send({ status: "success", message: "product created", payload: newProduct })
}

const getProduct = async (req, res) => {
    const prodId = req.params.uid;
    const product = await productsService.getProductById(prodId);
    if (!product) return res.status(404).send({ status: "error", error: "product not found" })
    res.send({ status: "success", payload: product })
}

const updateProduct = async (req, res) => {
    const updateBody = req.body;
    const productId = req.params.uid;
    const Product = await productsService.getProductById(productId);
    if (!Product) return res.status(404).send({ status: "error", error: "product not found" })
    const result = await productsService.update(productId, updateBody);
    res.send({ status: "success", payload: result })
}

const deleteProduct = async (req, res) => {
    const productId = req.params.uid;
    const result = await productsService.delete(productId);
    res.send({ status: "success", payload: result })
}

const Seed = async (req, res) => {
    try {
        console.log("🚀 ~ seed ~ req:", req)
        const result = await productsService.seed();
        console.log("🚀 ~ Seed ~ result:", result)
        res.send({ status: "success", message: "products inserted" })
    } catch (error) {
        console.log("🚀 ~ Seed ~ error:", error)
    }
}

export default {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    Seed: Seed
}