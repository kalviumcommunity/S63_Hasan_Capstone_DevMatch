import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useGlobalStore } from "../store/useStore.js";
import { axiosInstance } from "../utils/axiosInstance.js";

const useGetFeed = () => {
    const { feed, addFeed, updateFeed } = useGlobalStore();
    const [page, setPage] = useState(1);
    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        hasMore: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchFeed = useCallback(
        async (currentPage) => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get("/user/feed", {
                    params: {
                        page: currentPage,
                        limit: 10
                    }
                });
                if (response.data.success) {
                    addFeed(response.data.data);
                    setPaginationInfo(response.data.pagination);
                }
            } catch (err) {
                if (err.response) {
                    console.error(err.response.data.message);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [addFeed]
    );

    useEffect(() => {
        fetchFeed(1);
    }, [fetchFeed]);

    const handleSendRequest = useCallback(
        async (status, userId) => {
            try {
                const response = await axiosInstance.post(`/request/send/${status}/${userId}`);
                if (response.data.success) {
                    toast.success(response.data.message);
                    updateFeed(userId);

                    if (feed.length <= 1 && paginationInfo.hasMore) {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        fetchFeed(nextPage);
                    }
                }
            } catch (err) {
                if (err.response) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error(err.message);
                }
            }
        },
        [feed.length, fetchFeed, page, paginationInfo.hasMore, updateFeed]
    );

    const handleSwipe = useCallback(
        (direction, userId) => {
            handleSendRequest(direction === "left" ? "ignored" : "interested", userId);
        },
        [handleSendRequest]
    );

    return { isLoading, handleSwipe, handleSendRequest };
};

export default useGetFeed; 