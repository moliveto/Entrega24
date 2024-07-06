
import GenericRepository from "./generic.repository.js";

export default class ProductRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    getProductById = (id) => {
        return this.getById(id);
    }

    seed = () => {
        return this.dao.seed();
    }
}