import chatsModel from '../models/chats.model.js';
import mongoose from 'mongoose';

export default class Chats {
    constructor() {
        this.model = chatsModel
    }

    async getAllMessages() {
        try {
            const allMessages = await this.model.find({}).lean()
            return allMessages
        } catch (error) {
            throw Error(error)
        }
    }

    async getMyMessages(email) {
        try {
            const allMessages = await this.model.find({email : email}).lean()
            return allMessages
        } catch (error) {
            throw Error(error)
        }
    }

    async save(message) {
        try {
            const messageAdd = await this.model.create(message)
                .then((res) => {
                    return res
                })
                .catch((error) => {
                    throw Error(error)
                });
                return messageAdd;
        } catch (error) {
            throw Error(error)
        }
    }

}