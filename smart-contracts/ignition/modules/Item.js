const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require ('dotenv').config ();


module.exports = buildModule("Item", (m) => {

    const item = m.contract("Item", [process.env.WALLET_ADDRESS_REAL, process.env.WALLET_ADDRESS_REAL], {
        from: process.env.WALLET_ADDRESS_REAL,
    });

    return { item };
});