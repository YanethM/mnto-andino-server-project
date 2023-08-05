const Post = require("../models/post");
const Categoria = require("../models/category");

const verificarCategorias = async (categorias) => {
  if (!categorias || !Array.isArray(categorias)) {
    throw new Error("Las categorías no son válidas.");
  }

  // Convertir los identificadores de categorías a objetos ObjectId
  const categoriasObjectId = categorias.map((id) => ObjectId(id));

  console.log("Categorias:", categoriasObjectId);
  const categoriasEncontradas = await Categoria.find({
    _id: { $in: categoriasObjectId },
  });
  console.log("Categorias Encontradas:", categoriasEncontradas);
  console.log("Categorias:", categoriasObjectId.length);
  // Verifica si todas las categorías proporcionadas existen en la base de datos
  if (categoriasEncontradas.length !== categoriasObjectId.length) {
    throw new Error("Alguna de las categorías proporcionadas no existe.");
  }
};

// Controlador en el servidor para crear una noticia
// Controlador en el servidor para crear una noticia
const crearNoticia = async (req, res) => {
  // Obtener los datos del payload
  const {
    titulo,
    subtitulo,
    descripcion,
    creador,
    fecha_creacion,
    imagenes,
    categorias,
  } = req.body;

  console.log("ids recibidos de categorías", categorias);
  // Verificar si las categorías son válidas
  if (!categorias || !Array.isArray(categorias)) {
    return res.status(400).json({ error: "Las categorías no son válidas." });
  }

  const categoriasValidas = await Categoria.find({ _id: { $in: categorias } });

  if (categoriasValidas.length !== categorias.length) {
    return res
      .status(400)
      .json({ error: "Alguna de las categorías proporcionadas no existe." });
  }

  // Si las categorías son válidas, procede a crear la noticia

  const nuevaNoticia = new Post({
    titulo,
    subtitulo,
    descripcion,
    creador,
    fecha_creacion,
    imagenes,
    categorias,
  });
  try {
    const noticiaGuardada = await nuevaNoticia.save();
    console.log("Datos noticia guardada", noticiaGuardada);
    res.status(201).json(noticiaGuardada); // Asegúrate de devolver los datos de la noticia guardada
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la noticia." });
  }
};

// Método para editar una noticia existente
const editarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, subtitulo, descripcion, imagenes, creador, categorias } =
      req.body;

    // Verifica las categorías antes de actualizar la noticia
    await verificarCategorias(categorias);

    const noticiaEditada = await Noticia.findByIdAndUpdate(
      id,
      { titulo, subtitulo, descripcion, imagenes, creador, categorias },
      { new: true }
    );
    if (!noticiaEditada) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }
    res.status(200).json(noticiaEditada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al editar la noticia" });
  }
};
// Método para consultar todas las noticias
const obtenerTodasNoticias = async (req, res) => {
  try {
    const noticias = await Post.find();
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
    const noticia = await Noticia.findById(id);
    if (!noticia) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }
    res.status(200).json(noticia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener la noticia" });
  }
};

// Método para eliminar una noticia por su ID
const eliminarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id a eliminar', id);
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
  crearNoticia,
  editarNoticia,
  obtenerTodasNoticias,
  obtenerNoticiaPorId,
  eliminarNoticia,
};
