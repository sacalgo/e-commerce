import asyncHander from "express-async-handler";
import Product from "../models/productModel.js";
import ResponseStatus from "../utils/responseStatus";

//@desc Fetch all Products
//@route GET /api/products
//@access Public
const getProducts = asyncHander(async (req, res) => {
  const products = await Product.find({});

  res.json(products);
});

//@desc Fetch sing Product
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHander(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("Product not found");
  }
});

export { getProducts, getProductById };
