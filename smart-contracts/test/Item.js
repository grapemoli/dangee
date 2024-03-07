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
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            expect (await ItemContract.canMint ()).to.equal (true);
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
            const [owner, other] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            expect (await ItemContract.connect (other).canMint ()).to.equal (false);
        });

        it ("MINT_ROLE can be granted to non-minters", async function () {
            const [owner, other] = await ethers.getSigners ();
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
        it ("updatePrice should fire PriceUpdate event", async function () {
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMint (owner, tokenURI);

            await expect (ItemContract.updatePrice (tokenId, price + 1))
                .to.emit (ItemContract, "PriceUpdate")
                .withArgs (owner, tokenId, 0, price + 1);
        });

        it ("updatePrice should update price map", async function () {
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMint (owner, tokenURI);
            await ItemContract.updatePrice (tokenId, price + 1);

            expect (await ItemContract.getPrice (tokenId)).to.be.equal (price + 1);
        });

        it ("Only owner [or admin] of NFT should change price", async function () {
            const [owner, other] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();

            await ItemContract.safeMint (owner, tokenURI);
            await ItemContract.grantMintRole (other);
            await ItemContract.updatePrice (tokenId, 110);

            await expect (ItemContract.connect (other).updatePrice (tokenId, 111))
                .to.be.revertedWith ("You are not the owner of this NFT");
        });

        it ("^ but with the admin, who is not the NFT owner", async function () {
            const [owner, other] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();

            await ItemContract.grantMintRole (other);
            await ItemContract.connect (other).safeMint (other, tokenURI);
            await ItemContract.connect (owner).updatePrice (tokenId, 110);

            expect (await ItemContract.getPrice (tokenId)).to.be.equal (110);
        });


        it ("Init minting with price should emit init-ed price", async function () {
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            expect (await ItemContract.getPrice (tokenId)).to.be.equal (price);
        });

        it ("Users without mint-roles can get NFT price (also tests for non-owners)", async function () {
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            expect (await ItemContract.connect (others).getPrice (tokenId)).to.be.equal (price);
        });

        it ("Should be automatically sellable", async function () {
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            expect (await ItemContract.connect (others).isSelling (tokenId)).to.be.equal (true);
        });
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
    });

    describe ("Setting NFT metadata", async function () {
        it ("Should be able to turn off selling", async function (){
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);
            await ItemContract.setSelling (tokenId, false);
            expect (await ItemContract.connect (others).isSelling (tokenId)).to.be.equal (false);
        });

        it ("Should be able to turn on selling", async function (){
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);
            await ItemContract.setSelling (tokenId, true);
            expect (await ItemContract.isSelling (tokenId)).to.be.equal (true);
        });

        it ("Should be able to update price", async function (){
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);
            await ItemContract.updatePrice (tokenId, 1234);

            expect (await ItemContract.getPrice (tokenId)).to.be.equal (1234);
        });

        it ("Should not be able to update price if updating to the same price", async function () {
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            await expect (ItemContract.updatePrice (tokenId, price))
                .to.be.revertedWith ('Already this price.');
        });

        it ("Should not be able to update price if not NFT owner", async function (){
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            await expect (ItemContract.connect (others).updatePrice (tokenId, 0))
                .to.be.revertedWith ('You are not the owner of this NFT');
        });

        it ("Should be able to get tokenURI", async function (){
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            expect (await ItemContract.connect (others).getURI (tokenId)).to.be.equal (tokenURI);
        });

        it ("Should be able to get owner", async function (){
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            expect (await ItemContract.connect (others).getSeller (tokenId)).to.be.equal (owner);
        });

        it ("Should fire ItemForSale event", async function (){
            const [owner] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            await expect (ItemContract.setSelling (tokenId, true))
                .to.emit (ItemContract, "ItemForSale")
                .withArgs (owner, tokenId, price);
        });

        it ("Should fire PriceUpdate event", async function (){
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 110;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            await expect (ItemContract.updatePrice (tokenId, 1234))
                .to.emit (ItemContract, "PriceUpdate")
                .withArgs (owner, tokenId, price , 1234);
        });
    });

    describe ("Selling NFTs", function () {
        it ("Should transfer money", async function (){
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 10;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            // NOTE that we use changeEtherBalances() instead of changeTokenBalances() to measure
            // the change in currency, whereas the change in token balance will always be -1/1 for the
            // buyer and seller. In practice, we use MATIC, not Ether, for transactions.
            await expect (() => ItemContract.connect (others).buy (tokenId, {value: 10}))
                .to.changeEtherBalances ([owner, others], [10, -10])
        });

        it ("Should transfer ownership", async function (){
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 1;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);
            await ItemContract.connect (others).buy (tokenId, {value: price});

            expect (await ItemContract.getSeller (tokenId)).to.be.equal (others);
        });

        it ("Selling should fire ItemSold event", async function (){
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 100;

            await ItemContract.safeMintWithPrice (others, tokenURI, price, false);
            await ItemContract.connect (others).setSelling (tokenId, true);

            await expect (ItemContract.connect (owner).buy (tokenId, {value: price}))
                .to.emit (ItemContract, "ItemSold")
                .withArgs (others, owner, tokenId, price);
        });

        it ("Should not be able to buy if the owner is not selling", async function (){
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 100;

            await ItemContract.safeMintWithPrice (others, tokenURI, price, false);

            await expect (ItemContract.connect (owner).buy (tokenId, {value: price}))
                .to.be.revertedWith ('Seller is not selling NFT.');
        });

        it ("Should not be able to buy if you're already the owner", async function () {
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 100;

            await ItemContract.safeMintWithPrice (others, tokenURI, price, true);

            await expect (ItemContract.connect (others).buy (tokenId, {value: price}))
                .to.be.revertedWith ('You already own this NFT.');
        });

        it ("Should not be able to buy if you're paying less than the owner lists", async function () {
            const [owner, others] = await ethers.getSigners ();
            const ItemContract = await ethers.deployContract ("Item", [owner, owner]);

            const tokenURI = "test_nft";
            const tokenId = await ItemContract.totalItems ();
            const price = 100;

            await ItemContract.safeMintWithPrice (owner, tokenURI, price, true);

            await expect (ItemContract.connect (others).buy (tokenId, {value: price - 1}))
                .to.be.revertedWith ('Paid less than the amount listed.');
        });
    });
});
