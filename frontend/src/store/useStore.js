import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const useGlobalStore = create()(
    devtools(
        persist(
            (set) => ({
                // States
                user: null,
                feed: [],
                requests: [],
                connections: [],
                messages: [],

                // Actions
                addUser: (userData) => set({ user: userData }),
                clearUser: () => {
                    set({ user: null });
                    localStorage.removeItem("devmatch_userInfo");
                },

                addFeed: (feedData) => set({ feed: feedData }),
                updateFeed: (userId) => set((state) => ({ feed: state.feed.filter((user) => String(user._id) !== String(userId)) })),
                clearFeed: () => set({ feed: [] }),

                addRequests: (requestData) => set({ requests: requestData }),
                updateRequests: (requestId) =>
                    set((state) => ({ requests: state.requests.filter((request) => String(request._id) !== String(requestId)) })),
                clearRequests: () => set({ requests: [] }),

                addConnections: (connectionsData) => set({ connections: connectionsData }),
                clearConnections: () => set({ connections: [] }),

                addMessages: (messagesData) => set({ messages: messagesData }),
                updateMessages: (newMessage) => set((state) => ({ messages: [...state.messages, newMessage] })),
                clearMessages: () => set({ messages: [] })
            }),
            {
                name: "devmatch_userInfo",
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ user: state.user })
            }
        )
    )
); 