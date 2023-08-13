import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

export const getProducts = async (req, res) => {
  try {
    const response = await Product.findAll();
    res.json(response);
  } catch (error) {
    return res.json(error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    return res.json(error);
  }
};

export const saveProduct = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "tidak ada file yang diupload" });
  const name = req.body.title;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedTypes = [".png", ".jpg", ".jpeg"];

  if (!allowedTypes.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "gambar invalid" });
  if (fileSize > 5000000)
    return (422).json({ msg: "gambar harus lebih kecil dari 5MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Product.create({ name: name, image: fileName, url: url });
      res.status(201).json({ msg: "Produk Berhasil Dibuat" });
    } catch (error) {
      return error(error.message);
    }
  });
};

export const updateProducts = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product)
    return res.status(404).json({ msg: "Tidak ada yang ditemukan" });
  let fileName = "";
  if (req.files === null) {
    fileName = Product.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "gambar tidak valid" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "gambar harus lebih kecil dari 5MB" });

    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });

  }

  const name = req.body.title;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  try {
    await Product.update({name: name, image: fileName, url: url},{
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({msg: "produk berhasil diupdate"})
  } catch (error) {
    return res.json(error);
  }
};

export const deleteProducts = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(400).json({ msg: "Tidak ditemukan" });

  try {
    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Product Berhasil dihapus" });
  } catch (error) {
    return error(error.message);
  }
};
