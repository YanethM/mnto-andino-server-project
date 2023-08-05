const express = require("express");
const AddressController = require("../controllers/address");

const api = express.Router();


api.post("/address", AddressController.createAddress);
api.get("/", AddressController.getAllAddresses);
api.put("/:id", AddressController.updateAddressById);
api.delete("/:id", AddressController.deleteAddressById);
api.get("/:id", AddressController.getAddressById);

module.exports = api;
