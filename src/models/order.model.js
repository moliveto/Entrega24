import { Schema, model } from "mongoose";

const schema = new Schema({
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    delivery_address: { type: String, require: true },
    email: { type: String, require: true },
    code: { type: String, require: true },
    datetime: { type: Date, default: Date.now, require: true },
    amount : { type: Number, require: true }
},
    {
        timestamps: true, // Automatically adds timestamps for created/updated at
        strictPopulate: false, // Allows populating paths not specified in the schema
    });

schema.pre('findOne', function () {
    this.populate('carts.cart');
    this.populate('users.user');
});

const collection = "orders";
const ticketModel = model(collection, schema);

export default ticketModel;