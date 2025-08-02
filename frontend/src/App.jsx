import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router";

import Footer from "./components/Common/Footer.jsx";
import Header from "./components/Common/Header.jsx";
import Loader from "./components/Common/Loader.jsx";
import ProtectedRoute from "./components/Routes/ProtectedRoute.jsx";
import PublicRoute from "./components/Routes/PublicRoute.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Feed = lazy(() => import("./pages/Feed.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Requests = lazy(() => import("./pages/Requests.jsx"));
const Connections = lazy(() => import("./pages/Connections.jsx"));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const App = () => {
    return (
        <>
            <Header />
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <Home />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <Signup />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/feed"
                        element={
                            <ProtectedRoute>
                                <Feed />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/requests"
                        element={
                            <ProtectedRoute>
                                <Requests />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/connections"
                        element={
                            <ProtectedRoute>
                                <Connections />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/chat/:userId"
                        element={
                            <ProtectedRoute>
                                <Chat />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </Suspense>
            <Footer />
            <Toaster />
        </>
    );
};

export default App; 