import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router";
import { Product } from "../data/products";
import { StarRating } from "./StarRating";
import { useStore } from "../store/StoreContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addToCart(product);
      toast.success(`${product.name} adicionado ao carrinho!`);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!inWishlist) {
      toast.success(`${product.name} adicionado aos favoritos!`);
    } else {
      toast("Removido dos favoritos");
    }
  };

  return (
    <div className="group bg-white rounded-[12px] overflow-hidden border border-[rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <Link to={`/produto/${product.id}`} className="relative overflow-hidden">
        <div className="aspect-square bg-[#F0F1F3] p-6 flex items-center justify-center overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#EF4444] text-white px-2 py-0.5 rounded-md" style={{ fontSize: 12, fontWeight: 600 }}>
            -{product.discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[#1A1A1A] px-4 py-2 rounded-lg" style={{ fontSize: 14, fontWeight: 600 }}>
              Esgotado
            </span>
          </div>
        )}
        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            inWishlist
              ? "bg-[#EF4444] text-white shadow-md"
              : "bg-white/80 text-[#6B7280] hover:bg-white hover:text-[#EF4444] opacity-0 group-hover:opacity-100 shadow-sm"
          }`}
          aria-label={inWishlist ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={16} className={inWishlist ? "fill-current" : ""} />
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <span className="text-[#6B7280] uppercase tracking-wider" style={{ fontSize: 11 }}>
          {product.brand}
        </span>
        <Link to={`/produto/${product.id}`} className="hover:text-[#0066FF] transition-colors">
          <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{product.name}</h3>
        </Link>
        <StarRating rating={product.rating} reviews={product.reviews} size={14} />

        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-[#0066FF]" style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[#9CA3AF] line-through" style={{ fontSize: 13 }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-gray-300 text-white py-2.5 rounded-[8px] transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
          style={{ fontSize: 14, fontWeight: 600 }}
        >
          <ShoppingCart size={16} />
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}