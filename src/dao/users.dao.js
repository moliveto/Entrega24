import userModel from "../models/users.model.js";

export default class Users {

    findOne = (id) => {
        return userModel.findOne({ _id: id });
    }

    get = (params) => {
        return userModel.find(params);
    }

    getBy = (params) => {
        return userModel.findOne(params);
    }

    save = (doc) => {
        return userModel.create(doc);
    }

    update = (id, doc) => {
        return userModel.findByIdAndUpdate(id, { $set: doc })
    }

    SetResetLink = (uid, token) => {
        try {
            return userModel.findByIdAndUpdate(uid, { resetLink: token })
                .then((res) => {
                    return res
                })
                .catch((err) => {
                    throw new Error(err)
                })

        } catch (error) {
            throw Error(error)
        }
    }

    delete = (id) => {
        return userModel.findByIdAndDelete(id);
    }
}