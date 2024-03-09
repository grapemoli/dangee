// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require ("hardhat");
require ('dotenv').config ();


async function main () {
  console.log ("Deploying contract...");
  const item = await hre.ethers.deployContract ("Item", [process.env.WALLET_ADDRESS, process.env.WALLET_ADDRESS], {value: process.env.WALLET_ADDRES});

  // Note here that the Item.sol contract requires two parameters: a default admin,
  // and an initial minter. Here, the account specified in the .env is used for both.
  console.log ("Waiting for contract to deployed...");
  await item.waitForDeployment ();

  console.log ("Item.sol deployed to:", item.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main ().catch ((error) => {
  console.error (error);
  process.exitCode = 1;
});
