// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Item is ERC721, ERC721URIStorage, AccessControl {
    /**
     * Attributes.
     */
    bytes32 public constant MINTER_ROLE = keccak256 ("MINTER_ROLE");
    uint256 private _nextTokenId;


    /**
     * Constructor.
     */
    constructor (address defaultAdmin, address minter) ERC721 ("Item", "ITM") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
    }


    /**
     * Events.
     */
    event NewItem (address sender, uint256 tokenId);


    /**
     * Methods.
     */
    function totalItems () public view virtual returns (uint256) {
        return _nextTokenId;
    }

    // TODO: add name metadata for the NFT?
    function safeMint (address to, string memory uri) public onlyRole (MINTER_ROLE) {
        uint256 tokenId = _nextTokenId++;   // Note that the order is (1) tokenId=_nextTokenId, (2) increment
        _safeMint (to, tokenId);
        _setTokenURI (tokenId, uri);
        emit NewItem (to, tokenId);
    }

    // Only the admin can grant users access to minting.
    function grantMintRole (address newMinter) public onlyRole (DEFAULT_ADMIN_ROLE) {
        grantRole (MINTER_ROLE, newMinter);
    }

    // Returns a boolean of if the user can mint or not.
    function canMint () public view returns (bool) {
        return (hasRole (MINTER_ROLE, msg.sender) == true);
    }


    /**
     * Solidity-Required Overrides.
     */
    function tokenURI (uint256 tokenId)
    public
    view
    override (ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface (bytes4 interfaceId)
    public
    view
    override (ERC721, ERC721URIStorage, AccessControl)
    returns (bool)
    {
        return super.supportsInterface (interfaceId);
    }
}
