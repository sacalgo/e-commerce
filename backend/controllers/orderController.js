import asyncHandler from "../middleware/asyncHandler";
import Order from "../models/orderModel";
import ResponseStatus from "../utils/responseStatus";

//@desc Create new order
//@route POST /api/orders
//@access Private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    console.log("error yet aahe");
    res.status(ResponseStatus.BAD_REQUEST);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(ResponseStatus.CREATED).json(createdOrder);
  }
});

export { addOrderItems };
