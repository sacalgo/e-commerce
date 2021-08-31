import asyncHandler from "../middleware/asyncHandler";
import Product from "../models/productModel.js";
import ResponseStatus from "../utils/responseStatus";

//@desc Fetch all Products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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
  const { name, brand, image, price, description, category, countInStock } =
    req.body;

 

  if(!(name && brand&& image&& price && description && category && countInStock)){
    res.status(ResponseStatus.BAD_REQUEST);
    throw new Error("Fill Required Fields");
  }
  const product = new Product({
    name,
    price,
    user: req.user._id,
    image,
    brand,
    category,
    countInStock,
    description,
  });
  const createProduct = await product.save();
  res.status(ResponseStatus.CREATED).json(createProduct);

});

//@desc Update a product
//@route PUT /api/products/:id
//@access Private / Admin only
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    (product.category = category), (product.countInStock = countInStock);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("Product Not Found");
  }
});

//@desc Create a new review
//@route POST  /api/producst/:id/review
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(ResponseStatus.BAD_REQUEST);
      throw new Error("Product already reviewed");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(ResponseStatus.CREATED).json({ message: "Review added" });
  } else {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("Product Not Found");
  }
});

//@desc Get top rated Products
//@route GET  /api/producst/top
//@access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
