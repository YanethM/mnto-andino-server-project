const BASE_URL = "http://localhost:4000";
const sharp = require('sharp');

function getFilePath(file) {
  const filePath = file.path;
  const fileSplit = filePath.split("/");

  return `${fileSplit[1]}/${fileSplit[2]}`;
}

function getImageUrl(imagePath) {
  console.log(`${BASE_URL}/${imagePath}`);
  return `${BASE_URL}/${imagePath}`;
}

const uploadImage = async (req, res) => {
  try {
    const { avatar } = req.files;
    const extension = avatar.name.split('.').pop();
    const imagen = await sharp(getFilePath(req.file))
    return `${extension}/${avatar.name}`;
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Error al subir la imagen" });
  }
};
module.exports = {
  getFilePath,
  getImageUrl,
  uploadImage,
};
