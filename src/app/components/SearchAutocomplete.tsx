import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Search, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { products, categories } from "../data/products";
import { useStore } from "../store/StoreContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SearchResult {
  type: "product" | "category" | "suggestion";
  id: string;
  name: string;
  image?: string;
  price?: number;
  category?: string;
  slug?: string;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-[#00D9FF]/20 text-[#0066FF] rounded-sm" style={{ fontWeight: 600 }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

const trendingSearches = ["Fone bluetooth", "Notebook gamer", "Smartwatch", "Camera 4K"];

export function SearchAutocomplete({ mobile = false }: { mobile?: boolean }) {
  const { searchQuery, setSearchQuery } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const getResults = useCallback((): SearchResult[] => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResult[] = [];

    // Search categories
    const matchedCats = categories.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
    matchedCats.forEach((cat) => {
      results.push({
        type: "category",
        id: `cat-${cat.slug}`,
        name: cat.name,
        image: cat.image,
        slug: cat.slug,
      });
    });

    // Search products
    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.category.toLowerCase().includes(q)
    );

    matchedProducts.slice(0, 6).forEach((p) => {
      results.push({
        type: "product",
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        category: p.category,
      });
    });

    // Add search suggestion
    if (results.length > 0) {
      results.push({
        type: "suggestion",
        id: `search-${q}`,
        name: `Buscar "${searchQuery.trim()}"`,
      });
    }

    return results;
  }, [searchQuery]);

  const results = getResults();

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setSearchQuery("");
    if (result.type === "product") {
      navigate(`/produto/${result.id}`);
    } else if (result.type === "category") {
      navigate(`/categoria/${result.slug}`);
    } else {
      navigate(`/categoria/todos?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false);
      navigate(`/categoria/todos?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const total = results.length || trendingSearches.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      if (results.length > 0 && results[activeIndex]) {
        handleSelect(results[activeIndex]);
      } else if (!searchQuery.trim() && trendingSearches[activeIndex]) {
        setSearchQuery(trendingSearches[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery]);

  const showDropdown = isOpen && (searchQuery.trim() || true);

  return (
    <div ref={containerRef} className={`relative ${mobile ? "w-full" : "flex-1 max-w-xl"}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar produtos, marcas e categorias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
            style={{ fontSize: 14 }}
            autoComplete="off"
          />
        </div>
      </form>

      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-[12px] border border-[rgba(0,0,0,0.08)] overflow-hidden z-[100]"
          style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
        >
          {results.length > 0 ? (
            <div className="py-2 max-h-[400px] overflow-y-auto">
              {results.map((result, i) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left cursor-pointer ${
                    i === activeIndex ? "bg-[#F0F4FF]" : "hover:bg-[#F8F9FA]"
                  }`}
                >
                  {result.type === "product" && result.image && (
                    <div className="w-10 h-10 bg-[#F8F9FA] rounded-[6px] overflow-hidden shrink-0">
                      <ImageWithFallback
                        src={result.image}
                        alt={result.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {result.type === "category" && (
                    <div className="w-10 h-10 bg-[#F0F4FF] rounded-[6px] flex items-center justify-center shrink-0">
                      <Search size={16} className="text-[#0066FF]" />
                    </div>
                  )}
                  {result.type === "suggestion" && (
                    <div className="w-10 h-10 bg-[#F0F4FF] rounded-[6px] flex items-center justify-center shrink-0">
                      <ArrowRight size={16} className="text-[#0066FF]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ fontSize: 14 }}>
                      {result.type === "suggestion"
                        ? result.name
                        : highlightMatch(result.name, searchQuery)}
                    </p>
                    {result.type === "product" && result.category && (
                      <p className="text-[#6B7280] truncate" style={{ fontSize: 12 }}>
                        em {result.category}
                      </p>
                    )}
                    {result.type === "category" && (
                      <p className="text-[#0066FF]" style={{ fontSize: 12 }}>
                        Ver categoria
                      </p>
                    )}
                  </div>
                  {result.type === "product" && result.price && (
                    <span className="text-[#0066FF] shrink-0" style={{ fontSize: 14, fontWeight: 600 }}>
                      {formatPrice(result.price)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="p-6 text-center">
              <p className="text-[#6B7280]" style={{ fontSize: 14 }}>
                Nenhum resultado para "<span style={{ fontWeight: 600 }}>{searchQuery}</span>"
              </p>
              <p className="text-[#9CA3AF] mt-1" style={{ fontSize: 12 }}>
                Tente buscar por outra palavra-chave
              </p>
            </div>
          ) : (
            <div className="py-3">
              <p className="px-4 pb-2 flex items-center gap-1.5 text-[#9CA3AF]" style={{ fontSize: 12, fontWeight: 500 }}>
                <TrendingUp size={14} />
                Buscas populares
              </p>
              {trendingSearches.map((term, i) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    inputRef.current?.focus();
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2 transition-colors text-left cursor-pointer ${
                    i === activeIndex ? "bg-[#F0F4FF]" : "hover:bg-[#F8F9FA]"
                  }`}
                >
                  <Clock size={14} className="text-[#9CA3AF] shrink-0" />
                  <span style={{ fontSize: 14 }}>{term}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
