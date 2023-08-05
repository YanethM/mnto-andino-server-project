const address = require("../models/address");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// Método para crear una nueva dirección
const createAddress = async (req, res) => {
  try {
    const addressData = req.body;
    console.log(addressData);
    const newAddress = new address(addressData);
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear la dirección", error });
  }
};

// Método para obtener todas las direcciones
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await address.find();
    res.status(200).json(addresses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las direcciones", error });
  }
};

// Método para obtener una dirección por su ID
const getAddressById = async (req, res) => {
  try {
    const addressId = req.params.id;

    if (!ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "ID de dirección inválido" });
    }

    const addressFind = await address.findById(addressId);

    if (!addressFind) {
      return res.status(404).json({ message: "No se encontró la dirección" });
    }

    res.status(200).json(addressFind);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener la dirección", error });
  }
};

const updateAddressById = async (req, res) => {
  try {
    const addressId = req.params.id;
    const updateData = req.body; // Debes asegurarte de que req.body contenga solo los campos que deseas actualizar
    const updatedAddress = await address.findByIdAndUpdate(
      addressId,
      updateData,
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ message: "No se encontró la dirección" });
    }
    res.status(200).json(updatedAddress);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la dirección", error });
  }
};


// Método para eliminar una dirección por su ID
const deleteAddressById = async (req, res) => {
  try {
    const addressId = req.params.id;
    const deletedAddress = await address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return res.status(404).json({ message: "No se encontró la dirección" });
    }
    res.status(200).json({ message: "Dirección eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la dirección", error });
  }
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddressById,
  deleteAddressById,
};
