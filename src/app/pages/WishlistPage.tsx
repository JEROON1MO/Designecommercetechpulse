import { Link } from "react-router";
import { ChevronRight, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { ProductCard } from "../components/ProductCard";
import { products } from "../data/products";

export function WishlistPage() {
  const { wishlist, toggleWishlist } = useStore();

  // Suggest products user might like
  const suggestions = products
    .filter((p) => !wishlist.find((w) => w.id === p.id) && p.featured)
    .slice(0, 4);

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-6">
          <Heart size={32} className="text-[#EF4444]" />
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>
          Sua lista de favoritos esta vazia
        </h1>
        <p className="text-[#6B7280] mt-2" style={{ fontSize: 15 }}>
          Explore nossos produtos e salve os que voce mais gosta!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-[#0066FF] text-white rounded-[10px] hover:bg-[#0052CC] transition-colors"
          style={{ fontSize: 15, fontWeight: 600 }}
        >
          Explorar Produtos
        </Link>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-16 text-left">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 20 }}>
              Voce pode gostar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {suggestions.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6" style={{ fontSize: 13, color: "#6B7280" }}>
        <Link to="/" className="hover:text-[#0066FF] transition-colors">Inicio</Link>
        <ChevronRight size={14} />
        <span className="text-[#1A1A1A]" style={{ fontWeight: 500 }}>Favoritos</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, color: "#1A1A1A" }}>
            Meus Favoritos
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            {wishlist.length} {wishlist.length === 1 ? "produto salvo" : "produtos salvos"}
          </p>
        </div>
        <button
          onClick={() => wishlist.forEach((p) => toggleWishlist(p))}
          className="flex items-center gap-2 px-4 py-2 text-[#EF4444] border border-[#EF4444]/20 rounded-[8px] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
          style={{ fontSize: 13, fontWeight: 500 }}
        >
          <Trash2 size={16} />
          Limpar tudo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <section className="mt-16">
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 20 }}>
            Voce tambem pode gostar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {suggestions.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
