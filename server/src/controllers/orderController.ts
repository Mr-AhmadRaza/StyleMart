import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Order from "../models/order";

// POST /api/orders — Create order
export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { items, shippingAddress, totalPrice, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: "No items in order" });
      return;
    }

    const order = await Order.create({
      user: req.user?.id,
      items,
      shippingAddress,
      totalPrice,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/orders/my — Get logged in user orders
export const getMyOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/orders/:id — Get single order
export const getOrderById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Only owner or admin can view
    if (
      order.user._id.toString() !== req.user?.id &&
      req.user?.role !== "admin"
    ) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/orders — Admin: get all orders
export const getAllOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// PUT /api/orders/:id/status — Admin: update order status
export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};