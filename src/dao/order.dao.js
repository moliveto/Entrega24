import orderModel from "../models/order.model.js";
import mongoose from 'mongoose';

export default class Orders {
  constructor() {
    this.model = orderModel;
  }

  get = (params) => {
    return this.model.find(params);
  }

  getOrdersByUserId = async (userId) => {
    const orders = await this.model.find({ user: new mongoose.Types.ObjectId(userId) }).lean();
    return orders;
  }

  getBy = (params) => {
    return this.model.findOne(params);
  }

  save = (doc) => {
    return this.model.create(doc);
  }
}