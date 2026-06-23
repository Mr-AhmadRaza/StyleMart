import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import orderRoutes from "./routes/orderRoutes";
// server/src/app.ts — add these 2 lines

import contactRoutes from "./routes/contactRoutes"; // add this


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes); // add this

app.get("/", (req, res) => {
  res.json({
    message: "StyleMart API Running"
  });
});

export default app;