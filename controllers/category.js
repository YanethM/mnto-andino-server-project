const Category = require("../models/category");
const image = require("../utils/image");

// Método para crear una nueva categoría
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, foto } = req.body;
    const nuevaCategoria = new Category({
      nombre,
      descripcion,
      foto,
      active: true,
    });

    if (req.files.foto) {
      const imagePath = image.getFilePath(req.files.foto);
      nuevaCategoria.foto = imagePath;
    }

    const categoriaGuardada = await nuevaCategoria.save();
    console.log(categoriaGuardada);
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear la categoría" });
  }
};

// Método para editar una categoría existente
const editarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, foto } = req.body;
    let imagePath = null;
    if (req.files.foto) {
      const imagePath = image.getFilePath(req.files.foto);
      nuevaCategoria.foto = imagePath;
    }
    const categoriaEditada = await Category.findByIdAndUpdate(
      id,
      { nombre, descripcion, foto, active },
      { new: true }
    );
    if (!categoriaEditada) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }
    res.status(200).json(categoriaEditada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al editar la categoría" });
  }
};

// Método para consultar todas las categorías
const obtenerTodasCategorias = async (req, res) => {
  try {
    const categorias = await Category.find();
    res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las categorías" });
  }
};

// Método para consultar una categoría específica por su ID
const obtenerCategoriaPorId = async (req, res) => {
  try {
    const { idCategory } = req.params; // Cambio aquí para que coincida con la ruta
    const categoria = await Category.findById(idCategory);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }
    res.status(200).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener la categoría" });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const { idCategory } = req.params; // Cambio aquí para que coincida con la ruta
    console.log(`/api/v1/admin/categories/${idCategory}`); // Reemplaza API_VERSION por la versión correcta

    const categoriaEliminada = await Category.findByIdAndDelete(idCategory);
    if (!categoriaEliminada) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }
    res.status(200).json(categoriaEliminada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar la categoría" });
  }
};

module.exports = {
  crearCategoria,
  editarCategoria,
  obtenerTodasCategorias,
  obtenerCategoriaPorId,
  eliminarCategoria,
};
