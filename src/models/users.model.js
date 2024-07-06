import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { createHashValue, isValidPasswd } from "../utils/encrypt.js";
import validator from "validator";

const roleType = {
    user: "user",
    admin: "admin",
    public: "public",
    premium: "premium",
};

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
    },
    birthday: {
        type: Date,
        required: false,
    },
    role: {
        type: String,
        enum: Object.values(roleType),
        default: 'user',
    },
    phone: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        required: false,
        default: 'default-user.png',
    },
    resetLink: {
        type: String,
        default: ''
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'carts',
        required: false,
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                },
                reference: {
                    type: String,
                    required: true,
                },
                _id: false,
            },
        ],
        default: [],
    },
    last_connection: {
        type: Date,
        default: Date.now,
    }
},
    {
        timestamps: true, // Automatically adds timestamps for created/updated at
        strictPopulate: false, // Allows populating paths not specified in the schema
    });


schema.plugin(mongoosePaginate);

schema.pre("find", function () {
    this.populate("carts.cart");
});

// Hash password before saving
schema.pre('save', async function (next) {
    const user = this; // Reference the current user object

    if (user.isModified('password')) { // Check if password is modified
        const pswHashed = await createHashValue(user.password);
        user.password = pswHashed; // Hash with a cost factor of 10
    }

    next();
});

const collection = "users";
const userModel = mongoose.model(collection, schema);

export default userModel;