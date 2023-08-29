const Category = require("../models/category");
const Post = require("../models/post");

// Método para crear una nueva categoría
const crearCategoria = async (req, res) => {
  try {
    const { nombre, active } = req.body;
    const nuevaCategoria = new Category({
      nombre,
      active,
    });
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
  console.log("Editar categoría", req.params);
  const { idCategory } = req.params;
  const categoryData = req.body;
  console.log(`id: ${idCategory}`);
  console.log("Datos de la categoría a actualizar:", categoryData);
  try {
    await Category.findByIdAndUpdate({ _id: idCategory }, categoryData);
    const updatedCategory = await Category.findOne({ _id: idCategory });
    res.status(200).send(updatedCategory); // Enviar el menú actualizado como respuesta
  } catch (error) {
    res.status(400).send({ msg: "Error al actualizar la categoría" });
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
    // Buscar los posts que pertenecen solo a la categoría eliminada
    const postsAEliminar = await Post.find({ categorias: idCategory });
    // Recorrer los posts y decidir si eliminar o quitar la categoría
    for (const post of postsAEliminar) {
      if (post.categorias.length === 1) {
        await Post.findByIdAndDelete(post._id);
      } else {
        post.categorias.pull(idCategory);
        await post.save();
      }
    }
    res.status(200).json(categoriaEliminada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar la categoría" });
  }
};

const updatePostsEstadoMostrar = async (categoryId, mostrarState) => {
  try {
    const postsToUpdate = await Post.find({ categorias: categoryId });
    console.log("Post to update backend", postsToUpdate);
    for (const post of postsToUpdate) {
      post.mostrar = mostrarState;
      await post.save();
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error al actualizar el estado mostrar de los posts");
  }
};

module.exports = {
  crearCategoria,
  editarCategoria,
  obtenerTodasCategorias,
  obtenerCategoriaPorId,
  eliminarCategoria,
  updatePostsEstadoMostrar,
};
