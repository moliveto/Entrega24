import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

const schema = new Schema(
    {
        type: { type: String, default: 'user', enum: ['user', 'system'], require: true },
        email: { type: String, require: true },
        body: { type: String, require: true },
    },
    {
        timestamps: true, // Automatically adds timestamps for created/updated at
        strictPopulate: false, // Allows populating paths not specified in the schema
    });

schema.plugin(mongoosePaginate);

const collectionName = "Chats";
const chatsModel = model(collectionName, schema);

export default chatsModel;