import GenericRepository from "./generic.repository.js";

export default class ChatRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    async getAll() {
        return await this.dao.getAll();
    }

    async getMyMessages(email) {
        return await this.dao.getMyMessages(email);
    }

    async addMessage(message) {
        return await this.dao.addMessage(message);
    }

}