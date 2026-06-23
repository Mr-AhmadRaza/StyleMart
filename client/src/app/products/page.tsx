"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { getErrorMessage } from "@/lib/getErrorMessage";
import Link from "next/link";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error: unknown) {
        setError(getErrorMessage(error));
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading products...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="bg-gray-100 h-48 relative">
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
              <div className="p-4">
                <h2 className="font-semibold text-lg truncate">{product.name}</h2>
                <p className="text-gray-500 text-sm">{product.category?.name}</p>
                <p className="font-bold mt-1">Rs. {product.price}</p>
                <p className="text-sm text-gray-400">Stock: {product.stock}</p>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`flex-1 py-2 rounded text-sm text-white transition ${
                      addedId === product._id
                        ? "bg-green-600"
                        : "bg-black hover:bg-gray-800"
                    }`}
                  >
                    {addedId === product._id ? "Added ✓" : "Add to Cart"}
                  </button>
                  <Link
                    href={`/products/${product._id}`}
                    className="border border-black px-3 py-2 rounded text-sm hover:bg-gray-100 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}