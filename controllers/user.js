const bcrypt = require("bcryptjs");
const User = require("../models/user");
const image = require("../utils/image");

// Obtener datos del usuario autenticado
async function getMe(req, res) {
  console.log("Estoy en getMe");
  try {
    const { user_id } = req.user; // Obtener el ID de usuario desde el token de acceso
    const response = await User.findById(user_id);

    if (!response) {
      return res.status(400).send({ msg: "No se ha encontrado usuario" });
    }

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;

    const response = await User.findById(id);
    console.log('respuesta',response);
    if (!response) {
      return res.status(400).send({ msg: "No se ha encontrado usuario" });
    }

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
}
// Actualizar datos del usuario autenticado
async function updateMe(req, res) {
  try {
    const { user_id } = req.user; // Obtener el ID de usuario desde el token de acceso
    const userData = req.body;
    let imagePath = null;
    if (userData.current_password) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(userData.current_password, salt);
      userData.current_password = hashPassword;
    } else {
      delete userData.current_password;
    }

    if (req.files.avatar) {
      imagePath = image.getFilePath(req.files.avatar);
      userData.avatar = imagePath;
    }
    await User.findByIdAndUpdate(user_id, userData);
    res.status(200).send({ msg: "Actualización correcta", avatar: imagePath });
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "Error al actualizar el usuario" });
  }
}

// Obtener lista de usuarios
async function getUsers(req, res) {
  console.log("Estoy en el listar usuarios");
  try {
    const { active } = req.query;
    let response = null;

    if (active === undefined) {
      response = await User.find();
    } else {
      response = await User.find({ active });
    }

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
}

// Crear un nuevo usuario
async function createUser(req, res) {
  try {
    const { current_password } = req.body;
    const user = new User({ ...req.body, active: false });

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(current_password, salt);
    user.current_password = hashPassword;

    if (req.files.avatar) {
      const imagePath = image.getFilePath(req.files.avatar);
      user.avatar = imagePath;
    }
    const userStored = await user.save();
    res.status(201).send(userStored);
    console.log(userStored);
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "Error al crear el usuario" });
  }
}

// Actualizar un usuario existente
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const userData = req.body;

    if (userData.password) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(userData.password, salt);
      userData.password = hashPassword;
    } else {
      delete userData.password;
    }

    if (req.files.avatar) {
      const imagePath = image.getFilePath(req.files.avatar);
      userData.avatar = imagePath;
    }

    await User.findByIdAndUpdate(id, userData);
    res.status(200).send({ msg: "Actualización correcta" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "Error al actualizar el usuario" });
  }
}

// Eliminar un usuario
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    res.status(200).send({ msg: "Usuario eliminado" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "Error al eliminar el usuario" });
  }
}

module.exports = {
  getMe,
  updateMe,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
