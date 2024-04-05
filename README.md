# dangee
A Web3-Based NFT Trading Platform.

## Description
dangee is a Web3-based NFT trading platform built on the [Polygon](https://polygon.technology) blockchain. 
The Polygon blockchain, in particular, is used due to its compatability with Ethereum while featuring much lower gas fees.

Users are able to register onto the platform using Web3 Authentication (i.e., their wallets). Outside of authentication,
the user is able to:
1. interact with the smart contract, and 
2. mint and sell NFTs privately with other
users/wallets.

## Wallets
Please make a MetaMask wallet, and add/keep the MetaMask wallet to your account:
![Screenshot 2024-04-04 at 5.49.46 PM.png](..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2F23%2Fjc9pcnfd10q2q27zck3k27vh0000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_pY0MU2%2FScreenshot%202024-04-04%20at%205.49.46%E2%80%AFPM.png)


### User Roles
There are two, technically three, roles on the smart contracts.
1. **DEFAULT_ADMIN** - the original creator of the contract (me)
2. **MINT_ROLE** - any users granted the ability to mint NFTs
3. users who are neither minters nor admins.

As the role names imply, an admin work with any method on the smart contract. Users with the **MINT_ROLE** role are able to mint NFTs.
Note, these users cannot revoke nor grant **MINT_ROLE** access to other users.

The **MINT_ROLE** helps to gate access to minting only to those with permission. The goal is to protect dangee against 
spam minting. As of right now, the **MINT_ROLE** is granted to those who connect their wallet to the platform.

## Interacting with dangee
Future plans are to deploy dangee onto Microsoft Azure; however, as of yet, dangee remains on the localhost.

## Development

### Front End Development
Please note that dangee is currently working on the Mumbai testnet, so all transactions and NFT minting are occuring on the testnet.

For more information, refer to the [```website``` directory](https://github.com/grapemoli/dangee/tree/main/website).

### Smart Contract Development
For more information, refer to the [```smart-contract``` directory](https://github.com/grapemoli/dangee/tree/main/smart-contracts).
