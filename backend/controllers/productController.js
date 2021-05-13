import asyncHandler from "../middleware/asyncHandler";
import Product from "../models/productModel.js";
import ResponseStatus from "../utils/responseStatus";

//@desc Fetch all Products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  res.json(products);
});

//@desc Fetch sing Product
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("Product not found");
  }
});

//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private / Admin only
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("Product not found");
  }
});

//@desc Create a product
//@route POST /api/products
//@access Private / Admin only
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category:"sampel category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(ResponseStatus.CREATED).json(createdProduct);
});

//@desc Update a product
//@route PUT /api/products/:id
//@access Private / Admin only
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product=await Product.findById(req.params.id);
  if(product){

    product.name=name;
    product.price=price;
    product.description=description;
    product.image=image;
    product.brand=brand;
    product.category=category,
    product.countInStock=countInStock;

  const updatedProduct= await product.save();
  res.json(updatedProduct);

  }else{
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error('Product Not Found');
  }

});

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct };
