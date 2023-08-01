const Menu = require("../models/menu");

const createMenu = async (req, res) => {
  try {
    const menuData = req.body;
    if (!menuData.title || !menuData.path) {
      return res
        .status(400)
        .send({ msg: "El título y la ruta son campos obligatorios" });
    }
    const menu = new Menu(menuData);
    const menuStored = await menu.save();
    res.status(201).send(menuStored);
  } catch (error) {
    // Manejar errores específicos si es necesario
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ msg: "Error de validación: " + error.message });
    }
    res.status(500).send({ msg: "Error del servidor" });
  }
};

const getMenu = async (req, res) => {
  const { active } = req.query;
  let response = null;
  try {
    const filter = active ? { active } : {};
    response = await Menu.find(filter).sort({ order: "asc" });
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

const updateMenu = async (req, res) => {
  const menuData = req.body;
  const { id } = req.params;
  try {
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).send({ msg: "Menú no encontrado" });
    }

    // Verificar si el usuario no ingresó título ni ruta
    if (!menuData.title && !menuData.path) {
      // Mantener los valores anteriores
      menuData.title = menu.title;
      menuData.path = menu.path;
    }

    const updatedMenu = await Menu.findByIdAndUpdate(id, menuData, {
      new: true,
    });
    res.status(200).send(updatedMenu);
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

const deleteMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMenu = await Menu.findByIdAndRemove(id);
    if (!deletedMenu) {
      return res.status(404).send({ msg: "Menú no encontrado" });
    }
    res.status(200).send(deletedMenu);
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};


module.exports = {
  createMenu,
  getMenu,
  updateMenu,
  deleteMenu
};
