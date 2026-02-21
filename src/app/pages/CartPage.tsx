import { Link } from "react-router";
import { ChevronRight, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";
import { toast } from "sonner";

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useStore();
  const [shippingOption, setShippingOption] = useState("standard");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const shippingCosts: Record<string, { name: string; price: number; days: string }> = {
    express: { name: "Express", price: 29.9, days: "1-2 dias uteis" },
    standard: { name: "Padrao", price: 14.9, days: "5-8 dias uteis" },
    economic: { name: "Economico", price: 0, days: "10-15 dias uteis" },
  };

  const shipping = shippingCosts[shippingOption];
  const discount = couponApplied ? cartTotal * 0.1 : 0;
  const total = cartTotal + shipping.price - discount;

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "TECHPULSE10") {
      setCouponApplied(true);
      toast.success("Cupom TECHPULSE10 aplicado com sucesso!");
    } else if (coupon.trim()) {
      toast.error("Cupom invalido. Tente novamente.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F0F4FF] flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={32} className="text-[#0066FF]" />
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>
          Seu carrinho esta vazio
        </h1>
        <p className="text-[#6B7280] mt-2" style={{ fontSize: 15 }}>
          Explore nossos produtos e encontre o que voce precisa!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-[#0066FF] text-white rounded-[10px] hover:bg-[#0052CC] transition-colors"
          style={{ fontSize: 15, fontWeight: 600 }}
        >
          Explorar Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6" style={{ fontSize: 13, color: "#6B7280" }}>
        <Link to="/" className="hover:text-[#0066FF] transition-colors">Inicio</Link>
        <ChevronRight size={14} />
        <span className="text-[#1A1A1A]" style={{ fontWeight: 500 }}>Carrinho</span>
      </nav>

      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, color: "#1A1A1A", marginBottom: 24 }}>
        Carrinho de Compras
        <span className="text-[#6B7280] ml-2" style={{ fontSize: 16, fontWeight: 400 }}>
          ({cart.reduce((s, i) => s + i.quantity, 0)} {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? "item" : "itens"})
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-4 sm:p-5 flex gap-4"
            >
              <Link to={`/produto/${item.product.id}`} className="shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F0F1F3] rounded-[8px] overflow-hidden p-2 flex items-center justify-center">
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[#6B7280] uppercase tracking-wider" style={{ fontSize: 11 }}>
                      {item.product.brand}
                    </span>
                    <Link to={`/produto/${item.product.id}`}>
                      <h3 className="hover:text-[#0066FF] transition-colors" style={{ fontSize: 15, fontWeight: 600 }}>
                        {item.product.name}
                      </h3>
                    </Link>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer shrink-0 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-end justify-between mt-3 gap-4 flex-wrap">
                  <div className="flex items-center border border-[rgba(0,0,0,0.1)] rounded-[6px] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 h-8 flex items-center justify-center text-[#1A1A1A] border-x border-[rgba(0,0,0,0.1)]" style={{ fontSize: 14, fontWeight: 600 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right">
                    {item.product.originalPrice > item.product.price && (
                      <span className="text-[#9CA3AF] line-through mr-2" style={{ fontSize: 12 }}>
                        {formatPrice(item.product.originalPrice * item.quantity)}
                      </span>
                    )}
                    <span className="text-[#0066FF]" style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700 }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#0066FF] hover:underline mt-2"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            <ArrowRight size={16} className="rotate-180" />
            Continuar Comprando
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:w-[380px] shrink-0">
          <div className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-6 sticky top-[140px]">
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              Resumo do Pedido
            </h3>

            {/* Coupon */}
            <div className="mb-5">
              <label className="flex items-center gap-1.5 text-[#6B7280] mb-2" style={{ fontSize: 13 }}>
                <Tag size={14} />
                Cupom de desconto
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite seu cupom"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#F3F4F6] rounded-[8px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                  style={{ fontSize: 13 }}
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-[#1A1A1A] text-white rounded-[8px] hover:bg-[#333] transition-colors cursor-pointer shrink-0"
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  Aplicar
                </button>
              </div>
              {couponApplied && (
                <p className="text-[#10B981] mt-1.5" style={{ fontSize: 12 }}>
                  Cupom TECHPULSE10 aplicado! 10% de desconto
                </p>
              )}
            </div>

            {/* Shipping */}
            <div className="mb-5">
              <p className="text-[#6B7280] mb-2" style={{ fontSize: 13, fontWeight: 500 }}>Frete</p>
              <div className="space-y-2">
                {Object.entries(shippingCosts).map(([key, opt]) => (
                  <label
                    key={key}
                    className={`flex items-center justify-between p-3 rounded-[8px] border cursor-pointer transition-all ${
                      shippingOption === key
                        ? "border-[#0066FF] bg-[#F0F4FF]"
                        : "border-[rgba(0,0,0,0.06)] hover:border-[#0066FF]/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingOption === key}
                        onChange={() => setShippingOption(key)}
                        className="accent-[#0066FF]"
                      />
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{opt.name}</span>
                        <span className="text-[#6B7280] ml-1" style={{ fontSize: 11 }}>({opt.days})</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: opt.price === 0 ? "#10B981" : "#1A1A1A" }}>
                      {opt.price === 0 ? "Gratis" : formatPrice(opt.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-[rgba(0,0,0,0.06)] pt-4 space-y-3">
              <div className="flex justify-between" style={{ fontSize: 14 }}>
                <span className="text-[#6B7280]">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between" style={{ fontSize: 14 }}>
                <span className="text-[#6B7280]">Frete</span>
                <span style={{ color: shipping.price === 0 ? "#10B981" : undefined }}>
                  {shipping.price === 0 ? "Gratis" : formatPrice(shipping.price)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between" style={{ fontSize: 14 }}>
                  <span className="text-[#10B981]">Desconto (10%)</span>
                  <span className="text-[#10B981]">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-[rgba(0,0,0,0.06)]">
                <span style={{ fontSize: 16, fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0066FF" }}>
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-[10px] text-white transition-all duration-200 hover:scale-[1.01]"
              style={{
                fontSize: 15,
                fontWeight: 700,
                background: "linear-gradient(135deg, #0066FF, #0052CC)",
                boxShadow: "0 4px 15px rgba(0,102,255,0.3)",
              }}
            >
              Ir para Checkout
              <ArrowRight size={18} />
            </Link>

            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-[#10B981]" style={{ fontSize: 12 }}>🔒</span>
              <span className="text-[#6B7280]" style={{ fontSize: 12 }}>Compra 100% segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}