import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from "lucide-react";
import { products } from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Slide {
  id: string;
  productId: string;
  label: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  gradient: string;
  overlayGradient: string;
  bgImage: string;
  productImage: string;
  ctaText: string;
  ctaLink: string;
  align: "left" | "right";
}

const heroSlides: Slide[] = [
  {
    id: "slide-1",
    productId: "2",
    label: "LANÇAMENTO",
    title: "Samsung Galaxy S24 Ultra",
    description: "Câmera de 200MP, Galaxy AI e corpo em titânio — o smartphone mais avançado da Samsung",
    price: 7199,
    originalPrice: 8499,
    discount: 15,
    gradient: "linear-gradient(135deg, #0A0E27 0%, #0D1B3E 40%, #0066FF20 100%)",
    overlayGradient: "linear-gradient(90deg, rgba(10,14,39,0.95) 0%, rgba(10,14,39,0.7) 50%, rgba(10,14,39,0.3) 100%)",
    bgImage: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYW1zdW5nJTIwR2FsYXh5JTIwc21hcnRwaG9uZSUyMGZsYWdzaGlwJTIwcHJvZHVjdCUyMGRhcmt8ZW58MXx8fHwxNzcxNjI1NDg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    productImage: products.find((p) => p.id === "2")?.image || "",
    ctaText: "Comprar Agora",
    ctaLink: "/produto/2",
    align: "left",
  },
  {
    id: "slide-2",
    productId: "1",
    label: "MAIS VENDIDO",
    title: "Sony WH-1000XM5",
    description: "O melhor cancelamento de ruído do mundo com som Hi-Res e 30h de bateria",
    price: 2299,
    originalPrice: 2999,
    discount: 23,
    gradient: "linear-gradient(135deg, #1A1A1A 0%, #0A0E27 40%, #0066FF10 100%)",
    overlayGradient: "linear-gradient(270deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.7) 50%, rgba(26,26,26,0.3) 100%)",
    bgImage: "https://images.unsplash.com/photo-1583305727488-61f82c7eae4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTb255JTIwcHJlbWl1bSUyMGhlYWRwaG9uZXMlMjBkYXJrJTIwbW9vZHklMjBwcm9kdWN0fGVufDF8fHx8MTc3MTYyNTQ4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    productImage: products.find((p) => p.id === "1")?.image || "",
    ctaText: "Comprar Agora",
    ctaLink: "/produto/1",
    align: "right",
  },
  {
    id: "slide-3",
    productId: "3",
    label: "ALTA PERFORMANCE",
    title: "Dell XPS 15",
    description: "Tela OLED 3.5K, Intel Core i9 e RTX 4070 para criadores e profissionais",
    price: 9499,
    originalPrice: 10999,
    discount: 14,
    gradient: "linear-gradient(135deg, #001133 0%, #00D9FF15 40%, #0066FF10 100%)",
    overlayGradient: "linear-gradient(90deg, rgba(0,17,51,0.95) 0%, rgba(0,17,51,0.7) 50%, rgba(0,17,51,0.3) 100%)",
    bgImage: "https://images.unsplash.com/photo-1575320854760-bfffc3550640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEZWxsJTIwWFBTJTIwbGFwdG9wJTIwd29ya3NwYWNlJTIwcHJlbWl1bSUyMGRhcmt8ZW58MXx8fHwxNzcxNjI1NDg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    productImage: products.find((p) => p.id === "3")?.image || "",
    ctaText: "Explorar",
    ctaLink: "/produto/3",
    align: "left",
  },
  {
    id: "slide-4",
    productId: "4",
    label: "AVENTURA",
    title: "Apple Watch Ultra 2",
    description: "Titânio aeroespacial, GPS dupla frequência e até 36h de bateria no seu pulso",
    price: 5399,
    originalPrice: 6299,
    discount: 14,
    gradient: "linear-gradient(135deg, #0066FF15 0%, #0A0E27 40%, #1A1A1A 100%)",
    overlayGradient: "linear-gradient(270deg, rgba(10,14,39,0.95) 0%, rgba(10,14,39,0.7) 50%, rgba(10,14,39,0.3) 100%)",
    bgImage: "https://images.unsplash.com/photo-1673997303871-178507ca875a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBcHBsZSUyMFdhdGNoJTIwc21hcnR3YXRjaCUyMHByb2R1Y3QlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzE2MjU0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    productImage: products.find((p) => p.id === "4")?.image || "",
    ctaText: "Comprar Agora",
    ctaLink: "/produto/4",
    align: "right",
  },
  {
    id: "slide-5",
    productId: "9",
    label: "OFERTA IMPERDÍVEL",
    title: "Apple AirPods Pro 2",
    description: "ANC 2x melhor, Áudio Espacial personalizado e USB-C — os earbuds definitivos",
    price: 1849,
    originalPrice: 2349,
    discount: 21,
    gradient: "linear-gradient(135deg, #00D9FF10 0%, #0066FF15 40%, #0A0E27 100%)",
    overlayGradient: "linear-gradient(90deg, rgba(10,14,39,0.95) 0%, rgba(10,14,39,0.7) 50%, rgba(10,14,39,0.3) 100%)",
    bgImage: "https://images.unsplash.com/photo-1760708825913-65a50b3dc39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwYWNjZXNzb3JpZXMlMjBjYWJsZXMlMjBjaGFyZ2VycyUyMHByb2R1Y3QlMjBkYXJrfGVufDF8fHx8MTc3MTYyNTQ4NXww&ixlib=rb-4.1.0&q=80&w=1080",
    productImage: products.find((p) => p.id === "9")?.image || "",
    ctaText: "Explorar",
    ctaLink: "/produto/9",
    align: "left",
  },
];

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  const totalSlides = heroSlides.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goToSlide((currentIndex + 1) % totalSlides);
  }, [currentIndex, totalSlides, goToSlide]);

  const prev = useCallback(() => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  }, [currentIndex, totalSlides, goToSlide]);

  // Autoplay
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
  }, [totalSlides]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const resetAutoplay = useCallback(() => {
    stopAutoplay();
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      if (!isPaused) startAutoplay();
    }, 3000);
  }, [stopAutoplay, startAutoplay, isPaused]);

  useEffect(() => {
    if (!isPaused) {
      startAutoplay();
    }
    return () => {
      stopAutoplay();
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, [isPaused, startAutoplay, stopAutoplay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        resetAutoplay();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        resetAutoplay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next, resetAutoplay]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    stopAutoplay();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleDotClick = (index: number) => {
    goToSlide(index);
    resetAutoplay();
  };

  const handlePrev = () => {
    prev();
    resetAutoplay();
  };

  const handleNext = () => {
    next();
    resetAutoplay();
  };

  // Touch/swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const currentSlide = heroSlides[currentIndex];

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(400px, 70vh, 100vh)" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Promoções em destaque"
      aria-roledescription="carousel"
    >
      {/* Slides */}
      {heroSlides.map((slide, index) => {
        const isActive = index === currentIndex;
        const isLeft = slide.align === "left";

        return (
          <div
            key={slide.id}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 2 : 1,
              transition: "opacity 600ms ease-in-out",
              pointerEvents: isActive ? "auto" : "none",
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} de ${totalSlides}: ${slide.title}`}
            aria-hidden={!isActive}
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <ImageWithFallback
                src={slide.bgImage}
                alt=""
                className="w-full h-full object-cover"
                loading={index <= 1 ? "eager" : "lazy"}
              />
            </div>

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: slide.gradient }}
            />
            <div
              className="absolute inset-0"
              style={{ background: slide.overlayGradient }}
            />

            {/* Decorative elements */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 80%, #0066FF22 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00D9FF18 0%, transparent 50%)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full ${
                  isLeft ? "" : "lg:[direction:rtl]"
                }`}
              >
                {/* Text content */}
                <div
                  className={`text-white ${isLeft ? "" : "lg:[direction:ltr]"}`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(30px)",
                    transition: "opacity 600ms ease 200ms, transform 600ms ease 200ms",
                  }}
                >
                  {/* Label badge */}
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      background: "linear-gradient(135deg, rgba(0,102,255,0.25), rgba(0,217,255,0.25))",
                      border: "1px solid rgba(0,217,255,0.35)",
                    }}
                  >
                    <Zap size={13} />
                    {slide.label}
                  </span>

                  {/* Title */}
                  <h1
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "clamp(28px, 5vw, 52px)",
                      fontWeight: 800,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {slide.title.split(" ").map((word, i) => {
                      const isHighlight = i >= slide.title.split(" ").length - 2;
                      return (
                        <span key={i}>
                          {isHighlight ? (
                            <span
                              style={{
                                background: "linear-gradient(135deg, #0066FF, #00D9FF)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              {word}
                            </span>
                          ) : (
                            word
                          )}{" "}
                        </span>
                      );
                    })}
                  </h1>

                  {/* Description */}
                  <p
                    className="text-white/60 mt-4 max-w-md"
                    style={{ fontSize: "clamp(14px, 2vw, 17px)", lineHeight: 1.7 }}
                  >
                    {slide.description}
                  </p>

                  {/* Price block */}
                  <div className="mt-5 flex items-center gap-4 flex-wrap">
                    <span
                      className="text-white/40 line-through"
                      style={{ fontSize: 18 }}
                    >
                      {formatPrice(slide.originalPrice)}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "clamp(28px, 4vw, 40px)",
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #0066FF, #00D9FF)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {formatPrice(slide.price)}
                    </span>
                    <span
                      className="px-3 py-1 rounded-lg"
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #00D9FF, #0066FF)",
                        color: "#fff",
                      }}
                    >
                      -{slide.discount}% OFF
                    </span>
                  </div>

                  {/* Installment */}
                  <p className="text-white/40 mt-2" style={{ fontSize: 13 }}>
                    ou 12x de{" "}
                    <span className="text-white/60" style={{ fontWeight: 600 }}>
                      {formatPrice(slide.price / 12)}
                    </span>{" "}
                    sem juros
                  </p>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row items-start gap-3 mt-7">
                    <Link
                      to={slide.ctaLink}
                      className="px-8 py-3.5 rounded-[10px] text-white flex items-center gap-2 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #0066FF, #0052CC)",
                        boxShadow: "0 4px 20px rgba(0,102,255,0.45)",
                      }}
                    >
                      {slide.ctaText}
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      to={`/categoria/${products.find((p) => p.id === slide.productId)?.categorySlug || "todos"}`}
                      className="px-8 py-3.5 rounded-[10px] text-white border border-white/20 hover:border-white/50 flex items-center gap-2 transition-all duration-200"
                      style={{ fontSize: 15, fontWeight: 500 }}
                    >
                      Ver Categoria
                    </Link>
                  </div>
                </div>

                {/* Product image */}
                <div
                  className={`relative flex items-center justify-center ${
                    isLeft ? "" : "lg:[direction:ltr]"
                  }`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateX(0) scale(1)" : "translateX(40px) scale(0.95)",
                    transition: "opacity 600ms ease 350ms, transform 600ms ease 350ms",
                  }}
                >
                  {/* Glow effect behind product */}
                  <div
                    className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px] rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(0,102,255,0.2) 0%, rgba(0,217,255,0.08) 50%, transparent 70%)",
                      filter: "blur(20px)",
                    }}
                  />
                  <ImageWithFallback
                    src={slide.productImage}
                    alt={slide.title}
                    className="relative z-10 w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] rounded-2xl object-cover"
                    style={{
                      filter: "drop-shadow(0 20px 50px rgba(0,102,255,0.35))",
                    }}
                    loading={index <= 1 ? "eager" : "lazy"}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows - hidden on mobile */}
      <button
        onClick={handlePrev}
        className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full transition-all duration-300 cursor-pointer"
        style={{
          background: "rgba(0,0,0,0.3)",
          color: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.6)";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.3)";
          e.currentTarget.style.color = "rgba(255,255,255,0.7)";
        }}
        aria-label="Slide anterior"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full transition-all duration-300 cursor-pointer"
        style={{
          background: "rgba(0,0,0,0.3)",
          color: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.6)";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.3)";
          e.currentTarget.style.color = "rgba(255,255,255,0.7)";
        }}
        aria-label="Próximo slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className="transition-all duration-300 cursor-pointer rounded-full"
            style={{
              width: index === currentIndex ? 28 : 10,
              height: 10,
              borderRadius: index === currentIndex ? 5 : "50%",
              background:
                index === currentIndex
                  ? "linear-gradient(135deg, #00D9FF, #0066FF)"
                  : "rgba(255,255,255,0.4)",
              boxShadow:
                index === currentIndex
                  ? "0 0 12px rgba(0,217,255,0.5)"
                  : "none",
              border: "none",
            }}
            aria-label={`Ir para slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : undefined}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/10">
        <div
          className="h-full"
          style={{
            width: `${((currentIndex + 1) / totalSlides) * 100}%`,
            background: "linear-gradient(90deg, #0066FF, #00D9FF)",
            transition: "width 600ms ease",
          }}
        />
      </div>
    </section>
  );
}