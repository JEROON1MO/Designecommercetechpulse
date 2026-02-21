import { useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { products, categories } from "../data/products";
import { ProductCard } from "../components/ProductCard";

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const category = categories.find((c) => c.slug === slug);
  const categoryName = searchQuery
    ? `Resultados para "${searchQuery}"`
    : category?.name || "Todos os Produtos";

  const allBrands = useMemo(() => {
    const brands = new Set(products.map((p) => p.brand));
    return Array.from(brands).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = slug && slug !== "todos"
      ? products.filter((p) => p.categorySlug === slug)
      : [...products];

    // Apply search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }
    return filtered;
  }, [slug, searchQuery, selectedBrands, minRating, inStockOnly, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    setPriceRange([0, 10000]);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedBrands.length > 0 || minRating > 0 || inStockOnly || priceRange[0] > 0 || priceRange[1] < 10000;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Price */}
      <div>
        <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          Faixa de Preco
        </h4>
        <div className="space-y-2">
          {[
            { label: "Ate R$ 300", range: [0, 300] as [number, number] },
            { label: "R$ 300 - R$ 1.000", range: [300, 1000] as [number, number] },
            { label: "R$ 1.000 - R$ 3.000", range: [1000, 3000] as [number, number] },
            { label: "R$ 3.000 - R$ 5.000", range: [3000, 5000] as [number, number] },
            { label: "Acima de R$ 5.000", range: [5000, 10000] as [number, number] },
          ].map((item) => (
            <label
              key={item.label}
              className="flex items-center gap-2 cursor-pointer hover:text-[#0066FF] transition-colors py-0.5"
              style={{ fontSize: 13 }}
            >
              <input
                type="radio"
                name="price"
                checked={priceRange[0] === item.range[0] && priceRange[1] === item.range[1]}
                onChange={() => { setPriceRange(item.range); setCurrentPage(1); }}
                className="accent-[#0066FF]"
              />
              {item.label}
            </label>
          ))}
          <label
            className="flex items-center gap-2 cursor-pointer hover:text-[#0066FF] transition-colors py-0.5"
            style={{ fontSize: 13 }}
          >
            <input
              type="radio"
              name="price"
              checked={priceRange[0] === 0 && priceRange[1] === 10000}
              onChange={() => { setPriceRange([0, 10000]); setCurrentPage(1); }}
              className="accent-[#0066FF]"
            />
            Todos os precos
          </label>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          Marca
        </h4>
        <div className="space-y-2">
          {allBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer hover:text-[#0066FF] transition-colors py-0.5"
              style={{ fontSize: 13 }}
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="accent-[#0066FF] rounded"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          Avaliacao Minima
        </h4>
        <div className="space-y-2">
          {[4, 3.5, 3, 0].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer hover:text-[#0066FF] transition-colors py-0.5"
              style={{ fontSize: 13 }}
            >
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => { setMinRating(rating); setCurrentPage(1); }}
                className="accent-[#0066FF]"
              />
              {rating > 0 ? `${rating}+ estrelas` : "Todas"}
            </label>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div>
        <label
          className="flex items-center gap-2 cursor-pointer hover:text-[#0066FF] transition-colors"
          style={{ fontSize: 13 }}
        >
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => { setInStockOnly(!inStockOnly); setCurrentPage(1); }}
            className="accent-[#0066FF] rounded"
          />
          Somente em estoque
        </label>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-[#EF4444] border border-[#EF4444]/20 rounded-lg hover:bg-[#EF4444]/5 transition-colors cursor-pointer"
          style={{ fontSize: 13, fontWeight: 500 }}
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6" style={{ fontSize: 13, color: "#6B7280" }}>
        <Link to="/" className="hover:text-[#0066FF] transition-colors">Inicio</Link>
        <ChevronRight size={14} />
        <span className="text-[#1A1A1A]" style={{ fontWeight: 500 }}>{category?.name || "Todos"}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, color: "#1A1A1A" }}>
            {categoryName}
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(0,0,0,0.08)] rounded-[8px] cursor-pointer"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            <SlidersHorizontal size={16} />
            Filtros
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-[#0066FF] text-white rounded-full flex items-center justify-center" style={{ fontSize: 10 }}>!</span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-white border border-[rgba(0,0,0,0.08)] rounded-[8px] px-3 py-2">
            <span style={{ fontSize: 13, color: "#6B7280" }}>Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="bg-transparent focus:outline-none cursor-pointer"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              <option value="relevance">Mais Relevantes</option>
              <option value="price-asc">Menor Preco</option>
              <option value="price-desc">Maior Preco</option>
              <option value="rating">Melhor Avaliacao</option>
              <option value="discount">Maior Desconto</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters - desktop */}
        <aside className="hidden lg:block w-[240px] shrink-0">
          <div className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-5 sticky top-[140px]">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600 }}>Filtros</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-[#0066FF] cursor-pointer" style={{ fontSize: 12 }}>Limpar</button>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile filters */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-white overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 600 }}>Filtros</h3>
                <button onClick={() => setShowFilters(false)} className="cursor-pointer"><X size={20} /></button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Products grid */}
        <div className="flex-1">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-[rgba(0,0,0,0.08)] rounded-[8px] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:border-[#0066FF] transition-colors"
                    style={{ fontSize: 13 }}
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-[8px] cursor-pointer transition-colors ${
                        page === currentPage
                          ? "bg-[#0066FF] text-white"
                          : "bg-white border border-[rgba(0,0,0,0.08)] hover:border-[#0066FF]"
                      }`}
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-[rgba(0,0,0,0.08)] rounded-[8px] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:border-[#0066FF] transition-colors"
                    style={{ fontSize: 13 }}
                  >
                    Proximo
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A" }}>Nenhum produto encontrado</p>
              <p style={{ fontSize: 14, color: "#6B7280", marginTop: 8 }}>Tente ajustar os filtros para ver mais resultados.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2.5 bg-[#0066FF] text-white rounded-[8px] cursor-pointer"
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
