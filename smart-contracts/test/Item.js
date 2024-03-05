const { expect } = require ("chai");
const { ethers } = require ("hardhat");

describe ("Item Contract", function () {
    describe ("ROLE: Minting by users with MINT_ROLE", function () {
       it ("Minting should fire NewItem event", async function () {
           const [owner, minter] = await ethers.getSigners ();
           const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

           const tokenURI = "test_nft";
           const tokenId = await ItemContract.totalItems ();

           await expect (ItemContract.safeMint (minter, tokenURI))
               .to.emit (ItemContract, "NewItem")
               .withArgs (minter, tokenId);
       });

        it ("canMint () should return true", async function () {
            const [owner, minter, other] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            expect (await ItemContract. canMint ()).to.equal (true);
        });

    });

    describe ("Minting by users without MINT_ROLE", function () {
        it ("ROLE: Minting should be reverted", async function () {
            const [owner, minter, other] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";

            await expect (ItemContract.connect (other).safeMint (minter, tokenURI))
                .to.be.revertedWithCustomError(ItemContract, "AccessControlUnauthorizedAccount");
        });

        it ("canMint () should return false", async function () {
            const [owner, minter, other] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            expect (await ItemContract.connect (other). canMint ()).to.equal (false);
        });

        it ("MINT_ROLE can be granted to non-minters", async function () {
            const [owner, minter, other] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            await ItemContract.grantMintRole (other);

            expect (await ItemContract.connect (other).canMint ()).to.be.equal (true);
        });

        it ("MINT_ROLE can be granted, and minting by prev non-minter should emit event", async function () {
            const [owner, minter, other] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();

            await ItemContract.grantMintRole (other);

            await expect (ItemContract.connect (other).safeMint (minter, tokenURI))
                .to.emit (ItemContract, "NewItem")
                .withArgs (minter, tokenId);
        });
    });

    describe ("MINTING: Testing minting validity", function () {
        it ("TokenID should increment properly with multiple mints", async function () {
            const [owner, minter] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";

            // Note that _nextTokenId also doubles as the total number of items count,
            // as the _nextTokenId starts at 0. When the first NFT is minted, it becomes 1.
            await ItemContract.safeMint (minter, tokenURI); // _nextTokenId = 1
            await ItemContract.safeMint (minter, tokenURI); // _nextTokenId = 2
            await ItemContract.safeMint (minter, tokenURI); // _nextTokenId = 3
            await ItemContract.safeMint (minter, tokenURI); // _nextTokenId = 4

            expect (await ItemContract.totalItems ()).to.be.equal (4);
        });
    });
});
