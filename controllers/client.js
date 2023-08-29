// clientController.js

const Client = require("../models/client");

// Crear un nuevo cliente
exports.createClient = async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el cliente" });
  }
};

// Obtener todos los clientes
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
};

// Eliminar un cliente por ID
exports.deleteClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClient = await Client.findByIdAndDelete(id);
    if (deletedClient) {
      res.json({ message: "Cliente eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};

// Obtener un cliente por ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
};

// Actualizar un cliente por ID
exports.updateClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClient = await Client.findByIdAndUpdate(id, req.body, {
      new: true, // Devuelve el cliente actualizado en la respuesta
    });

    if (updatedClient) {
      res.json(updatedClient);
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};
