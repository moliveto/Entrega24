import { errorLogger } from '../utils/logger.js';

export default class GenericRepository {
    constructor(dao) {
        this.dao = dao;
    }

    findOne = (id) => {
        return this.dao.findOne(id);
    }

    async getById(id) {
        try { 
            const doc = await this.dao.model.findById(id).lean();
            return { status: 'success', message: 'Documento encontrado.', data: {id: doc._id, ...doc}}
        } 
        catch (error) {
            errorLogger.error(`Error: ${error}`);
            return { status: 'error', message: `Error al buscar registro con id ${id}. ${error}`}
        }
    }

    getAll = (params) => {
        return this.dao.get(params);
    }

    getBy = (params) => {
        return this.dao.getBy(params).lean();
    }

    create = (doc) => {
        return this.dao.save(doc);
    }

    update = (id, doc) => {
        return this.dao.update(id, doc);
    }

    delete = (id) => {
        return this.dao.delete(id);
    }
}