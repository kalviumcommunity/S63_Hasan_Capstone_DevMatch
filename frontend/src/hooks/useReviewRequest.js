import toast from "react-hot-toast";

import { useGlobalStore } from "../store/useStore.js";
import { axiosInstance } from "../utils/axiosInstance.js";

const useReviewRequest = (requestId) => {
    const { updateRequests } = useGlobalStore();

    const handleReviewRequest = async (status) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post(`/request/review/${status}/${requestId}`);
            if (response.data.success) {
                updateRequests(requestId);
                toast.success(response.data.message);
            }
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message);
            } else {
                toast.error(err.message);
            }
        } finally {
            toast.dismiss(toastId);
        }
    };

    return { handleReviewRequest };
};

export default useReviewRequest; 