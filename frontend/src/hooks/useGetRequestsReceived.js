import { useEffect } from "react";

import { useGlobalStore } from "../store/useStore.js";
import { axiosInstance } from "../utils/axiosInstance.js";

const useGetRequestsReceived = () => {
    const { addRequests } = useGlobalStore();

    useEffect(() => {
        const fetchRequestsReceived = async () => {
            try {
                const response = await axiosInstance.get("/user/requests/received");
                if (response.data.success) {
                    addRequests(response.data.data);
                }
            } catch (err) {
                if (err.response) {
                    console.error(err.response.data.message);
                }
            }
        };
        fetchRequestsReceived();
    }, [addRequests]);
};

export default useGetRequestsReceived; 