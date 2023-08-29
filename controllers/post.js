const Post = require("../models/post");
const Categoria = require("../models/category");
const image = require("../utils/image");

const createNew = async (req, res) => {
  try {
    const { categorias, ...postData } = req.body;
    console.log("Datos de la noticia a crear:", postData);
    console.log(req.files.imagenes);
    // Procesar las imágenes si se proporcionan
    if (req.files.imagenes && Array.isArray(req.files.imagenes)) {
      const processedImages = req.files.imagenes.map((imagen) => {
        const imagePath = imagen.path; // Aquí usamos el path de la imagen directamente
        return {
          url: image.getImageUrl(imagePath),
          descripcion: imagen.originalFilename, // Puedes ajustar esto según tu lógica
        };
      });
      postData.imagenes = processedImages;
    }

    const newPost = new Post({ ...postData });
    const postStored = await newPost.save();
    res.status(201).json({
      _id: postStored._id,
      titulo: postStored.titulo,
      subtitulo: postStored.subtitulo,
      descripcion: postStored.descripcion,
      creador: postStored.creador,
      imagenes: postStored.imagenes,
      fecha_creacion: postStored.fecha_creacion,
      active: postStored.active,
      categorias: postStored.categorias,
    });
    console.log(postStored);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Error al crear la publicación" });
  }
};

const getAllNews = async (req, res) => {
  try {
    const news = await Post.find();
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las publicaciones" });
  }
};
// Método para editar una noticia existente
const editarNoticia = async (req, res) => {
  console.log("Editar noticia", req.params);
  const { id } = req.params;
  const postData = req.body;
  console.log(`id: ${id}`);
  console.log("Datos de la categoría a actualizar:", postData);
  try {
    await Post.findByIdAndUpdate({ _id: id }, postData);
    const updatedPost = await Post.findOne({ _id: id });
    res.status(200).send(updatedPost); // Enviar el menú actualizado como respuesta
  } catch (error) {
    res.status(400).send({ msg: "Error al actualizar la noticia" });
  }
};

// Método para consultar todas las noticias
const obtenerTodasNoticias = async (req, res) => {
  try {
    const noticias = await Post.find();
    console.log("Noticias desde controller", noticias);
    res.status(200).json(noticias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las noticias" });
  }
};

// Método para consultar una noticia específica por su ID
const obtenerNoticiaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Post.findById(id);
    if (!noticia) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }
    res.status(200).json(noticia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener la noticia" });
  }
};

// Función para obtener los posts asociados con una categoría
const getPostsAssociatedWithCategory = async (categoryId) => {
  try {
    const posts = await Post.find({ categorias: categoryId });
    console.log(posts);
    return posts;
  } catch (error) {
    console.error("Error al obtener los posts asociados:", error);
    throw error;
  }
};

// Método para eliminar una noticia por su ID
const eliminarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id a eliminar", id);
    const noticiaEliminada = await Post.findByIdAndDelete(id);
    if (!noticiaEliminada) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }
    res.status(200).json({ mensaje: "Noticia eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar la noticia" });
  }
};

module.exports = {
  createNew,
  getAllNews,
  editarNoticia,
  obtenerTodasNoticias,
  obtenerNoticiaPorId,
  eliminarNoticia,
  getPostsAssociatedWithCategory,
};
