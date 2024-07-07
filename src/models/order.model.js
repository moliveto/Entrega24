import { Schema, model } from "mongoose";

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    products: {
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "products",
                    required: true
                },
                quantity: { type: Number, default: 1 },
            },
        ],
        default: [],
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
    this.populate('products.product')
    this.populate('users.user');
});

const collection = "orders";
const ticketModel = model(collection, schema);

export default ticketModel;