import asyncHandler from "../middleware/asyncHandler";
import Order from "../models/orderModel";
import ResponseStatus from "../utils/responseStatus";

//@desc Create new order
//@route POST /api/orders
//@access Private

const addOrderItems = asyncHandler(async (req, res) => {
  try {
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
      res.status(ResponseStatus.BAD_REQUEST);
      throw new Error("No order items");
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
  } catch (error) {
    res.status(ResponseStatus.BAD_REQUEST);
    throw new Error("Error occurred", error);
  }
});

//@desc Get order by ID
//@route GET /api/orders/:id
//@access Private
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    }
  } catch (error) {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("Order Not Found");
  }
});

//@desc Update  order to Paid
//@route GET /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
      const updatedOrder = await order.save();

      res.json(updatedOrder);
    }
  } catch (error) {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("Order Not Found");
  }
});

//@desc Update  order to delivered
//@route PUT /api/orders/:id/deliver
//@access Private / Admin only
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    }
  } catch (error) {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("Order Not Found");
  }
});

//@desc Get logged in user orders
//@route GET /api/orders/myorders
//@access Private
const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.json(orders);
  } catch (error) {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("Order Not Found");
  }
});

//@desc Get all user orders
//@route GET /api/orders
//@access Private Admin only
const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  } catch (error) {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("Order Not Found");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
