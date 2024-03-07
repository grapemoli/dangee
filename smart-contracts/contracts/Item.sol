// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract Item is ERC721, ERC721URIStorage, AccessControl {
    /****************
     * Attributes.
     ****************/
    bytes32 public constant MINTER_ROLE = keccak256 ("MINTER_ROLE");
    uint256 private _nextTokenId;

    // This struct is used to hold important NFT metadata needed for selling and
    // purchasing NFTs.
    struct Listing {
        string tokenURI;            // NFT token URI.
        address payable seller;     // User selling (or owning) the NFT.
        uint256 price;              // NFT price.
        bool selling;               // Check if the user wants this for sale.
    }

    mapping (uint256 => Listing) private _listingMap;         // tokenId => Listing



    /****************
     * Constructor.
     ****************/
    constructor (address defaultAdmin, address minter) ERC721 ("Item", "ITM") {
        _grantRole (DEFAULT_ADMIN_ROLE, defaultAdmin);   // i.e., contract owner.
        _grantRole (MINTER_ROLE, minter);                // i.e., platform users.
    }



    /****************
     * Events.
     ****************/
    // This event fires when an item has been minted successfully, called after the safeMint()
    // method has finished.
    event NewItem (address sender, uint256 tokenId, uint256 price);
    event PriceUpdate (address owner, uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice);
    event ItemForSale (address seller, uint256 indexed tokenId, uint256 price);
    event ItemSold (address seller, address buyer, uint256 indexed tokenId, uint256 price);



    /****************
     * Methods.
     ****************/
    // **** GETTERS / SETTERS **** //
    // Since _nextTokenId will always be one greater than the most-recently created tokenId,
    // _nextTokenId also doubles as the total number of items minted.
    function totalItems () public view virtual returns (uint256) {
        return _nextTokenId;
    }

    function getPrice (uint256 tokenId) public view virtual returns (uint256) {
        return _listingMap [tokenId].price;
    }

    function getURI (uint256 tokenId) public view virtual returns (string memory) {
        return _listingMap [tokenId].tokenURI;
    }

    function getSeller (uint256 tokenId) public view virtual returns (address) {
        return _listingMap [tokenId].seller;
    }

    function isSelling (uint256 tokenId) public view virtual returns (bool) {
        return _listingMap [tokenId].selling;
    }

    // Set the parameter-related NFT's price. Only the NFT owner or admin can update the price.
    function updatePrice (uint256 tokenId, uint256 newPrice) public {
        require (msg.sender == ownerOf (tokenId) || hasRole (DEFAULT_ADMIN_ROLE, msg.sender), "You are not the owner of this NFT");
        require (newPrice > 0, "Please set a price greater than 0.");

        uint256 oldPrice = _listingMap [tokenId].price;
        _listingMap [tokenId].price = newPrice;

        emit PriceUpdate (payable (msg.sender), tokenId, oldPrice, newPrice);
    }

    // Allow or disallow the NFT being sold on the marketplace.
    function setSelling (uint tokenId, bool _sell) public {
        // Only the owner can allow the NFT to be sold.
        require (msg.sender == ownerOf (tokenId), "You are not the owner of this NFT.");
        _listingMap [tokenId].selling = _sell;

        if (_sell == true) {
            emit ItemForSale (msg.sender, tokenId, _listingMap [tokenId].price);
        }
    }


    // **** MINTING **** //
    // Mints the NFT to an address with the passed URI. Since the URI is stored as the
    // NFTs metadata on the blockchain, we store the IPFS hash relating to the NFT.
    function safeMint (address to, string memory uri) public onlyRole (MINTER_ROLE) {
        // Before minting, that we don't already have the max number of NFTs on the platform.
        require (_nextTokenId <  (2^256 - 1), 'Reached max number of NFTs');

        uint256 tokenId = _nextTokenId++;   // Note that the order is (1) tokenId=_nextTokenId, (2) increment
        _safeMint (to, tokenId);
        _setTokenURI (tokenId, uri);

        // Set the mappings. By default, the price is 0. Note that the NFT is automatically
        // placed on the market to sell.
        _listingMap [tokenId] = Listing (uri, payable (to), 0, true);

        emit NewItem (to, tokenId, 0);
    }

    // @override safeMint () to allow the caller to include the price of the NFT being minted.
    function safeMintWithPrice (address to, string memory uri, uint256 price) public onlyRole (MINTER_ROLE) {
        // Before minting, that we don't already have the max number of NFTs on the platform.
        require (_nextTokenId <  (2^256 - 1), 'Reached max number of NFTs.');
        require (price > 0, 'Price should be greater than 0.');

        uint256 tokenId = _nextTokenId++;   // Note that the order is (1) tokenId=_nextTokenId, (2) increment
        _safeMint (to, tokenId);
        _setTokenURI (tokenId, uri);

        // Set the mappings. Note that the NFT is automatic set to be listed on the
        // marketplace.
        _listingMap [tokenId] = Listing (uri, payable (to), price, true);

        emit NewItem (to, tokenId, 0);
    }


    // **** SELLING / PAYING / TRANSFERRING OWNERSHIP **** //
    // This function "sells" the NFT from the seller to the buyer (the person calling this
    // function). "Selling" means that seller gets the funds from the buyer, and then the
    // ownership is transferred to the buyer.
    function buy (uint256 tokenId) public payable {
        // The buyer must send at least the amount that the seller is asking for.
        require (_listingMap [tokenId].selling == true, "Seller is not selling NFT.");
        require (msg.value >= _listingMap [tokenId].price, "Paid less than the amount listed.");
        require (msg.sender != ownerOf (tokenId), "You already own this NFT.");

        uint256 price = _listingMap [tokenId].price;
        address seller = _listingMap [tokenId].seller;

        // Send the seller the money, then transfer ownership. Update listing.
        payable (seller).transfer (msg.value);
        _safeTransfer (seller, msg.sender, tokenId);
        _listingMap [tokenId].seller = payable (msg.sender);

        emit ItemSold (seller, msg.sender, tokenId, price);
    }


    // **** ADMIN / ROLE-RELATED **** //
    // Only the admin can grant users access to minting.
    function grantMintRole (address newMinter) public onlyRole (DEFAULT_ADMIN_ROLE) {
        grantRole (MINTER_ROLE, newMinter);
    }

    // Returns a boolean of if the user can mint or not.
    function canMint () public view returns (bool) {
        return (hasRole (MINTER_ROLE, msg.sender) == true);
    }



    /****************
     * Solidity-Required Overrides.
     ****************/
    function tokenURI (uint256 tokenId) public view
    override (ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface (bytes4 interfaceId) public view
    override (ERC721, ERC721URIStorage, AccessControl)
    returns (bool)
    {
        return super.supportsInterface (interfaceId);
    }
}
