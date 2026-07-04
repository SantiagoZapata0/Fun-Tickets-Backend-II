import { Schema, model } from "mongoose";

const userCollection = "users";

const userSchema = new Schema({

    first_name:{
        type: String,
        required: true,
        trim: true
    },
    last_name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El formato de email no es valido."]
    },
    password:{
        type: String,
        required: true,
        select: false  
    },
    role:{
        type: String,
        enum: ["admin", "organizer", "user"],
        default: "user"
    }
},
{
    timestamps: true
}
)

export const userModel = model(userCollection, userSchema);