import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const chatSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message",
                default: []
            }
        ]
    },
    { timestamps: true, versionKey: false }
);

export const ChatModel = models.Chat || model("Chat", chatSchema); 