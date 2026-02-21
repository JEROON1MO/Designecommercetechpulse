import { Link } from "react-router";
import { CheckCircle, Package, MapPin, Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function OrderConfirmation() {
  const orderNumber = `TP-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
      <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.06)] p-8 md:p-12 text-center">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #10B981, #059669)",
            boxShadow: "0 8px 30px rgba(16,185,129,0.3)",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            <CheckCircle size={48} className="text-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: "#1A1A1A" }}>
            Pedido Confirmado!
          </h1>
          <p className="text-[#6B7280] mt-2" style={{ fontSize: 15 }}>
            Obrigado pela sua compra! Seu pedido foi processado com sucesso.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 space-y-4"
        >
          {/* Order details */}
          <div className="bg-[#F8F9FA] rounded-[12px] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-2">
                <Package size={24} className="text-[#0066FF]" />
                <p className="text-[#6B7280]" style={{ fontSize: 12 }}>Numero do Pedido</p>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0066FF" }}>
                  {orderNumber}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Calendar size={24} className="text-[#0066FF]" />
                <p className="text-[#6B7280]" style={{ fontSize: 12 }}>Estimativa de Entrega</p>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>
                  {deliveryDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MapPin size={24} className="text-[#0066FF]" />
                <p className="text-[#6B7280]" style={{ fontSize: 12 }}>Status</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>
                  Pagamento Aprovado
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#F0F4FF] rounded-[12px] p-5">
            <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.6 }}>
              Enviamos um e-mail de confirmacao com todos os detalhes do seu pedido.
              Voce pode acompanhar o status da entrega a qualquer momento.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
        >
          <button
            className="w-full sm:w-auto px-6 py-3 rounded-[10px] text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
            style={{
              fontSize: 14,
              fontWeight: 600,
              background: "linear-gradient(135deg, #0066FF, #0052CC)",
              boxShadow: "0 4px 15px rgba(0,102,255,0.3)",
            }}
          >
            <Package size={18} />
            Rastrear Pedido
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-[10px] border border-[rgba(0,0,0,0.1)] flex items-center justify-center gap-2 hover:bg-[#F3F4F6] transition-colors text-[#1A1A1A]"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            Voltar a Homepage
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
