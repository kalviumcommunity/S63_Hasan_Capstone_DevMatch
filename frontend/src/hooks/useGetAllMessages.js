import { useEffect } from "react";

import { useGlobalStore } from "../store/useStore.js";
import { axiosInstance } from "../utils/axiosInstance.js";

const useGetAllMessages = (userId) => {
    const { addMessages } = useGlobalStore();

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                const response = await axiosInstance.get(`/chat/${userId}`);
                if (response.data.success) {
                    addMessages(response.data.data);
                }
            } catch (err) {
                if (err.response) {
                    console.error(err.response.data.message);
                }
            }
        };
        fetchAllMessages();
    }, [addMessages, userId]);
};

export default useGetAllMessages; 