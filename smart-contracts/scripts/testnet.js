// This script is meant to interact with the verified smart contract on the Mumbai testnet, with
// address of 0x005e3E29DCC8a11B28C64f49BbBf338856e2cC4b.

const hre = require ("hardhat");
const ethers = require ('ethers');
require ('dotenv').config ();

async function main() {
    // Get the ContractFactory of ItemContract
    const ItemContractFactory = await hre.ethers.getContractFactory ("Item");

    // Connect to the deployed contract
    const contractAddress = "0x005e3E29DCC8a11B28C64f49BbBf338856e2cC4b";
    const ItemContract = await ItemContractFactory.attach (contractAddress);

    // Minting [the first] NFT.
    //await ItemContract.safeMintWithPrice (process.env.WALLET_ADDRESS, "QmSVPkvNkyMVTXAGmjJxSg9mJdsWLXMGWXpSeMGP9r9ejC", 1, true);

    // Get the {information} of the first NFT.
    const tokenId = 0;      // First NFT has tokenId 0.
    const uri = await ItemContract.getURI (tokenId);

    console.log (uri);
}

main ().catch ((error) => {
    console.error (error);
    process.exitCode = 1;
});