
import GenericRepository from "./generic.repository.js";
import { cartsService } from "../services/index.js"

export default class UserRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    createUser = async (user) => {
        try {
            const cart = { products: [], delivery_address: user.address, email: user.email}
            const newCart = await cartsService.create(cart);
            console.log("🚀 ~ UserRepository ~ createUser= ~ newCart:", newCart)
            user.cart = newCart.id;
            return this.dao.save(user);
        } catch (error) {
            console.log("🚀 ~ UserRepository ~ createUser= ~ error:", error)
            throw new Error(`Error al crear usuario ${error}`);
        }
    }

    getUserByEmail = (email) => {
        return this.getBy({ email });
    }

    getUserById = (id) => {
        return this.getBy({ _id: id })
    }

    updateLastConnection = (id) => {
        return this.dao.update(id, { last_connection: Date.now() });
    }

    SetResetLink = (id, resetLink) => {
        return this.dao.SetResetLink(id, resetLink);
    }

}