///Tr3x////////////////////////////////////////////////////////////////////////
//   __________ ______  __
//  /_  __/ __ \__  / |/ /
//   / / / /_/ //_ <|   /
//  / / / _, _/__/ /   |
// /_/ /_/ |_/____/_/|_|
///////////////////////////////////////////////////////////////////////////////

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import "./ERC1155MixedFungible.sol";
import "./Address.sol";

/**
    @dev Custom ERC1155 incorporating all tr3x logic.
*/
contract Tr3xV0 is ERC1155MixedFungible {
    using SafeMath for uint256;
    using Address for address;

    struct CidId {
        string cid;
        uint256 id;
    }

    uint256 nonce;
    uint256 constant TR3X = 1;
    address owner;
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public prices;
    mapping(uint256 => bool) public disabled;
    CidId[] public all;

    modifier creatorOnly(uint256 _id) {
        require(creators[_id] == msg.sender, "creator only access");
        _;
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "owner only access");
        _;
    }

    modifier purchasableOnly(uint256 _type) {
        require(!disabled[_type], "disabled offering");
        _;
    }

    /**
        @dev MUST emit when a license token's is purchasability is disabled or reenabled (absense of an event assumes enabled).
    */
    event Purchasability(uint256 _type, bool _purchasable);

    /**
     * @notice Lists current license token offers. Excluding acquired exclusives.
     * @return An array of cid-id tuples.
     */
    function currentOffers() public view returns (CidId[] memory) {
        uint256 sum_ = 0;

        // reducin to the held by sum
        for (uint256 i = 0; i < all.length; i++) {
            uint256 id = all[i].id;

            if (!disabled[id] && nfOwners[id] == address(0x0)) {
                // _who holds an exclusive or a lease
                sum_ += 1;
            }
        }

        CidId[] memory offers_ = new CidId[](sum_);

        uint256 j = 0;

        // stitchin together the listin
        for (uint256 i = 0; i < all.length; i++) {
            uint256 id = all[i].id;

            if (!disabled[id] && nfOwners[id] == address(0x0)) {
                offers_[j] = all[i];
                j++;
            }
        }

        return offers_;
    }

    /**
     * @notice Lists the licenses held by given address.
     * @return An array of cid-id tuples.
     */
    function licensesHeldBy(address _who) public view returns (CidId[] memory) {
        uint256 sum_ = 0;

        // reducin to the held by sum
        for (uint256 i = 0; i < all.length; i++) {
            uint256 id = all[i].id;

            if (nfOwners[id] == _who || (balances[id][_who] > 0)) {
                // _who holds the exclusive or a lease
                sum_ += 1;
            }
        }

        CidId[] memory held_ = new CidId[](sum_);

        uint256 j = 0;

        // stitchin together the listin
        for (uint256 i = 0; i < all.length; i++) {
            uint256 id = all[i].id;

            if (nfOwners[id] == _who || balances[id][_who] > 0) {
                held_[j] = all[i];
                j++;
            }
        }

        return held_;
    }

    /**
     * @notice Instantiates the tr3x contract.
     * Creates the native fungible token of _type 1.
     */
    constructor() {
        owner = msg.sender;

        // Creatin the native fungible token _type == 1.
        uint256 _type = (++nonce << 128);

        // Restrict native token admin to owner.
        creators[_type] = owner;
    }

    /**
     * @notice Mints fungible native tokens. Only available to the owner.
     * @param _to Recipients that will receive TR3X as specified in _quantities.
     * @param _quantities Item quantities to transfer to each corresponding recipient.
     * TODO: emit TransferBatch instead of multi TransferSingle ???
     */
    function mintNative(address[] calldata _to, uint256[] calldata _quantities)
        external
        ownerOnly()
    {
        for (uint256 i = 0; i < _to.length; ++i) {
            address to = _to[i];
            uint256 quantity = _quantities[i];

            // Grant the tokens to the caller
            balances[TR3X][to] = balances[TR3X][to].add(quantity);

            // Emit the Transfer/Mint event - the 0x0 source address implies a mint
            emit TransferSingle(owner, address(0x0), to, TR3X, quantity);

            if (to.isContract()) {
                _doSafeTransferAcceptanceCheck(
                    owner,
                    owner,
                    to,
                    TR3X,
                    quantity,
                    ""
                );
            }
        }
    }

    /**
     * @notice Creates a new (non-)fungible token type.
     * @param _uri Content identifier of the metadata JSON doc stored on IPFS.
     * @param _price Minimum price as STYC amount.
     * @param _isNF Whether the token is non-fungible aka an exclusive.
     */
    function create(
        string calldata _uri,
        uint256 _price,
        bool _isNF
    ) external {
        // Store the type in the upper 128 bits
        uint256 _type = (++nonce << 128);

        // Set a flag if this is an NFI.
        if (_isNF) {
            _type = _type | TYPE_NF_BIT;
        }

        // This will allow restricted access to creators.
        creators[_type] = msg.sender;

        // Settin the minimum SLYC price for this piece of art.
        prices[_type] = _price;

        // Storin the token in the contract's global list
        all.push(CidId({cid: _uri, id: _type}));

        // Emit a Transfer event with Create semantic to help with discovery.
        emit TransferSingle(msg.sender, address(0x0), address(0x0), _type, 0);

        if (bytes(_uri).length > 0) {
            emit URI(_uri, _type);
        }
    }

    /**
     * @dev Follows ERC-1155's Safe Transfer Rules except for the approval part.
     * Rationale is that the balance transfer is implicitely approved by
     * the simple means of having signed the purchase transaction.
     * @notice Purchases an item (lease or exclusive) from a creator.
     * @param _type Item identifier. May be a base type or an actual _id.
     * @param _price STYC price being paid.
     */
    function purchase(uint256 _type, uint256 _price)
        external
        purchasableOnly(_type)
    {
        // Makin sure the license token actually exists
        require(creators[_type] != address(0x0), "token does not exist");

        // Makin sure the purchaser is payin the minimum price at least.
        require(_price >= prices[_type], "price too low");

        // Makin sure the purchaser has sufficient TR3X balance.
        require(_price <= balances[1][msg.sender], "isufficient balance");

        // If we regard this an exclusive right
        if (isNonFungible(_type)) {
            // The token must not yet have an owner.
            require(nfOwners[_type] == address(0x0), "already acquired");
        }

        // Withdrawal
        balances[TR3X][msg.sender] = balances[TR3X][msg.sender].sub(_price);

        // Credit
        balances[TR3X][creators[_type]] = balances[TR3X][creators[_type]].add(
            _price
        );

        // Emit the Transfer event for the TR3X payment.
        emit TransferSingle(
            address(this),
            msg.sender,
            creators[_type],
            TR3X,
            _price
        );

        if (creators[_type].isContract()) {
            _doSafeTransferAcceptanceCheck(
                address(this),
                msg.sender,
                creators[_type],
                TR3X,
                _price,
                ""
            );
        }

        // Transferin the license token.
        balances[_type][msg.sender] = balances[_type][msg.sender].add(1);

        // Separately storing exclusive license token ownerships.
        if (isNonFungible(_type)) {
            nfOwners[_type] = msg.sender;
        }

        // Emit the Transfer/Mint event for the license token.
        // The zero address implies a mint.
        emit TransferSingle(address(this), address(0x0), msg.sender, _type, 1);

        if (msg.sender.isContract()) {
            _doSafeTransferAcceptanceCheck(
                address(this),
                address(0x0),
                msg.sender,
                _type,
                1,
                ""
            );
        }
    }

    /**
     * @notice Disables an offer so that the corresponding item can not be purchased.
     * @param _type Item identifier. May be a base type or an actual _id.
     */
    function disable(uint256 _type) external creatorOnly(_type) {
        disabled[_type] = true;

        emit Purchasability(_type, false);
    }

    /**
     * @notice Eenables an offer so that the corresponding item can be purchased again.
     * @param _type Item identifier. May be a base type or an actual _id.
     */
    function enable(uint256 _type) external creatorOnly(_type) {
        disabled[_type] = false;

        emit Purchasability(_type, true);
    }
}
