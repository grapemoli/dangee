/*  onChain.js
 *
 * Checks that the user is on the chain specified in the store. If the user
 * if not on the chain, prompt them to do so OR add the chain to MetaMask if it
 * does not exist.
 *
 * Returns true if the user successfully switches to the chain, false otherwise.
 */
import { useStore } from 'vuex';

export default function onChain() {
    // Check that the browser is Web3-ied and uses MetaMask.
    const store = useStore();
    const chainId = store.getters['chainId'];

    if (window.ethereum && window.ethereum.isMetaMask  && window.localStorage.getItem("userWalletAddress")) {

        const web3 = new Web3(window.ethereum);

        // If the user is not on the chain...
        if (window.ethereum.networkVersion !== chainId) {

            // ...try to switch the user to the chain.
            try {
                window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: web3.utils.toHex(chainId)}]
                }).then(() => {
                    return true
                });
            } catch (err) {

                // Error 4902 is thrown if the user does not have the chain on their MetaMask account.
                // In which case, we try to add the chain for them.
                if (err.code === 4902) {
                    window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainName: store.getters['chainName'],
                                chainId: web3.utils.toHex(chainId),
                                nativeCurrency: {
                                    name: store.getters['tokenName'],
                                    decimals: store.getters['tokenDecimals'],
                                    symbol: store.getters['tokenSymbol']
                                },
                                rpcUrls: [store.getters['rpc']]
                            }
                        ]
                    }).then(() => {
                        return true;
                    }).catch((err) => {
                        return false;
                    });
                }
                // General catch-all of errors.
                else {
                    return false;
                }
            }
        }
    }
}