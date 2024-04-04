import { createStore } from 'vuex'


// This store is mainly used for user authentication.
export default createStore({
    // State for state (global data).
    state: {
        isAuth: !!!!window.localStorage.getItem("userWalletAddress"),
        userId: window.localStorage.getItem("userWalletAddress")
    },
    // Mutations commit the data.
    mutations: {
        update_auth(state, payload) {
            state.userId = payload;
            state.isAuth = !(payload == null);
        }
    },
    // Actions are dispatches that call the mutations.
    actions: {
        login(context, walletId) {
            window.userWalletAddress = walletId;
            window.localStorage.setItem("userWalletAddress", walletId);
            context.commit("update_auth", walletId);
        },
        logout(context) {
            window.localStorage.removeItem("userWalletAddress");
            window.userWalletAddress = null;
            context.commit("update_auth", null);
        }
    },
    // Getters store computed properties.
    getters: {
        isAuth: function(state) {
            return state.isAuth;
        },
        userId: function(state) {
            return state.userId;
        }
    }
})
