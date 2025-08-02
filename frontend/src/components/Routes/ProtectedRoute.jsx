import { Navigate } from "react-router";

import { useGlobalStore } from "../../store/useStore.js";

const ProtectedRoute = ({ children }) => {
    const { user } = useGlobalStore();
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }
    return children;
};

export default ProtectedRoute; 