import orderModel from "../models/order.model.js";

export default class Orders {
  constructor() {
    this.model = orderModel;
  }

  save = (doc) => {
    return orderModel.create(doc);
  }
}