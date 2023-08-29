const Menu = require("../models/menu");

async function createMenu(req, res) {
  try {
    const menu = new Menu({...req.body});
    const menuStored = await menu.save();
    res.status(201).send(menuStored);
  } catch (error) {
    res.status(400).send({ msg: "Error al crear el menú" });
  }
}

async function getMenus(req, res) {
  console.log("Estoy en el listar menus");
  try {
    const { active } = req.query;
    let response = null;

    if (active === undefined) {
      response = await Menu.find();
    } else {
      response = await Menu.find({ active });
    }

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
}

async function updateMenu(req, res) {
  const { id } = req.params;
  const menuData = req.body;

  try {
    await Menu.findByIdAndUpdate({ _id: id }, menuData);
    
    // Buscar el menú actualizado después de la actualización
    const updatedMenu = await Menu.findOne({ _id: id });
    res.status(200).send(updatedMenu); // Enviar el menú actualizado como respuesta
  } catch (error) {
    res.status(400).send({ msg: "Error al actualizar el menú" });
  }
}


async function deleteMenu(req, res) {
  const { id } = req.params;

  try {
    await Menu.findByIdAndDelete(id);
    res.status(200).send({ msg: "Menú eliminado" });
  } catch (error) {
    res.status(400).send({ msg: "Error al eliminar el menú" });
  }
}

module.exports = {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
};
