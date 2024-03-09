// This script is meant to interact with the verified smart contract on the Mumbai testnet, with
// address of 0x005e3E29DCC8a11B28C64f49BbBf338856e2cC4b.

const hre = require ("hardhat");
const ethers = require ('ethers');
require ('dotenv').config ();

async function main() {
    // Get the array of accounts specified in the config.
    const [owner, other1] = await hre.ethers.getSigners ()

    // Get the ContractFactory of ItemContract
    const ItemContractFactory = await hre.ethers.getContractFactory ("Item");

    // Connect to the deployed contract
    const contractAddress = "0x005e3E29DCC8a11B28C64f49BbBf338856e2cC4b";
    const ItemContract = await ItemContractFactory.attach (contractAddress);

    // Minting [the first] NFT(s). Keep commented unless needed.
    //await ItemContract.connect (owner).safeMintWithPrice (process.env.WALLET_ADDRESS, "QmSVPkvNkyMVTXAGmjJxSg9mJdsWLXMGWXpSeMGP9r9ejC", 10, true);

    // Getter of the [first] NFT.
    const tokenId = 0;      // First NFT has tokenId 0.
    const seller = await ItemContract.connect (owner).getPrice (tokenId);
    console.log (seller);

    // Sell NFT. Keep commented unless needed.
    //await ItemContract.connect (owner).buy (tokenId, {value: 1});

    const nft_owner = await ItemContract.connect (other1).getSeller (tokenId);
    console.log (nft_owner);
}

main ().catch ((error) => {
    console.error (error);
    process.exitCode = 1;
});