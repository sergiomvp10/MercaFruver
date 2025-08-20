import { Product } from "../models/Product.js"

export const getProducts = (async(req,res,next)=>{
    try {
        const products = await Product.findAll()
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(400).json({message: "Error en los productos"})
    }
})

export const createProduct = async(req, res, next) => {
  try {
    const { name, description, price_purchase, price_sale, stock, barcode } =
      req.body || req.query;
    const product = await Product.create({
      name,
      description,
      price_purchase,
      price_sale,
      stock,
      barcode,
    });
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error en los productos" });
  }
};


export const updateProduct = async (req, res, next) => {
  try {
    const {id} = req.params
    const update = req.body || req.query;
    console.log(id,update)
    const product = await Product.update(update,{where:{id:id}});
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error en los productos" });
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id: id } });
    res.status(200).json({message: "Producto Eliminado correctamente"});
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error en los productos" });
  }
};

export const getProductByBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    const product = await Product.findOne({ where: { barcode: barcode } });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error buscando producto por código de barras" });
  }
};
