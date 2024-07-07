import { Schema, model, mongoose } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const schema = new Schema({
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
},
    {
        timestamps: true, // Automatically adds timestamps for created/updated at
        strictPopulate: false, // Allows populating paths not specified in the schema
    });

schema.plugin(mongoosePaginate);

schema.pre('findOne', function () {
    this.populate('products.product')
})

const collectionName = 'carts';
const cartModel = model(collectionName, schema);

export default cartModel;