import { Schema, Types, model } from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "users",
        required: true
    },
    event:{
        type: Types.ObjectId,
        ref: "events",
        required: true
    },
    status:{
        type: String,
        enum: ["confirmed", "pending", "cancelled"],
        default: "confirmed"
    },
    quantity:{
        type: Number,
        default: 1,
        min: 1
    },
    reservationCode:{
        type: String,
        unique: true
    },
    cancelledAt:{
        type: Date,
        default: null
    }
},
{
    timestamps: true
})

export const ticketModel = model(ticketCollection, ticketSchema);