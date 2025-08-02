import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { useGlobalStore } from "../store/useStore.js";
import { axiosInstance } from "../utils/axiosInstance.js";

const useEditProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { addUser } = useGlobalStore();

    const handleEditProfile = useCallback(
        async (data) => {
            setIsLoading(true);
            const toastId = toast.loading("Loading...");
            try {
                const response = await axiosInstance.patch("/profile/edit", data);
                if (response.data.success) {
                    addUser(response.data.data);
                    toast.success(response.data.message);
                }
            } catch (err) {
                if (err.response) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error(err.message);
                }
            } finally {
                setIsLoading(false);
                toast.dismiss(toastId);
            }
        },
        [addUser]
    );

    return { isLoading, handleEditProfile };
};

export default useEditProfile; 