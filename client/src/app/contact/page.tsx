// client/src/app/contact/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/api";

// Shape of our form data
interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  // Runs when user clicks Send Message
  const handleSubmit = async () => {

    // Basic frontend check before even calling API
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // POST /api/contact → your backend
      await api.post("/contact", form);

      setSuccess(true);  // show success message
      setForm({ name: "", email: "", message: "" }); // clear form

    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-4">

      <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">
        We&apos;ll get back to you as soon as possible.
      </p>

      {/* Success message */}
      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-4 mb-6 text-sm font-medium">
          ✅ Message sent! We&apos;ll get back to you soon.
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="space-y-4">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Write your message..."
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

      </div>
    </div>
  );
}