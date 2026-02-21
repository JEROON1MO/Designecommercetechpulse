import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ShoppingCart, User, Menu, X, ChevronDown, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { useStore } from "../store/StoreContext";
import { categories } from "../data/products";
import { SearchAutocomplete } from "./SearchAutocomplete";

export function Header() {
  const { cartCount, wishlistCount } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-[rgba(0,0,0,0.06)]" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      {/* Top bar */}
      <div className="bg-[#1A1A1A] text-white py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between" style={{ fontSize: 12 }}>
          <span>Frete gratis para compras acima de R$ 299</span>
          <div className="hidden md:flex items-center gap-4">
            <span>Central de Atendimento: (11) 4002-8922</span>
            <span>Rastreie seu pedido</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#1A1A1A] cursor-pointer"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <Logo size="md" />
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 text-[#1A1A1A] hover:text-[#0066FF] rounded-lg transition-colors"
              style={{ fontSize: 14, fontWeight: 500 }}
            >
              Inicio
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCatDropdownOpen(true)}
              onMouseLeave={() => setCatDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 text-[#1A1A1A] hover:text-[#0066FF] rounded-lg transition-colors cursor-pointer"
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                Categorias
                <ChevronDown size={14} className={`transition-transform ${catDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {catDropdownOpen && (
                <div className="absolute top-full left-0 bg-white border border-[rgba(0,0,0,0.08)] rounded-[12px] shadow-xl py-2 min-w-[200px] z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/categoria/${cat.slug}`}
                      className="block px-4 py-2.5 text-[#1A1A1A] hover:bg-[#F0F4FF] hover:text-[#0066FF] transition-colors"
                      style={{ fontSize: 14 }}
                      onClick={() => setCatDropdownOpen(false)}
                    >
                      {cat.name}
                      <span className="text-[#9CA3AF] ml-1" style={{ fontSize: 12 }}>({cat.count})</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/categoria/todos"
              className="px-3 py-2 text-[#1A1A1A] hover:text-[#0066FF] rounded-lg transition-colors"
              style={{ fontSize: 14, fontWeight: 500 }}
            >
              Ofertas
            </Link>
          </nav>

          {/* Search with autocomplete */}
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchAutocomplete />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <Link
              to="/favoritos"
              className="relative flex items-center gap-2 px-2.5 py-2 text-[#1A1A1A] hover:text-[#EF4444] rounded-lg transition-colors"
              style={{ fontSize: 14, fontWeight: 500 }}
              aria-label="Favoritos"
            >
              <Heart size={20} />
              <span className="hidden xl:inline">Favoritos</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 left-5 xl:-top-0.5 xl:left-5 bg-[#EF4444] text-white min-w-[18px] h-[18px] flex items-center justify-center rounded-full" style={{ fontSize: 10, fontWeight: 700 }}>
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              className="hidden md:flex items-center gap-2 px-2.5 py-2 text-[#1A1A1A] hover:text-[#0066FF] rounded-lg transition-colors cursor-pointer"
              style={{ fontSize: 14, fontWeight: 500 }}
            >
              <User size={20} />
              <span className="hidden xl:inline">Entrar</span>
            </button>
            <Link
              to="/carrinho"
              className="relative flex items-center gap-2 px-2.5 py-2 text-[#1A1A1A] hover:text-[#0066FF] rounded-lg transition-colors"
              style={{ fontSize: 14, fontWeight: 500 }}
            >
              <ShoppingCart size={20} />
              <span className="hidden xl:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 left-5 xl:-top-0.5 xl:left-5 bg-[#0066FF] text-white min-w-[18px] h-[18px] flex items-center justify-center rounded-full" style={{ fontSize: 10, fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-3">
          <SearchAutocomplete mobile />
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[rgba(0,0,0,0.06)] py-4 px-4">
          <nav className="flex flex-col gap-1">
            <Link to="/" className="px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F0F4FF] rounded-lg" style={{ fontSize: 15 }} onClick={() => setMobileMenuOpen(false)}>
              Inicio
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/categoria/${cat.slug}`}
                className="px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F0F4FF] rounded-lg"
                style={{ fontSize: 15 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/categoria/todos" className="px-3 py-2.5 text-[#0066FF] hover:bg-[#F0F4FF] rounded-lg" style={{ fontSize: 15, fontWeight: 600 }} onClick={() => setMobileMenuOpen(false)}>
              Ofertas
            </Link>
            <Link to="/favoritos" className="px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F0F4FF] rounded-lg flex items-center gap-2" style={{ fontSize: 15 }} onClick={() => setMobileMenuOpen(false)}>
              <Heart size={18} />
              Favoritos
              {wishlistCount > 0 && (
                <span className="bg-[#EF4444] text-white min-w-[20px] h-[20px] flex items-center justify-center rounded-full" style={{ fontSize: 11, fontWeight: 600 }}>
                  {wishlistCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
