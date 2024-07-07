import orderModel from "../models/order.model.js";

export default class Orders {
  constructor() {
    this.model = orderModel;
  }

  get = (params) => {
    console.log("🚀 ~ Orders ~ params:", params)
    return orderModel.find(params);
  }

  getBy = (params) => {
    return orderModel.findOne(params);
  }

  save = (doc) => {
    return orderModel.create(doc);
  }
}