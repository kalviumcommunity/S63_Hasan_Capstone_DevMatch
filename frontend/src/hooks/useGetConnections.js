import { useEffect } from "react";

import { useGlobalStore } from "../store/useStore.js";
import { axiosInstance } from "../utils/axiosInstance.js";

const useGetConnections = () => {
    const { addConnections } = useGlobalStore();

    useEffect(() => {
        const fetchAllConnections = async () => {
            try {
                const response = await axiosInstance.get("/user/connections");
                if (response.data.success) {
                    addConnections(response.data.data);
                }
            } catch (err) {
                if (err.response) {
                    console.error(err.response.data.message);
                }
            }
        };
        fetchAllConnections();
    }, [addConnections]);
};

export default useGetConnections; 