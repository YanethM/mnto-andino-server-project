const Noticia = require('../models/noticia');

// Método para crear una nueva noticia
const crearNoticia = async (req, res) => {
  try {
    const { titulo, subtitulo, descripcion, imagenes, creador, categoria } = req.body;
    const nuevaNoticia = new Noticia({ titulo, subtitulo, descripcion, imagenes, creador, categoria });
    const noticiaGuardada = await nuevaNoticia.save();
    res.status(201).json(noticiaGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la noticia' });
  }
};

// Método para editar una noticia existente
const editarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, subtitulo, descripcion, imagenes, creador, categoria } = req.body;
    const noticiaEditada = await Noticia.findByIdAndUpdate(
      id,
      { titulo, subtitulo, descripcion, imagenes, creador, categoria },
      { new: true }
    );
    if (!noticiaEditada) {
      return res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }
    res.status(200).json(noticiaEditada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al editar la noticia' });
  }
};

// Método para consultar todas las noticias
const obtenerTodasNoticias = async (req, res) => {
  try {
    const noticias = await Noticia.find();
    res.status(200).json(noticias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las noticias' });
  }
};

// Método para consultar una noticia específica por su ID
const obtenerNoticiaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticia.findById(id);
    if (!noticia) {
      return res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }
    res.status(200).json(noticia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la noticia' });
  }
};

// Método para eliminar una noticia por su ID
const eliminarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const noticiaEliminada = await Noticia.findByIdAndRemove(id);
    if (!noticiaEliminada) {
      return res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }
    res.status(200).json({ mensaje: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar la noticia' });
  }
};

module.exports = {
  crearNoticia,
  editarNoticia,
  obtenerTodasNoticias,
  obtenerNoticiaPorId,
  eliminarNoticia,
};
