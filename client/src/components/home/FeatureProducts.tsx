"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center">Featured Products</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-5 animate-pulse">
              <div className="h-52 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded mt-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mt-2 w-1/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl re  mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center">Featured Products 🛍️</h2>

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-5 hover:shadow-lg transition"
          >
            {/* Image */}
            <div className="h-52 bg-gray-200 rounded overflow-hidden relative">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}
            </div>

            {/* Info */}
            <h3 className="mt-4 text-xl font-semibold">{product.name}</h3>
            {product.category && (
              <p className="text-sm text-gray-400">{product.category.name}</p>
            )}
            <p className="mt-1 font-medium">Rs. {product.price}</p>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleAddToCart(product)}
                className={`flex-1 px-4 py-2 rounded transition text-white font-medium ${
                  addedId === product._id
                    ? "bg-green-600"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {addedId === product._id ? "Added ✓" : "Add To Cart"}
              </button>
              <Link
                href={`/products/${product._id}`}
                className="border border-black px-4 py-2 rounded hover:bg-indigo-300 transition text-center"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* See all products link */}
      <div className="text-center mt-10">
        <Link
          href="/products"
          className="border px-4 py-3 rounded-full border-gray-300 hover:bg-indigo-200 hover:border-black hover:text-indigo-600 transition inline-block font-medium"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}