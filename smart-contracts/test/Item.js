const { expect } = require ("chai");
const { ethers } = require ("hardhat");
const { BigNumber } = require("bignumber.js");

describe ("Item Contract", function () {
    describe ("ROLE: Minting by users with MINT_ROLE", function () {
       it ("Minting should fire NewItem event", async function () {
           const [owner, minter] = await ethers.getSigners ();
           const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

           const tokenURI = "test_nft";
           const tokenId = await ItemContract.totalItems ();

           await expect (ItemContract.safeMint (minter, tokenURI))
               .to.emit (ItemContract, "NewItem")
               .withArgs (minter, tokenId, 0);
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
                .to.be.revertedWithCustomError (ItemContract, "AccessControlUnauthorizedAccount");
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
                .withArgs (minter, tokenId, 0);
        });
    });

    describe ("Minting & Price tests", function () {
        it ("updatePrice should PriceUpdate event", async function () {
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMint (owner, tokenURI);

            await expect (ItemContract.updatePrice (tokenId, price))
                .to.emit (ItemContract, "PriceUpdate")
                .withArgs (owner, tokenId, 0, price);
        });

        it ("updatePrice should update price map", async function () {
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMint (owner, tokenURI);
            await ItemContract.updatePrice (tokenId, 110);

            expect (await ItemContract.getPrice (tokenId)).to.be.equal (price);
        });

        it ("Only owner [or admin] of NFT should change price", async function () {
            const [owner, other] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMint (owner, tokenURI);
            await ItemContract.grantMintRole (other);
            await ItemContract.updatePrice (tokenId, 110);

            await expect (ItemContract.connect (other).updatePrice (tokenId, 110))
                .to.be.revertedWith ("You are not the owner of this NFT");
        });

        it ("^ but with the admin, who is not the NFT owner", async function () {
            const [owner, other] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.grantMintRole (other);
            await ItemContract.connect (other).safeMint (other, tokenURI);
            await ItemContract.connect (owner). updatePrice (tokenId, 110);

            expect (await ItemContract. getPrice (tokenId)).to.be.equal (110);
        });


        it ("Init minting with price should emit init-ed price", async function () {
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price);

            expect (await ItemContract.getPrice (tokenId)).to.be.equal (price);
        });

        it ("Users without mint-roles can get NFT price (also tests for non-owners)", async function () {
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price);

            expect (await ItemContract. connect (others). getPrice (tokenId)).to.be.equal (price);
        });

        // Removed because while Solidity supports method overrloading,c JavaScript does not;
        // and HardHat currently provides little to no support on testing overloaded methods.
        /*
        it ("Init minting with price should emit event properly", async function () {
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();

            await expect (ItemContract.safeMint (owner, tokenURI, 100))
                .to.emit (ItemContract, "NewItem")
                .withArgs (owner, tokenId, 100);
        });
        */
    });

    describe ("Minting: Testing misc. validity / edge cases", function () {
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

        // The below is commented out because it was tested via unorthodox means (initializing
        // the tokenId to 2^256-1 in the constructor); this test passed via said unorthodox means.
        /*
        it ("Should not be able to mint if reached max tokenId", async function () {
            const [owner, minter] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";

            // Note that _nextTokenId also doubles as the total number of items count,
            // as the _nextTokenId starts at 0. When the first NFT is minted, it becomes 1.

            await ItemContract.safeMint (owner, tokenURI);

            expect (await ItemContract.totalItems ()).to.be.equal (2^256);
        });
        */
    });
});
