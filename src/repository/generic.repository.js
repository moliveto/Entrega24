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
            return { status: 'success', message: 'Documento encontrado.', data: { id: doc._id, ...doc } }
        }
        catch (error) {
            errorLogger.error(`Error: ${error}`);
            return { status: 'error', message: `Error al buscar id ${id}. ${error}` }
        }
    }

    getAll = async() => {
        try {
            const docs = await this.dao.model.find({}).lean().then(ds => {
                if (ds.length) {
                    return ds.map(d => {
                        d.id = String(d._id);
                        return d;
                    });
                }
                return [];
            });
            return {status: 'success', message: 'Se obtuvieron de manera exitosa los datos.', data: docs}
        } catch (err) {
            errorLogger.error(`Error: ${err}`);
            return { status: 'error', message: `Error al buscar registros: ${err}`}
        }
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