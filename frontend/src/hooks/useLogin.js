import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { useGlobalStore } from "../store/useStore.js";
import { axiosInstance } from "../utils/axiosInstance.js";

const useLogin = (reset) => {
    const [isLoading, setIsLoading] = useState(false);
    const { addUser } = useGlobalStore();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        setIsLoading(true);
        const toastId = toast.loading("Loading...");

        try {
            const response = await axiosInstance.post("/auth/login", data);
            if (response.data.success) {
                toast.success(response.data.message);
                addUser(response.data.data);
                navigate("/feed", { replace: true });
                reset();
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
    };

    return { isLoading, handleLogin };
};

export default useLogin; 