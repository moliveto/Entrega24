import { Schema, model } from "mongoose";

const collection = "ticket";

const ticketSchema = new Schema({
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
    amount: Number,
    datetime: {
        type: Date,
        default: Date.now,
    }
},
    {
        timestamps: true, // Automatically adds timestamps for created/updated at
        strictPopulate: false, // Allows populating paths not specified in the schema
    });

schema.pre('findOne', function () {
    this.populate('carts.cart');
    this.populate('users.user');
});

const ticketModel = model(collection, ticketSchema);
export default ticketModel;