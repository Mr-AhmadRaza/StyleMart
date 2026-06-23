import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Style<span className="text-indigo-400">Mart</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed max-w-sm">
              Your one-stop fashion store. Discover trendy clothes at affordable prices — look great, feel confident.
            </p>
            {/* Social Icons */}
       {/* Social Icons */}
<div className="flex gap-4 mt-6">
  <a href="#" className="text-xs bg-gray-800 hover:bg-indigo-600 hover:text-white text-gray-400 px-3 py-1.5 rounded-full transition-all duration-200">
    Instagram
  </a>
  <a href="#" className="text-xs bg-gray-800 hover:bg-indigo-600 hover:text-white text-gray-400 px-3 py-1.5 rounded-full transition-all duration-200">
    Twitter
  </a>
  <a href="#" className="text-xs bg-gray-800 hover:bg-indigo-600 hover:text-white text-gray-400 px-3 py-1.5 rounded-full transition-all duration-200">
    Facebook
  </a>
</div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Track Order", href: "/track-order" },
                { label: "Cart", href: "/cart" },
                { label: "Checkout", href: "/checkout" },
                { label: "Order Success", href: "/order-success" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>© 2025 StyleMart. All rights reserved.</p>
          <p>Made with ❤️ for fashion lovers</p>
        </div>

      </div>
    </footer>
  );
}