import { createStore } from 'vuex';
const web3 = new Web3(window.ethereum);


// This store is mainly used for user authentication.
export default createStore({
    // State for state (global data).
    state: {
        // Information of the chain.
        chainId: 80001,
        rpc: 'https://polygon-mumbai-bor-rpc.publicnode.com',
        tokenName: 'MATIC',
        tokenDecimals: 18,
        tokenSymbol: 'MATIC',
        chainName: 'Polygon Mumbai Testnet',

        // Information of user authentication.
        isAuth: !!!!window.localStorage.getItem("userWalletAddress"),
        userId: window.localStorage.getItem("userWalletAddress"),
    },
    // Mutations commit the data.
    mutations: {
        update_auth(state, payload) {
            state.userId = payload;
            state.isAuth = !(payload == null);
        },
        switch_acc(state, payload) {
            const temp = state.userId[0];
            const index = state.userId.indexOf(payload);
            state.userId[0] = state.userId[index];
            state.userId[index] = temp;
        }
    },
    // Actions are dispatches that call the mutations.
    actions: {
        // Signs in all wallets on the MetaMask extension that are registered onto dangee.
        login(context, walletId) {
            window.userWalletAddress = walletId;
            window.localStorage.setItem("userWalletAddress", walletId);
            context.commit("update_auth", walletId);
        },

        // Signs out all wallets on the MetaMask extension that are registered onto dangee.
        logout(context) {
            window.localStorage.removeItem("userWalletAddress");
            window.userWalletAddress = null;
            context.commit("update_auth", null);
        },

        // Switches the account if the user selects a different account on MetaMask. The MetaMask API
        // only emits this event if the account is registered with the dangee platform, so we don't
        // need to check if the account 'belongs' to dangee or is logged in (generally speaking).
        switchAccount(context, walletId) {
            window.userWalletAddress = walletId;
            window.localStorage.setItem("userWalletAddress", walletId);
            context.commit("switch_acc", walletId);
        }
    },
    // Getters store computed properties.
    getters: {
        chainId: function(state) {
            return state.chainId;
        },
        rpc: function(state) {
            return state.rpc;
        },
        tokenName: function(state) {
            return state.tokenName;
        },
        tokenDecimals: function(state) {
            return state.tokenDecimals;
        },
        tokenSymbol: function(state) {
            return state.tokenSymbol;
        },
        chainName: function(state) {
            return state.chainName;
        },
        isAuth: function(state) {
            return state.isAuth;
        },
        userId: function(state) {
            return state.userId;
        },
    }
})
