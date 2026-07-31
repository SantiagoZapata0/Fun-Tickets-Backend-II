import { Schema, model, Types} from "mongoose";

const eventCollection = "events";

const eventSchema = new Schema({
      title: {
            type: String,
            required: true,
      },
      description: { 
            type: String, 
            required: true 
      },
      category:{
            type: Types.ObjectId,
            ref: "category",
            required: true
      },
      date: { 
            type: Date, 
            required: true
      },
      location: { 
            type: String, 
            required: true
      },
      capacity: { 
            type: Number, 
            required: true,
            min: 1
      },
      price: { 
            type: Number, 
            default: 0,
            min: 0
      },
      status: {
            type: String,
            enum: ["draft", "published", "cancelled", "finished"],
            default: "draft",
      },
      organizer:{
            type: Types.ObjectId,
            ref: "users",
            required: true
      }
});

export const eventModel = model(eventCollection, eventSchema);
