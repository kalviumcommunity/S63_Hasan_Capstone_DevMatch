import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: [true, "Please provide the message"],
            trim: true
        }
    },
    { timestamps: true, versionKey: false }
);

export const MessageModel = models.Message || model("Message", messageSchema); 