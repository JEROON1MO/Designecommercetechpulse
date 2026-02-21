import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { X, Percent, Copy, Check, Sparkles, Tag, Zap, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

const POPUP_STORAGE_KEY = "techpulse_popup_shown";
const POPUP_EXPIRY_KEY = "techpulse_popup_expiry";
const SCROLL_TRIGGER = 0.4; // 40%

function shouldShowPopup(): boolean {
  try {
    const shown = localStorage.getItem(POPUP_STORAGE_KEY);
    const expiry = localStorage.getItem(POPUP_EXPIRY_KEY);

    if (!shown || !expiry) return true;

    if (new Date().getTime() > parseInt(expiry, 10)) {
      localStorage.removeItem(POPUP_STORAGE_KEY);
      localStorage.removeItem(POPUP_EXPIRY_KEY);
      return true;
    }

    return false;
  } catch {
    return true;
  }
}

function savePopupShown(): void {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    expiryDate.setHours(0, 0, 0, 0);

    localStorage.setItem(POPUP_STORAGE_KEY, "true");
    localStorage.setItem(POPUP_EXPIRY_KEY, expiryDate.getTime().toString());
  } catch {}
}

export function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasTriggered = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const couponCode = "TECHPULSE10";

  // Scroll trigger
  useEffect(() => {
    if (!shouldShowPopup()) return;

    const handleScroll = () => {
      if (hasTriggered.current) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollPercentage = window.scrollY / scrollHeight;

      if (scrollPercentage >= SCROLL_TRIGGER) {
        hasTriggered.current = true;
        setIsOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus the close button when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    savePopupShown();
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleCTA = () => {
    handleClose();
    setTimeout(() => {
      navigate("/categoria/todos");
    }, 300);
  };

  const handleCopyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar código");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label="Promoção especial TechPulse"
        >
          <motion.div
            ref={modalRef}
            className="relative bg-white rounded-[16px] w-full overflow-hidden"
            style={{
              maxWidth: 480,
              maxHeight: "90vh",
              boxShadow: "0 10px 50px rgba(0,0,0,0.35)",
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: isClosing ? 0 : 1,
              scale: isClosing ? 0.9 : 1,
              y: isClosing ? 20 : 0,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>

            {/* Visual header section */}
            <div
              className="relative overflow-hidden flex flex-col items-center justify-center px-6 pt-10 pb-8"
              style={{
                background: "linear-gradient(135deg, #0066FF 0%, #00D9FF 100%)",
                minHeight: 200,
              }}
            >
              {/* Decorative circles */}
              <div
                className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
              />
              <div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
              />

              {/* Floating particles */}
              <motion.div
                className="absolute top-6 left-8"
                animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={18} className="text-white/30" />
              </motion.div>
              <motion.div
                className="absolute bottom-10 right-10"
                animate={{ y: [0, 8, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <Zap size={16} className="text-white/25" />
              </motion.div>

              {/* Badge */}
              <motion.span
                className="px-4 py-1.5 rounded-full mb-5 flex items-center gap-1.5"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  background: "#FF6B35",
                  color: "white",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
              >
                <Gift size={14} />
                OFERTA DO DIA
              </motion.span>

              {/* Animated icon */}
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Percent size={32} className="text-white" />
              </motion.div>

              {/* Headline in visual area */}
              <motion.p
                className="text-white text-center"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(14px, 3vw, 16px)",
                  fontWeight: 500,
                  opacity: 0.9,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Aproveite antes que acabe!
              </motion.p>
            </div>

            {/* Body content */}
            <div className="px-6 py-6 text-center">
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(22px, 5vw, 28px)",
                  fontWeight: 800,
                  color: "#1A1A1A",
                  lineHeight: 1.2,
                }}
              >
                Desconto de até{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #0066FF, #00D9FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  10% OFF
                </span>
              </h2>

              <p
                className="mt-2"
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#4B5563",
                }}
              >
                Em toda a loja TechPulse
              </p>

              <p
                className="mt-1.5"
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  lineHeight: 1.5,
                }}
              >
                Smartphones, notebooks, fones e muito mais com preços imperdíveis. Válido apenas hoje!
              </p>

              {/* Coupon code */}
              <div
                className="mt-5 mx-auto flex items-center justify-between gap-2 rounded-[10px] px-4 py-3"
                style={{
                  maxWidth: 280,
                  background: "#F0F4FF",
                  border: "2px dashed #0066FF40",
                }}
              >
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-[#0066FF]" />
                  <span
                    style={{
                      fontFamily: "'Poppins', monospace",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0066FF",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {couponCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyCoupon}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer hover:scale-[1.05]"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    background: copied ? "#10B981" : "#0066FF",
                    color: "white",
                  }}
                  aria-label="Copiar código de desconto"
                >
                  {copied ? (
                    <>
                      <Check size={13} />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copiar
                    </>
                  )}
                </button>
              </div>

              {/* Timer note */}
              <p className="mt-3" style={{ fontSize: 12, color: "#9CA3AF" }}>
                Oferta válida até as 23:59 de hoje
              </p>
            </div>

            {/* Footer CTA */}
            <div className="px-6 pb-6 flex flex-col gap-3">
              <button
                onClick={handleCTA}
                className="w-full py-3.5 rounded-[10px] text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #0066FF, #0052CC)",
                  boxShadow: "0 4px 20px rgba(0,102,255,0.35)",
                }}
              >
                <Sparkles size={18} />
                Aproveitar Oferta
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-[10px] text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F3F4F6] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                Não, obrigado
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
