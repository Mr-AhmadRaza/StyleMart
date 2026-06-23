import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "./models/product";

const products = [
  {
    name: "Classic White T-Shirt",
    price: 500.99,
    description: "A clean, minimalist white tee perfect for everyday wear.",
    stock: 50,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  },
  {
    name: "Black Slim Jeans",
    price: 700.99,
    description: "Slim fit black jeans with a modern cut.",
    stock: 35,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
  },
  {
    name: "Running Sneakers",
    price: 1000.99,
    description: "Lightweight sneakers built for performance and style.",
    stock: 20,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  },
  {
    name: "Leather Jacket",
    price: 2000.99,
    description: "Classic leather jacket with a timeless design.",
    stock: 15,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
  },
  {
    name: "Summer Floral Dress",
    price: 500.99,
    description: "Light and breezy floral dress for warm days.",
    stock: 25,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
  },
  {
    name: "Hooded Sweatshirt",
    price: 400.99,
    description: "Cozy pullover hoodie in a relaxed fit.",
    stock: 40,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
  },
  {
    name: "Chino Pants",
    price: 600.99,
    description: "Smart casual chinos that go with everything.",
    stock: 30,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
  },
  {
    name: "Denim Jacket",
    price: 700.99,
    description: "A versatile denim jacket for any season.",
    stock: 20,
    image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800",
  },
  {
  name: "Formal Blazer",
  price: 1200.99,
  description: "Sharp and professional blazer for formal occasions.",
  stock: 18,
  image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
},
{
  name: "Trouser",
  price: 3000.99,
  description: "Official white cricket trousers with elastic waistband for comfort.",
  stock: 40,
  image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800",
},
{
  name: "Jersey",
  price: 479.99,
  description: "Breathable and lightweight cricket jersey for professional matches.",
  stock: 35,
  image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800",
},
{
  name: "Sweater",
  price: 2500.99,
  description: "Classic V-neck cricket sweater in white with navy trim.",
  stock: 20,
  image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
},
{
  name: "Shoes",
  price: 1500.99,
  description: "Spiked cricket shoes for superior grip on the pitch.",
  stock: 25,
  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
},
{
  name: "Striped Polo Shirt",
  price: 1000.99,
  description: "Classic striped polo shirt for a smart casual look.",
  stock: 45,
  image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800",
},
{
  name: "White Sneakers",
  price: 700.99,
  description: "Clean and minimal white sneakers for everyday wear.",
  stock: 30,
  image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
},
{
  name: "Cargo Shorts",
  price: 650.99,
  description: "Comfortable cargo shorts with multiple pockets.",
  stock: 25,
  image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
},


];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Existing products cleared");

    // Insert new products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();