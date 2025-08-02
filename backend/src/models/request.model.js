import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const connectionRequestSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["interested", "ignored", "accepted", "rejected"],
                message: `{VALUE} is not a valid status type`
            },
            trim: true
        }
    },
    { timestamps: true, versionKey: false }
);

// Compound indexing
connectionRequestSchema.index({ senderId: 1, receiverId: 1 });

export const ConnectionRequestModel = models.ConnectionRequest || model("ConnectionRequest", connectionRequestSchema); 