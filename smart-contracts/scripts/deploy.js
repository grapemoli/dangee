// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require ("hardhat");
require ('dotenv').config ();


async function main () {
  const ItemContractFactory = await hre.ethers.getContractFactory ("Item");
  console.log ("Deploying contract...");

  // Note here that the Item.sol contract requires two parameters: a default admin,
  // and an initial minter. Here, the account specified in the .env is used for both.
  const itemContract = await ItemContractFactory.deploy (process.env.WALLET_ADDRESS, process.env.WALLET_ADDRESS);
  console.log ("Waiting for contract to deployed...");

  await itemContract.waitForDeployment ();
  console.log ("Item.sol deployed to:", itemContract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main ().catch ((error) => {
  console.error (error);
  process.exitCode = 1;
});
