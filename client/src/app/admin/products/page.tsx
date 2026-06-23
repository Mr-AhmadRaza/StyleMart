"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

const emptyForm = { name: "", description: "", price: "", image: "", stock: "" };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // GET /api/products → getProducts
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (product: Product) => {
    setForm({
      name: product.name, description: product.description,
      price: String(product.price), image: product.image, stock: String(product.stock),
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  // POST /api/products → createProduct
  // PUT  /api/products/:id → updateProduct
  const handleSave = async () => {
    if (!form.name || !form.price) { alert("Name and price are required."); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name, description: form.description,
        price: Number(form.price), image: form.image, stock: Number(form.stock),
      };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      await fetchProducts();
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE /api/products/:id → deleteProduct
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete product.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products in store</p>
        </div>
        <button onClick={handleOpenAdd}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">{editingId ? "Edit Product" : "Add New Product"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Nike Air Max"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Price (Rs.) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 4500"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="e.g. 20"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
              <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} placeholder="Short product description..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-44 object-cover" />
            ) : (
              <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-4xl">🛍️</div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
              {product.description && (
                <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
              )}
              <p className="text-indigo-600 font-bold">Rs. {product.price.toLocaleString()}</p>
              <div className="flex gap-2 pt-1">
                <button onClick={() => handleOpenEdit(product)}
                  className="flex-1 text-xs bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)}
                  className="flex-1 text-xs bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}