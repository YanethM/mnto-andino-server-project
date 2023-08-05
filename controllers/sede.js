const Sede = require("../models/sede");
const Address = require("../models/address");
const mongoose = require("mongoose");
const session = mongoose.startSession();

const createSede = async (req, res) => {
  console.log("Request: Crear sede");
  try {
    const {
      nombre,
      nombre_contacto,
      telefono_contacto,
      email_contacto,
      direccion,
    } = req.body;

    // Crear la dirección primero
    const newAddress = new Address(direccion);
    const addressSaved = await newAddress.save();

    if (!addressSaved) {
      throw new Error("No se ha podido guardar la dirección.");
    }

    // Crear la sede con el _id de la dirección creada
    const sede = new Sede({
      nombre,
      nombre_contacto,
      telefono_contacto,
      email_contacto,
      direccion: addressSaved._id,
    });

    const sedeStored = await sede.save();
    if (!sedeStored) {
      throw new Error("No se ha podido guardar la sede.");
    }

    res.status(200).send({
      sede: sedeStored,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error en el servidor.",
    });
  }
};
const getAllSedes = async (req, res) => {
  try {
    const sedes = await Sede.find().populate("direccion");
    res.status(200).send({
      sedes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error en el servidor.",
    });
  }
};

const filterSedes = async (req, res) => {
  try {
    const parametro = req.params.parametro;
    const { nombre, departamento, municipio } = req.query;
    let query = {};

    if (nombre) {
      query.nombre = nombre;
    }

    if (departamento) {
      query.departamento = departamento;
    }

    if (municipio) {
      query.municipio = municipio;
    }
    /* El método populate("direccion") se utiliza para realizar una referencia a la colección "direccion" y 
    reemplazar el campo de referencia en cada documento con los datos completos de la dirección correspondiente.  */
    const sedes = await Sede.find(query).populate("direccion");
    res.status(200).send({
      sedes,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error en el servidor.",
    });
  }
};

const getSede = async (req, res) => {
  try {
    const sedeId = req.params.id;
    const sede = await Sede.findById(sedeId).populate("direccion");
    if (!sede) {
      return res.status(404).send({
        message: "Sede no encontrada.",
      });
    }
    res.status(200).send({
      sede,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error en el servidor.",
    });
  }
};

const searchSedes = async (req, res) => {
  try {
    const { nombre, departamento, municipio } = req.params;
    let query = {};

    if (nombre) {
      query.nombre = { $regex: nombre, $options: "i" };
    }

    if (departamento) {
      query.departamento = { $regex: departamento, $options: "i" };
    }

    if (municipio) {
      query.municipio = { $regex: municipio, $options: "i" };
    }

    const sedes = await Sede.find(query).populate("direccion");
    res.status(200).send({
      sedes,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error en el servidor.",
    });
  }
};

const filterSedesPerMunicipio = async (req, res) => {
  try {
    const municipio = req.query.municipio;
    /* Realizar la consulta en la base de datos buscando el nombre del municipio
     http://localhost:3200/api/v1/sedes/municipio?municipio=Pacoa */
    const sedes = await Sede.find({ municipio: municipio });
    // Obtener solo los nombres de las sedes
    const nombresSedes = sedes.map((sede) => sede.nombre);

    res.status(200).send({
      sedes: nombresSedes,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error en el servidor.",
    });
  }
};

const updateSede = async (req, res) => {
  try {
    const sedeId = req.params.id;
    const {
      nombre,
      nombre_contacto,
      direccion,
    } = req.body;

    // Aquí, asegúrate de que direccion sea un objeto que contenga todas las propiedades requeridas
    const updatedFields = {
      nombre,
      nombre_contacto,
      direccion: {
        ...direccion,
      },
    };

    const sede = await Sede.findByIdAndUpdate(sedeId, updatedFields, {
      new: true,
    }).populate("direccion");

    if (!sede) {
      return res.status(404).send({
        message: "Sede no encontrada.",
      });
    }

    res.status(200).send({
      sede,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error en el servidor.",
    });
  }
};

const deleteSede = async (req, res) => {
  try {
    const { id } = req.params;
    const sede = await Sede.findByIdAndDelete(id);

    if (!sede) {
      return res.status(404).send({
        message: "Sede no encontrada.",
      });
    }

    const direccion = await Address.findByIdAndDelete(sede.direccion);

    if (!direccion) {
      return res.status(404).send({
        message: "Dirección no encontrada.",
      });
    }

    res.status(200).send({
      message: "Sede eliminada correctamente.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error en el servidor.",
    });
  }
};

module.exports = {
  createSede,
  getSede,
  getAllSedes,
  filterSedes,
  searchSedes,
  updateSede,
  deleteSede,
  filterSedesPerMunicipio,
};
