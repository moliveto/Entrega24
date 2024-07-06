import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción del producto es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio del producto es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  quantity: {
    type: Number,
    required: [true, 'La cantidad del producto es obligatoria'],
    min: [0, 'La cantidad no puede ser negativa']
  },
  thumbnail: {
    type: String,
    default: 'Sin imagen',
    trim: true,
    required: false 
  },
  status: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
    required: false 
  }
},
  {
    timestamps: true, // Automatically adds timestamps for created/updated at
    strictPopulate: false, // Allows populating paths not specified in the schema
  });

schema.plugin(mongoosePaginate);

schema.pre("find", function () {
  this.populate("users.owner");
});

const collection = "products";
const productModel = mongoose.model(collection, schema);

export default productModel;
