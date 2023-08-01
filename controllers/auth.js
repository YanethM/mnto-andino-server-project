const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const nodemailer = require("nodemailer");
const { v4: uuid } = require("uuid");

const register = async (req, res) => {
  console.log(req.body);
  const { firstname, lastname, email, current_password } = req.body;

  try {
    // Validar campos requeridos
    if (!email) {
      return res.status(400).send({ msg: "El email es requerido" });
    }
    if (!current_password) {
      return res.status(400).send({ msg: "La contraseña es requerida" });
    }

    // Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(current_password, salt);
    // Crear un nuevo usuario con los datos obtenidos de la API y la información del formulario
    const newUser = new User({
      firstname,
      lastname,
      email: email.toLowerCase(),
      role: "user",
      active: false,
      current_password: hash_password,
    });

    // Guardar el nuevo usuario en la base de datos
    const userStorage = await newUser.save();
    console.log(userStorage);
    res.status(201).send(userStorage);
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(400).send({ msg: "Error al crear el usuario" });
  }
};

/* Función que permite iniciar sesión */
const login = async (req, res) => {
  const { email, current_password } = req.body;
  console.log(req.body);
  try {
    if (!email || !current_password) {
      throw new Error("El email y la contraseña son obligatorios");
      console.log("no recibe datos");
    }
    const emailLowerCase = email.toLowerCase();
    const userStore = await User.findOne({ email: emailLowerCase }).exec();
    if (!userStore) {
      throw new Error("El usuario no existe");
    }
    const check = await bcrypt.compare(
      current_password,
      userStore.current_password
    );
    if (!check) {
      throw new Error("Contraseña incorrecta");
    }
    if (!userStore.active) {
      throw new Error("Usuario no autorizado o no activo");
    }
    res.status(200).send({
      access: jwt.createAccessToken(userStore),
      refresh: jwt.createRefreshToken(userStore),
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
    console.log();
  }
};

const changePassword = async (req, res) => {
  console.log("Selecciono cambiar contraseña");
  const { email, current_password, new_password } = req.body;
  try {
    if (!email) {
      return res.status(400).send({ msg: "El email es requerido" });
    }
    if (!current_password) {
      return res.status(400).send({ msg: "La contraseña actual es requerida" });
    }
    if (!new_password) {
      return res.status(400).send({ msg: "La nueva contraseña es requerida" });
    }
    // Buscar el usuario por su correo electrónico
    const user = await User.findOne({ email: email.toLowerCase() }).exec();
    if (!user) {
      return res.status(404).send({ msg: "El usuario no existe" });
    }
    // Verificar que la contraseña actual sea correcta
    const passwordMatch = await bcrypt.compare(
      current_password,
      user.current_password
    );
    if (!passwordMatch) {
      return res
        .status(401)
        .send({ msg: "La contraseña actual es incorrecta" });
    }
    // Generar hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(new_password, salt);
    // Actualizar la contraseña del usuario en la base de datos
    user.current_password = hashPassword;
    await user.save();
    res.status(200).send({ msg: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(400).send({ msg: "Error al cambiar la contraseña" });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).send({ msg: "Token requerido" });
    }
    const { user_id } = jwt.verify(token); 
    console.log(user_id);
    const userStorage = await User.findOne({ _id: user_id });
    // Generar un nuevo token de acceso
    const accessToken = jwt.createAccessToken(userStorage);
    // Enviar la respuesta con el nuevo token de acceso
    return res.status(200).send({ accessToken });
  } catch (error) {
    console.error("Error del servidor:", error);
    return res.status(500).send({ msg: "Error del servidor" });
  }
};


const passwordRecovery = async (req, res) => {
  const { email } = req.body;
  // Validar que se proporcionó un correo electrónico
  if (!email) {
    return res.status(400).send({ msg: "El correo electrónico es requerido" });
  }

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ msg: "El usuario no existe" });
    }

    // Generar un identificador único para la solicitud de recuperación
    const recoveryId = uuid();

    // Establecer la fecha de expiración del enlace de recuperación (1 hora)
    const expirationDate = Date.now() + 3600000;

    // Guardar el identificador y la fecha de expiración en el documento del usuario
    user.resetPasswordId = recoveryId;
    user.resetPasswordExpiration = expirationDate;
    await user.save();

    // Enviar el correo electrónico con el enlace de recuperación
    const transporter = nodemailer.createTransport({
      // Configurar el transporte de correo electrónico (SMTP, Gmail, etc.)
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "yaneth.mejiar@autonoma.edu.co",
        pass: "eugzrozbxjvioigd",
      },
      // Consulta la documentación de Nodemailer para más detalles
    });

    const mailOptions = {
      from: "yaneth.mejiar@autonoma.edu.co",
      to: user.email,
      subject: "Recuperación de contraseña",
      /*  text: `Para recuperar tu contraseña, haz clic en el siguiente enlace antes del ${new Date(
        expirationDate
      ).toLocaleString()}: ${
        req.headers.origin
      }/api/v1/auth/change-password/${recoveryId}`, */
      html: `
    <h1>Recuperación de contraseña</h1>
    <p>Para recuperar tu contraseña, haz clic en el siguiente enlace antes del ${new Date(
      expirationDate
    ).toLocaleString()}:</p>
    <p><a href="${
      req.headers.origin
    }/api/v1/auth/change-password/${recoveryId}">${
        req.headers.origin
      }/api/v1/auth/change-password/${recoveryId}</a></p>
    <img src="../assets/logo.png" alt="Imagen" style="width: 200px;">
    <div style="background-color: #f1f1f1; padding: 20px; border-radius: 5px;">
      <h2>¡Importante!</h2>
      <p>Recuerda mantener segura tu contraseña y no compartirla con nadie.</p>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo electrónico:", error);
        return res
          .status(500)
          .send({ msg: "Error al enviar el correo electrónico" });
      }
      console.log("Correo electrónico enviado:", info.response);
      res.status(200).send({
        msg: "Se ha enviado un enlace de recuperación a tu correo electrónico",
      });
    });
  } catch (error) {
    console.error("Error al enviar el enlace de recuperación:", error);
    res.status(500).send({ msg: "Error al enviar el enlace de recuperación" });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  passwordRecovery,
  refreshAccessToken,
};
