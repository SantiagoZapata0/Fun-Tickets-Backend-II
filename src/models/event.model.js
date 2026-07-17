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
      date: { 
            type: Date, 
            required: true
      },
      place: { 
            type: String, 
            required: true
      },
      capacity: { 
            type: Number, 
            required: true 
      },
      price: { 
            type: Number, 
            default: 0 
      },
      status: {
            type: String,
            enum: ["active", "cancelled", "finished"],
            default: "active",
      },
      organizer:{
            type: Types.ObjectId,
            ref: "users"
      }
});

export const eventModel = model(eventCollection, eventSchema);
