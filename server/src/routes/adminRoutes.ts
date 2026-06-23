import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";
import User from "../models/user";
import Product from "../models/product";
import Order from "../models/order";

const router = Router();

// ============================================
// 📊 STATS — for dashboard cards
// ============================================
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    // countDocuments() is like asking MongoDB:
    // "how many documents are in this collection?"
    const totalUsers    = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders   = await Order.countDocuments();

    // Add up all order totals to get revenue
    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      revenue: revenueData[0]?.total || 0,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to get stats" });
  }
});


// ============================================
// 👥 USERS — get all, delete one
// ============================================

// GET all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    // find all users but hide their passwords!
    // "-password" means "give me everything EXCEPT password"
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to get users" });
  }
});

// DELETE a user by ID
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    // :id means whatever comes after /users/
    // example: DELETE /api/admin/users/abc123
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});


// ============================================
// 📦 PRODUCTS — get all, delete one
// ============================================

// GET all products
router.get("/products", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to get products" });
  }
});

// DELETE a product by ID
router.delete("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});


// ============================================
// 🛒 ORDERS — get all, update status
// ============================================

// GET all orders (with user info attached)
router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    // .populate("user", "name email") means:
    // "instead of just showing the user's ID,
    //  go find that user and show their name + email"
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 }); // newest first

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to get orders" });
  }
});

// UPDATE order status (pending → processing → delivered etc.)
router.put("/orders/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // get new status from request body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },        // update just the status field
      { new: true }      // return the UPDATED order, not the old one
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order" });
  }
});

// ➕ ADD a new product
router.post("/products", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;
    const product = await Product.create({ name, description, price, image, stock });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product" });
  }
});

// ✏️ EDIT an existing product
router.put("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,       // update with whatever fields are sent
      { new: true }   // return the updated version
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
});


// Keep your original route too
router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

export default router;