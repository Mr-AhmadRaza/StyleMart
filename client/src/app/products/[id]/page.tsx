"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getOne(id as string);
        setProduct(data);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">Product not found.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover h-full w-full rounded-lg"
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.category && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit">
              {product.category.name}
            </span>
          )}
          <p className="text-gray-600">{product.description}</p>
          <p className="text-3xl font-bold">${product.price}</p>
          <p className="text-sm text-gray-400">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
          <button
            disabled={product.stock === 0}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 disabled:opacity-50 w-full md:w-fit"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}