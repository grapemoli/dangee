require ('dotenv').config ();
require ("@nomicfoundation/hardhat-ethers");
require ("@nomicfoundation/hardhat-verify");
require ("@nomicfoundation/hardhat-chai-matchers");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2]
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
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
  sourcify: {
    enabled: true
  }
}

