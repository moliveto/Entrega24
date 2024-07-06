import Users from "../dao/users.dao.js";
import Products from "../dao/products.dao.js";
import Carts from "../dao/cart.dao.js";

import UserRepository from "../repository/user.repository.js";
import ProductRepository from "../repository/product.repository.js";
import CartRepository from "../repository/cart.repository.js";

export const usersService = new UserRepository(new Users());
export const productsService = new ProductRepository(new Products());
export const cartsService = new CartRepository(new Carts());