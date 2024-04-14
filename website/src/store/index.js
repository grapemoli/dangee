import {createStore} from 'vuex';


// This store is mainly used for user authentication.
export default createStore({
    // State for state (global data).
    state: {
        // Information of the chain.
        chainId: 137,
        rpc: 'https://polygon-rpc.com',
        tokenName: 'MATIC',
        tokenDecimals: 18,
        tokenSymbol: 'MATIC',
        chainName: 'Polygon Mainnet',
        contractId: '0xbe72F442b6D8739e4F1dd4Fa78624b4FFdffDFD2',
        abi: '[{"inputs":[{"internalType":"address","name":"defaultAdmin","type":"address"},{"internalType":"address","name":"minter","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721IncorrectOwner","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721InsufficientApproval","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC721InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"ERC721InvalidOperator","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721InvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC721InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC721InvalidSender","type":"error"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721NonexistentToken","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_fromTokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_toTokenId","type":"uint256"}],"name":"BatchMetadataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"ItemForSale","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"ItemNotForSale","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"ItemSold","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"MetadataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"NewItem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"PriceUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"buy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"canMint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getSeller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newMinter","type":"address"}],"name":"grantMintRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isSelling","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"}],"name":"safeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"bool","name":"onMarket","type":"bool"}],"name":"safeMintWithPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bool","name":"_sell","type":"bool"}],"name":"setSelling","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"newPrice","type":"uint256"},{"internalType":"bool","name":"_sell","type":"bool"}],"name":"updateAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"updatePrice","outputs":[],"stateMutability":"nonpayable","type":"function"}]',

        // The smart contract instance, and WebSocket for listening to events live.
        contract: null,
        websocket: null,

        // Polygon gas fee from Polygon API.
        // Object: {LastBlock, SafeGasPrice, ProposeGasPrice, FastGasPrice, suggestBaseFee, gasUsedRatio, UsdPrice}
        gasFee: 0,

        // Information of user authentication.
        isAuth: !!!!window.localStorage.getItem("userWalletAddress"),
        userId: window.localStorage.getItem("userWalletAddress"),

        // User information.
        balance: 0,                     // Balance in GWei / MATIC.
        minter: null,
        nft: [],                        // All NFTs the user owns. Only contains the tokenId.
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
        },
        update_contract(state, payload) {
            state.contract = payload;
        },
        update_balance(state, payload) {
            state.balance = payload;
        },
        update_minter(state, payload) {
            state.minter = payload;
        },
        update_gas_fee(state, payload) {
            state.gasFee = payload;
        },
        update_nft(state, payload) {
            state.nft = payload;
        }
    },
    // Actions are dispatches that call the mutations.
    actions: {
        // Signs in all wallets on the MetaMask extension that are registered onto dangee.
        login({commit, dispatch}, walletId) {
            window.userWalletAddress = walletId;
            window.localStorage.setItem("userWalletAddress", walletId);
            commit("update_auth", walletId);
            dispatch("updateBalance");
            dispatch('updateMinter');
            dispatch('updateNFTList');
        },

        // Signs out all wallets on the MetaMask extension that are registered onto dangee.
        logout({commit, dispatch}) {
            window.localStorage.removeItem("userWalletAddress");
            window.userWalletAddress = null;
            commit("update_auth", null);
            dispatch("updateBalance");
            dispatch('updateMinter');
            dispatch('updateNFTList');
        },

        // Switches the account if the user selects a different account on MetaMask. The MetaMask API
        // only emits this event if the account is registered with the dangee platform, so we don't
        // need to check if the account 'belongs' to dangee or is logged in (generally speaking).
        switchAccount(context, walletId) {
            window.userWalletAddress = walletId;
            window.localStorage.setItem("userWalletAddress", walletId);
            context.commit("switch_acc", walletId);
        },

        setContract(context, contract) {
            context.commit("update_contract", contract);
        },

        // Updates the user's balance.
        updateBalance({commit, state}) {
            var balance = 0;

            if (window.ethereum && state.isAuth) {
                const web3 = new Web3(window.ethereum);
                web3.eth.getBalance(state.userId).then((result) => {
                    balance = web3.utils.fromWei(result, "ether");
                    commit('update_balance', balance);
                });
            }
        },
        updateMinter({commit, state}) {
            if (window.ethereum && state.isAuth) {
                // The admin can automatically mint.
                if (state.userId === import.meta.env.VITE_WALLET_ADDRESS.toLowerCase()) {
                    commit('update_minter', true);
                }
                else {
                    state.contract.methods.canMint().call({from: state.userId}).then(async (res) => {
                        commit('update_minter', res)
                    });
                }
            }
            else {
                commit('update_minter', null)
            }
        },
        updateGasFee(context) {
            // Update the gas fee using the Polygon API.
            const url = `https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${import.meta.env.VITE_POLYGONSCAN_API_KEY}`;

            fetch(url).then((response) => {
                response.json().then((gasPrices) => {
                    context.commit('update_gas_fee', gasPrices.result);
                })
            })
        },
        updateNFTList({commit, state}) {
            // Update the NFT state.
            if (state.isAuth) {

                // Get the total number of tokens.
                state.contract.methods.totalItems().call().then(async (totalItems) => {

                    var arrNft = [];

                    // Parse through all items, only pushing the tokenID's whose owner is the user.
                    for(var i = 0; i < totalItems; i++) {

                        const owner = await state.contract.methods.getSeller(i).call();

                        // The owner owns this NFT!! Get the NFT information.
                        if(owner.toLowerCase() === state.userId.toLowerCase()) {

                            const IPFSHash = await state.contract.methods.getURI(i).call();

                            var newNFT = {
                                URI: IPFSHash,
                                URL: `${import.meta.env.VITE_GATEWAY_PRE}${IPFSHash}${import.meta.env.VITE_GATEWAY_POST}`,
                                owner: (await state.contract.methods.getSeller(i).call()).toLowerCase(),
                                selling: await state.contract.methods.isSelling(i).call(),
                                tokenId: i,
                                price: Number(await state.contract.methods.getPrice(i).call())        // Price in Wei. Divide by 10^-18 to get MATIC/Gwei.
                            };

                            arrNft.push(newNFT);
                        }
                    }

                    commit('update_nft', arrNft);
                })
            }
            else {
                // Users who aren't logged in have no NFTs.
                commit('update_nft', []);
            }
        },

        removeNFT({commit, state}, tokenId) {
            var NFTList = state.nft;
            const index = NFTList.findIndex(obj => {
                return obj.tokenId === tokenId
            });

            // If item is found...
            if (index) {
                // Remove it!
                NFTList.splice(index, 1);
                commit('update_nft', NFTList);
            }
        },

        addNFT({commit, state}, tokenId) {
            var NFTList = state.nft;

            // Get the state of the NFT.
            state.contract.methods.getSeller(tokenId).call().then(async (owner) => {

                // The owner owns this NFT!! Get the NFT information.
                if(owner.toLowerCase() === state.userId.toLowerCase()) {

                    const IPFSHash = await state.contract.methods.getURI(i).call();

                    var newNFT = {
                        URI: IPFSHash,
                        URL: `${import.meta.env.VITE_GATEWAY_PRE}${IPFSHash}${import.meta.env.VITE_GATEWAY_POST}`,
                        owner: (await state.contract.methods.getSeller(tokenId).call()).toLowerCase(),
                        selling: await state.contract.methods.isSelling(tokenId).call(),
                        tokenId: tokenId,
                        price: Number(await state.contract.methods.getPrice(tokenId).call())        // Price in Wei. Divide by 10^-18 to get MATIC/Gwei.
                    };

                    NFTList.push(newNFT);
                    commit('update_nft', NFTList);
                }
            });
        },

        updateNFT({commit, state}, tokenId) {
            var NFTList = state.nft;
            const index = NFTList.findIndex(obj => {
                return obj.tokenId === tokenId
            });

            // Get the updated NFT information from the smart contract, and update the store.
            state.contract.metods.getURI(tokenId).call().then(async (IPFSHash) => {
                NFTList[index] = {
                    URI: IPFSHash,
                    URL: `${import.meta.env.VITE_GATEWAY_PRE}${IPFSHash}${import.meta.env.VITE_GATEWAY_POST}`,
                    owner: (await state.contract.methods.getSeller(i).call()).toLowerCase(),
                    selling: await state.contract.methods.isSelling(i).call(),
                    tokenId: i,
                    price: Number(await state.contract.methods.getPrice(i).call())        // Price in Wei. Divide by 10^-18 to get MATIC/Gwei.
                };

                commit("update_nft", NFTList);
            })
        },

        updateNFTPrice({commit, state}, tokenId, price) {
            var NFTList = state.nft;
            const index = NFTList.findIndex(obj => {
                return obj.tokenId === tokenId
            });

            NFTList[index].price = price;
            commit("update_nft", NFTList);
        },

        updateNFTSell({commit, state}, tokenId, sellingStatus) {
            var NFTList = state.nft;
            const index = NFTList.findIndex(obj => {
                return obj.tokenId === tokenId
            });

            NFTList[index].selling = sellingStatus;
            commit("update_nft", NFTList);
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
        contractId: function(state) {
          return state.contractId;
        },
        abi: function(state) {
            return JSON.parse(state.abi);
        },
        contract: function(state) {
            return state.contract;
        },
        websocket: function(state) {
            return state.websocket;
        },
        isAuth: function(state) {
            return state.isAuth;
        },
        userId: function(state) {
            return state.userId;
        },
        balance: function(state) {
            return state.balance;
        },
        minter: function(state) {
            return state.minter;
        },
        gasFee: function(state) {
            return state.gasFee;
        },
        nft: function(state) {
            return state.nft;
        }
    }
})
