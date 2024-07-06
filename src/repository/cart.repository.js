import GenericRepository from "./generic.repository.js";

export default class ProductRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    getProductById = (id) => {
        return this.getBy({ _id: id })
    }

}