# website
An SPA created by Vue3, this website enables:
- Web3 authentication (i.e., logging in with your wallet),
- viewing the marketplace,
- trading/selling NFTs, and
- minting NFTs.


## Requirements
To use this service, please setup the Mumbai Testnet on your MetaMask account. An example:
![Screenshot 2024-04-04 at 5.49.46 PM.png](..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2F23%2Fjc9pcnfd10q2q27zck3k27vh0000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_pY0MU2%2FScreenshot%202024-04-04%20at%205.49.46%E2%80%AFPM.png)

## Web3 Authentication
We currently only support the MetaMask wallet, as Web3 authentication was done via the [MetaMask API](https://docs.metamask.io/).

Under the MetaMask method, users are asked to allow their wallet to access dangee. After the user accepts this, the user will
not be prompted to 'allow' dangee to see their wallet again unless their wallet is disconnected.

> To disconnect a wallet is not the same as to 'logout' of dangee.


While users are given the option to "logout," this only removes the data stored on the window browser. To _disconnect_ a wallet,
**the user must manually disconnect their wallet** within MetaMask. If the user disconnects their wallet, then when logging into dangee,
they will be asked once again if they would like to 'allow' dangee to see their wallet.

Lastly, dangee does support accounts that have multiple wallets. You can switch between them as needed,
and dangee will re-render as you do.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development
Note that the project is hosted on [localhost:5137](http://localhost:5173/).
```sh
npm run dev
```


### Compile and Minify for Production

```sh
npm run build
```
