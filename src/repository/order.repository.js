import GenericRepository from "./generic.repository.js";

export default class OrderRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    getOrderById = (id) => {
        return this.getBy({ _id: id })
    }

    getOrders = () => {
        return this.getAll();
    }

    getOrdersByUserId = async (userId) => {
        return await this.dao.getOrdersByUserId(userId);
    }

    createOrder = (order) => {
        const newOrder = {
            ...order,
            code: Math.random().toString(36).substr(2, 9),
            purchase_datetime: new Date(),
        };

        return this.create(newOrder);
    }

    updateOrder = (id, order) => {
        return this.update(id, order);
    }

    deleteOrder = (id) => {
        return this.delete(id);
    }
}