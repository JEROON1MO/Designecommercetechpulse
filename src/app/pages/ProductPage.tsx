import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ChevronRight, Minus, Plus, ShoppingCart, Heart, Share2,
  Truck, Shield, RotateCcw, ThumbsUp
} from "lucide-react";
import { products, reviewsData } from "../data/products";
import { StarRating } from "../components/StarRating";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../store/StoreContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "reviews">("specs");
  const [reviewFilter, setReviewFilter] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find((p) => p.id === id);
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700 }}>Produto nao encontrado</h1>
        <Link to="/" className="mt-4 inline-block text-[#0066FF] hover:underline">Voltar a loja</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const productReviews = reviewsData.filter((r) => r.productId === product.id);
  const filteredReviews = reviewFilter > 0
    ? productReviews.filter((r) => r.rating === reviewFilter)
    : productReviews;

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    if (!inWishlist) {
      toast.success(`${product.name} adicionado aos favoritos!`);
    } else {
      toast("Removido dos favoritos");
    }
  };

  const installmentPrice = (product.price / 12).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6 flex-wrap" style={{ fontSize: 13, color: "#6B7280" }}>
        <Link to="/" className="hover:text-[#0066FF] transition-colors">Inicio</Link>
        <ChevronRight size={14} />
        <Link to={`/categoria/${product.categorySlug}`} className="hover:text-[#0066FF] transition-colors">
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-[#1A1A1A]" style={{ fontWeight: 500 }}>{product.name}</span>
      </nav>

      {/* Product section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image gallery */}
        <div>
          <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.06)] overflow-hidden p-6">
            <div className="aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-[#F0F1F3]">
              <ImageWithFallback
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 bg-white rounded-[8px] border-2 overflow-hidden cursor-pointer p-2 transition-all ${
                    selectedImage === i ? "border-[#0066FF]" : "border-[rgba(0,0,0,0.08)] hover:border-[#0066FF]/50"
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.name} - ${i + 1}`}
                    className="w-full h-full object-contain rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#0066FF] uppercase tracking-wider" style={{ fontSize: 12, fontWeight: 600 }}>
              {product.brand}
            </span>
            {product.discount > 0 && (
              <span className="bg-[#EF4444] text-white px-2 py-0.5 rounded" style={{ fontSize: 11, fontWeight: 600 }}>
                -{product.discount}% OFF
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, lineHeight: 1.2, color: "#1A1A1A" }}>
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mt-3">
            <StarRating rating={product.rating} reviews={product.reviews} size={18} />
            <span className="text-[#6B7280]" style={{ fontSize: 13 }}>|</span>
            <span
              className={product.inStock ? "text-[#10B981]" : "text-[#EF4444]"}
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              {product.inStock ? "Em estoque" : "Esgotado"}
            </span>
          </div>

          <p className="text-[#4B5563] mt-4" style={{ fontSize: 15, lineHeight: 1.6 }}>
            {product.shortDescription}
          </p>

          {/* Price */}
          <div className="mt-6 p-5 bg-[#F0F4FF] rounded-[12px]">
            {product.originalPrice > product.price && (
              <span className="text-[#9CA3AF] line-through" style={{ fontSize: 16 }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#0066FF",
                }}
              >
                {formatPrice(product.price)}
              </span>
            </div>
            <p className="text-[#6B7280] mt-1" style={{ fontSize: 13 }}>
              ou 12x de R$ {installmentPrice} sem juros
            </p>
            <p className="text-[#10B981] mt-1" style={{ fontSize: 13, fontWeight: 500 }}>
              R$ {(product.price * 0.9).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} no Pix (10% off)
            </p>
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center border border-[rgba(0,0,0,0.1)] rounded-[8px] overflow-hidden bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 h-11 flex items-center justify-center border-x border-[rgba(0,0,0,0.1)]" style={{ fontSize: 15, fontWeight: 600 }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[10px] text-white disabled:bg-gray-300 transition-all duration-200 hover:scale-[1.01] cursor-pointer disabled:cursor-not-allowed"
              style={{
                fontSize: 15,
                fontWeight: 700,
                background: product.inStock ? "linear-gradient(135deg, #0066FF, #0052CC)" : undefined,
                boxShadow: product.inStock ? "0 4px 15px rgba(0,102,255,0.3)" : undefined,
              }}
            >
              <ShoppingCart size={20} />
              Adicionar ao Carrinho
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleToggleWishlist}
              className={`flex items-center gap-2 transition-colors cursor-pointer ${
                inWishlist ? "text-[#EF4444]" : "text-[#6B7280] hover:text-[#EF4444]"
              }`}
              style={{ fontSize: 13 }}
            >
              <Heart size={18} className={inWishlist ? "fill-current" : ""} />
              {inWishlist ? "Favoritado" : "Favoritar"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copiado!");
              }}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#0066FF] transition-colors cursor-pointer"
              style={{ fontSize: 13 }}
            >
              <Share2 size={18} />
              Compartilhar
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: <Truck size={18} />, label: "Frete Gratis" },
              { icon: <Shield size={18} />, label: "Garantia 1 Ano" },
              { icon: <RotateCcw size={18} />, label: "Troca em 30 dias" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-[8px] border border-[rgba(0,0,0,0.06)]">
                <span className="text-[#0066FF]">{item.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "#4B5563", textAlign: "center" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-[rgba(0,0,0,0.08)] overflow-x-auto">
          {[
            { key: "specs" as const, label: "Especificacoes" },
            { key: "description" as const, label: "Descricao" },
            { key: "reviews" as const, label: `Avaliacoes (${productReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[#0066FF] text-[#0066FF]"
                  : "border-transparent text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-[12px] border border-t-0 border-[rgba(0,0,0,0.06)] p-6 lg:p-8">
          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-[#F8F9FA]" : ""}>
                      <td className="px-4 py-3 text-[#6B7280]" style={{ fontSize: 14, fontWeight: 500, width: "40%" }}>
                        {key}
                      </td>
                      <td className="px-4 py-3 text-[#1A1A1A]" style={{ fontSize: 14 }}>
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "description" && (
            <div className="max-w-3xl">
              <p className="text-[#4B5563]" style={{ fontSize: 15, lineHeight: 1.8 }}>
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {/* Rating summary */}
              <div className="flex flex-col sm:flex-row items-start gap-8 mb-8">
                <div className="text-center">
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 48, fontWeight: 800, color: "#1A1A1A" }}>
                    {product.rating}
                  </div>
                  <StarRating rating={product.rating} size={20} showCount={false} />
                  <p className="text-[#6B7280] mt-1" style={{ fontSize: 13 }}>
                    {product.reviews.toLocaleString("pt-BR")} avaliacoes
                  </p>
                </div>

                {/* Filter by stars */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setReviewFilter(0)}
                    className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      reviewFilter === 0 ? "bg-[#0066FF] text-white border-[#0066FF]" : "border-[rgba(0,0,0,0.1)] hover:border-[#0066FF]"
                    }`}
                    style={{ fontSize: 12, fontWeight: 500 }}
                  >
                    Todas
                  </button>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewFilter(star)}
                      className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                        reviewFilter === star ? "bg-[#0066FF] text-white border-[#0066FF]" : "border-[rgba(0,0,0,0.1)] hover:border-[#0066FF]"
                      }`}
                      style={{ fontSize: 12, fontWeight: 500 }}
                    >
                      {star} estrelas
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews list */}
              <div className="space-y-6">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <div key={review.id} className="border-b border-[rgba(0,0,0,0.06)] pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0066FF] text-white flex items-center justify-center" style={{ fontSize: 14, fontWeight: 600 }}>
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>{review.author}</p>
                            <p style={{ fontSize: 12, color: "#6B7280" }}>
                              {new Date(review.date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size={14} showCount={false} />
                      </div>
                      <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{review.title}</h4>
                      <p className="text-[#4B5563]" style={{ fontSize: 14, lineHeight: 1.6 }}>{review.comment}</p>
                      <button className="flex items-center gap-1.5 mt-3 text-[#6B7280] hover:text-[#0066FF] transition-colors cursor-pointer" style={{ fontSize: 12 }}>
                        <ThumbsUp size={14} />
                        Util ({review.helpful})
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[#6B7280] py-8" style={{ fontSize: 14 }}>
                    Nenhuma avaliacao com {reviewFilter} estrela{reviewFilter !== 1 ? "s" : ""}.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12 mb-8">
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
            Produtos Relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}