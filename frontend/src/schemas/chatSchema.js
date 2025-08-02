import * as yup from "yup";

// Chat schema
export const ChatSchema = yup.object({
    message: yup.string().required("Please provide a message").trim().max(200, "Message must not exceed 200 characters")
}); 