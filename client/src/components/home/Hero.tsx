import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-200 via-white to-purple-200 min-h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-purple-50 rounded-full opacity-30 blur-3xl" />

      <div className="relative text-center max-w-3xl px-6">

        {/* Badge */}
        <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          New Collection 2026
        </span>

        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Latest <span className="text-indigo-600">Fashion</span> Collection
        </h1>

        <p className="mt-5 text-lg text-gray-500 font-medium">
          Discover trendy clothes at affordable prices — look great, feel confident.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/products"
            className="bg-indigo-400 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-indigo-300 transition-all duration-200"
          >
            Shop Now →
          </Link>
          <Link
            href="/about"
            className="text-gray-700 font-semibold px-8 py-3.5 rounded-full border border-black hover:bg-indigo-200 transition-all duration-200"
          >
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 flex justify-center gap-12">
          {[
            { value: "100+", label: "Products" },
            { value: "5k+", label: "Customers" },
            { value: "4.1★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}