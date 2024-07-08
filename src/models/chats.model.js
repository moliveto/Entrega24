import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

const schema = new Schema(
    {
        user: { type: String, required: true },
        message: { type: String, required: true },
    },
    {
        timestamps: true, // Automatically adds timestamps for created/updated at
        strictPopulate: false, // Allows populating paths not specified in the schema
    });

schema.plugin(mongoosePaginate);

const collectionName = "Chats";
const chatsModel = model(collectionName, schema);

export default chatsModel;