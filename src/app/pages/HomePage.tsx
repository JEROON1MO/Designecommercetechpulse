import { Link } from "react-router";
import { ArrowRight, Truck, Shield, Headphones, RotateCcw, Smartphone, Laptop, Cable, Home, ChevronRight, Star } from "lucide-react";
import { products, categories } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { HeroCarousel } from "../components/HeroCarousel";
import { PromoModal } from "../components/PromoModal";

const categoryIcons: Record<string, React.ReactNode> = {
  Smartphones: <Smartphone size={28} />,
  "Fones de Ouvido": <Headphones size={28} />,
  Notebooks: <Laptop size={28} />,
  Acessorios: <Cable size={28} />,
  "Smart Home": <Home size={28} />,
};

export function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const bestDeals = [...products].sort((a, b) => b.discount - a.discount).slice(0, 4);

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Promotional Popup Modal */}
      <PromoModal />

      {/* Benefits bar */}
      <section className="bg-white border-b border-[rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck size={22} />, title: "Frete Gratis", desc: "Acima de R$ 299" },
              { icon: <Shield size={22} />, title: "Compra Segura", desc: "Dados protegidos" },
              { icon: <RotateCcw size={22} />, title: "Troca Facil", desc: "Ate 30 dias" },
              { icon: <Headphones size={22} />, title: "Suporte 24h", desc: "Estamos aqui" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="text-[#0066FF]">{item.icon}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: "#6B7280" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>
              Categorias
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Encontre exatamente o que voce procura</p>
          </div>
          <Link
            to="/categoria/todos"
            className="hidden md:flex items-center gap-1 text-[#0066FF] hover:underline"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            Ver todas <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              className="group relative bg-white rounded-[12px] overflow-hidden border border-[rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  {categoryIcons[cat.name]}
                </div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600 }}>{cat.name}</p>
                <p style={{ fontSize: 12, opacity: 0.7 }}>{cat.count} produtos</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>
              Produtos em Destaque
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Os mais vendidos da semana</p>
          </div>
          <Link
            to="/categoria/todos"
            className="hidden md:flex items-center gap-1 text-[#0066FF] hover:underline"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            Ver todos <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best deals banner */}
      <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#EF4444] flex items-center justify-center">
              <Star size={20} className="text-white fill-white" />
            </div>
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>
                Maiores Descontos
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>Ofertas imperdíveis por tempo limitado</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-4 mb-16">
        <div
          className="max-w-7xl mx-auto rounded-[16px] px-8 py-12 md:py-16 text-center text-white overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #0066FF 0%, #0052CC 50%, #003D99 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 80%, rgba(0,217,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,217,255,0.15) 0%, transparent 50%)",
            }}
          />
          <div className="relative z-10">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800 }}>
              Primeira compra? Ganhe 10% OFF
            </h2>
            <p className="text-white/70 mt-3 max-w-lg mx-auto" style={{ fontSize: 15 }}>
              Use o cupom <span className="text-white bg-white/15 px-2 py-0.5 rounded" style={{ fontWeight: 700 }}>TECHPULSE10</span> na sua primeira compra e aproveite desconto exclusivo em todo o site.
            </p>
            <Link
              to="/categoria/todos"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-white text-[#0066FF] rounded-[10px] hover:bg-white/90 transition-colors"
              style={{ fontSize: 15, fontWeight: 700 }}
            >
              Aproveitar Desconto <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}