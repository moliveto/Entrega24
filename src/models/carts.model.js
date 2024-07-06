import { Schema, model } from "mongoose";
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
                closed: { type: Boolean, default: false },
                _id: false,
            },
        ],
        default: [],
    }
},
    {
        timestamps: true, // Automatically adds timestamps for created/updated at
        strictPopulate: false, // Allows populating paths not specified in the schema
    });

schema.pre('findOne', function () {
    this.populate('products.product')
});

const collectionName = 'carts';
const cartModel = model(collectionName, schema);

export default cartModel;