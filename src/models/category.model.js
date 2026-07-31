import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

export const categoryModel = model("category", categorySchema);

 