
import GenericRepository from "./generic.repository.js";
import { cartsService } from "../services/index.js"

export default class UserRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    createUser = async (user) => {
        try {
            const cart = await cartsService.create();
            user.carts = { cart };
            return this.dao.save(user);
        } catch (error) {
            console.log("🚀 ~ UserRepository ~ createUser= ~ error:", error)
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