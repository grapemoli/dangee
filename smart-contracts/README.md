# Smart Contracts
The core of the dangee dApp: smart contracts deployed on the Polygon blockchain.

The structure of the dictionary is: 
- **contracts/** - ERC721 smart contracts, written for Solidity 8.20 with the help of [OpenZeppelin 5.0.0](https://www.openzeppelin.com/contractsv).
- **scripts/** - scripts are used for deploying the smart contract(s) to a test/real network.
- **tests/** - tests using [Chai](https://www.chaijs.com), with the [hardhat-chai-matchers](https://hardhat.org/hardhat-chai-matchers/docs/reference) plugin. 

> Mumbai Address: ```0x005e3E29DCC8a11B28C64f49BbBf338856e2cC4b```
>
> View and interact with the smart contract [here](https://mumbai.polygonscan.com/address/0x005e3E29DCC8a11B28C64f49BbBf338856e2cC4b).
> **Note that Mumbai was deprecated on April 8, 2024.**

> Polygon Address ```https://polygonscan.com/address/0xbe72f442b6d8739e4f1dd4fa78624b4ffdffdfd2```
>
> View and interact [here](https://polygonscan.com/address/0xbe72f442b6d8739e4f1dd4fa78624b4ffdffdfd2).
## Development

### **Note: Mumbai was deprecated on April 8, 2024.**
### **This README utilized hardhat-deploy, but hardhat now uses hardhat-ignition.**

Before proceeding, please make a MetaMask account, and add the Polygon mainnet and testnet to your networks. You will also need a PolygonScan account.
1. Please make sure you're running  **Node v20**
2. Run ```npm install``` to install all dependencies

### Prerequisites
#### .env
You will need the following information in smart-contracts/.env:

- **PRIVATE_KEY**: the private key of the wallet associated with Mumbai.
- **POLYGONSCAN_API_KEY**: API key from your PolygonScan account.

```shell
PRIVATE_KEY = "walletPrivateAPIKey"
WALLET_ADDRESS = "walletPublicKey"
POLYGONSCAN_API_KEY = "PolygonScanAPIKey"

PINATA_API_KEY = "PinataAPIKey"
GATEWAY_PRE = "https://bronze-high-limpet-121.mypinata.cloud/ipfs/"
GATEWAY_POST = "?pinataGatewayToken={yourToken}"

TESTNET_ADDRESS = "smartContractAddressOnTestnet"

...
...

# Add as many wallets as needed.
PRIVATE_KEY_2 = "wallet2PrivateKey"
WALLET_2_ADDRESS = "wallet2PublicKey"
```

#### hardhat.config.js
> **Note**: ```hardhat.config.js``` uses the ```default_network``` value to set the
network that the commands will interact with 
>
> You can change the network Hardhat uses by changing this attribute in the config, or by appending ```--network {networkNameInConfig}``` 
at the end of terminal commands.
```shell
require('dotenv').config();
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-chai-matchers");

module.exports = {
  defaultNetwork: "hardhat",                      // change as needed 
  networks: {
    hardhat: {
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY, process.end.PRIVATE_KEY2, ...]
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
}
```

### Compiling & Testing on the Hardhat Network
It is generally recommended that you deploy your contract on a local (e.g., Hardhat network) blockchain
before deploying on a live testnet.
1. To compile your smart contracts, run ```npx hardhat compile```
2. To run your tests against the smart contracts, run ```npx hardhat test```

> **Note**: You can append ```/{fileName}``` to compile or test specific files.

#### Useful Hardhat Commands
```shell
npx hardhat help
REPORT_GAS=true npx hardhat test      # reports gas usage
npx hardhat node
npx hardhat run scripts/deploy.js     
npx hardhat test --network hardhat    # sets the network to hardhat
npx hardhat run --network <your-network> scripts/deploy.js  # You can use any network in your config
```

### Compiling & Testing on Mumbai
>**Note**:  To test your smart contract methods, you may need at least two wallets.

The Polygon test network allows users to test how much deploying and running 
their smart contracts may cost without needing actual MATIC. Instead, "test" MATIC
is issued to the user.

1. Set up your MetaMask wallet(s). See the [Polygon docs](https://docs.polygon.technology/tools/wallets/metamask/add-polygon-network/#mainnet_1) for more information.
2. Get test MATIC at [Polygon Faucet](https://faucet.polygon.technology/).
3. Write the script for deployment. Read more at [article](https://medium.com/@yuvrajkakkar1/deploying-a-smart-contract-on-the-polygon-test-network-9071d5614cd3).
The ```deploy.js``` script in this dictionary sets the initial roles **admin** and **minter** to
the one account in the ```.env```.
4. Deploy to Mumbai:
```script
npx hardhat run scripts/deploy.js --network mumbai
```
5. Verify your smart contract. You can do so directly on PolygonScan, or by Hardhat via terminal commands. See [here](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)
for the Hardhat method, which I found to be more successful.
6. You can then see the smart contract contents, and interact with it directly on PolygonScan. Alternatively, you can configure
the ```scripts/testnet.js``` file to deploy a testnet-interacting script.

### Minting NFTs 
For the most part, the front-end will be slated to take care of IPFS-related processes. "Front-end," here refers to using 
[Piñata API](https://www.pinata.cloud). 

The NFT, itself, is not stored on the blockchain. Instead, the IPFS hash is stored on the
blockchain, which when used in the IPFS "url", we can bring up the NFT image and metadata.



