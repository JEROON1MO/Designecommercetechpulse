import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronRight, CreditCard, QrCode, FileText, Check, ChevronLeft } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

interface AddressData {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface PaymentData {
  method: "credit" | "debit" | "pix" | "boleto";
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
}

export function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [sameAddress, setSameAddress] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [address, setAddress] = useState<AddressData>({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [payment, setPayment] = useState<PaymentData>({
    method: "credit",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const shipping = 14.9;
  const total = cartTotal + shipping;

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCepLookup = () => {
    if (address.cep.replace(/\D/g, "").length >= 8) {
      setAddress((prev) => ({
        ...prev,
        rua: "Rua Augusta",
        bairro: "Consolacao",
        cidade: "Sao Paulo",
        estado: "SP",
      }));
      toast.success("Endereco encontrado!");
    } else {
      toast.error("CEP invalido. Digite 8 digitos.");
    }
  };

  const handleConfirmOrder = () => {
    if (!agreedTerms) {
      toast.error("Aceite os termos para continuar.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      clearCart();
      navigate("/confirmacao");
    }, 1500);
  };

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  if (cart.length === 0 && step !== 3) {
    navigate("/carrinho");
    return null;
  }

  const stepLabels = ["Endereco", "Pagamento", "Revisao"];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6" style={{ fontSize: 13, color: "#6B7280" }}>
        <Link to="/" className="hover:text-[#0066FF] transition-colors">Inicio</Link>
        <ChevronRight size={14} />
        <Link to="/carrinho" className="hover:text-[#0066FF] transition-colors">Carrinho</Link>
        <ChevronRight size={14} />
        <span className="text-[#1A1A1A]" style={{ fontWeight: 500 }}>Checkout</span>
      </nav>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {stepLabels.map((label, i) => {
          const stepNum = (i + 1) as Step;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          return (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-[#10B981] text-white"
                      : isActive
                      ? "bg-[#0066FF] text-white"
                      : "bg-[#E5E7EB] text-[#9CA3AF]"
                  }`}
                  style={{ fontSize: 14, fontWeight: 700 }}
                >
                  {isCompleted ? <Check size={18} /> : stepNum}
                </div>
                <span
                  className={`mt-2 ${isActive ? "text-[#0066FF]" : isCompleted ? "text-[#10B981]" : "text-[#9CA3AF]"}`}
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mx-2 mb-6 ${
                    step > stepNum ? "bg-[#10B981]" : "bg-[#E5E7EB]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-6 lg:p-8">
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
                Endereco de Entrega
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                    CEP *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="00000-000"
                      maxLength={9}
                      value={address.cep}
                      onChange={(e) => setAddress({ ...address, cep: formatCep(e.target.value) })}
                      className="w-40 px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleCepLookup}
                      className="px-4 py-3 bg-[#1A1A1A] text-white rounded-[10px] hover:bg-[#333] transition-colors cursor-pointer"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      Buscar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                      Rua *
                    </label>
                    <input
                      type="text"
                      placeholder="Nome da rua"
                      value={address.rua}
                      onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                      Numero *
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={address.numero}
                      onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                    Complemento
                  </label>
                  <input
                    type="text"
                    placeholder="Apto, bloco, etc."
                    value={address.complemento}
                    onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                      Bairro *
                    </label>
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={address.bairro}
                      onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                      Cidade *
                    </label>
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={address.cidade}
                      onChange={(e) => setAddress({ ...address, cidade: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                      Estado *
                    </label>
                    <select
                      value={address.estado}
                      onChange={(e) => setAddress({ ...address, estado: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-2" style={{ fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={() => setSameAddress(!sameAddress)}
                    className="accent-[#0066FF] rounded w-4 h-4"
                  />
                  Endereco de cobranca e o mesmo de entrega
                </label>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 rounded-[10px] text-white transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #0066FF, #0052CC)",
                    boxShadow: "0 4px 15px rgba(0,102,255,0.3)",
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-6 lg:p-8">
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
                Metodo de Pagamento
              </h2>

              {/* Payment method tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { key: "credit" as const, icon: <CreditCard size={20} />, label: "Credito" },
                  { key: "debit" as const, icon: <CreditCard size={20} />, label: "Debito" },
                  { key: "pix" as const, icon: <QrCode size={20} />, label: "Pix" },
                  { key: "boleto" as const, icon: <FileText size={20} />, label: "Boleto" },
                ].map((pm) => (
                  <button
                    key={pm.key}
                    onClick={() => setPayment({ ...payment, method: pm.key })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-[10px] border-2 transition-all cursor-pointer ${
                      payment.method === pm.key
                        ? "border-[#0066FF] bg-[#F0F4FF] text-[#0066FF]"
                        : "border-[rgba(0,0,0,0.06)] hover:border-[#0066FF]/30 text-[#6B7280]"
                    }`}
                    style={{ fontSize: 13, fontWeight: 600 }}
                  >
                    {pm.icon}
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* Card form */}
              {(payment.method === "credit" || payment.method === "debit") && (
                <div className="space-y-5">
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                      Numero do Cartao *
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                      className="w-full px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                      Nome no Cartao *
                    </label>
                    <input
                      type="text"
                      placeholder="Nome como esta no cartao"
                      value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                        Validade *
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        value={payment.cardExpiry}
                        onChange={(e) => setPayment({ ...payment, cardExpiry: formatExpiry(e.target.value) })}
                        className="w-full px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                        CVV *
                      </label>
                      <input
                        type="text"
                        placeholder="000"
                        maxLength={4}
                        value={payment.cardCvv}
                        onChange={(e) => setPayment({ ...payment, cardCvv: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F3F4F6] rounded-[10px] border border-transparent focus:border-[#00D9FF] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {payment.method === "pix" && (
                <div className="text-center py-8">
                  <div className="w-48 h-48 bg-[#F3F4F6] rounded-[12px] mx-auto mb-4 flex items-center justify-center">
                    <QrCode size={80} className="text-[#6B7280]" />
                  </div>
                  <p style={{ fontSize: 14, color: "#6B7280" }}>
                    O QR Code sera gerado apos a confirmacao do pedido.
                  </p>
                  <p className="text-[#10B981] mt-2" style={{ fontSize: 14, fontWeight: 600 }}>
                    10% de desconto no Pix!
                  </p>
                </div>
              )}

              {payment.method === "boleto" && (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto mb-4 text-[#6B7280]" />
                  <p style={{ fontSize: 14, color: "#6B7280" }}>
                    O boleto sera gerado apos a confirmacao do pedido.
                  </p>
                  <p className="text-[#6B7280] mt-1" style={{ fontSize: 13 }}>
                    Vencimento em 3 dias uteis. A aprovacao pode levar ate 3 dias uteis.
                  </p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-6 py-3 border border-[rgba(0,0,0,0.1)] rounded-[10px] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                  style={{ fontSize: 14, fontWeight: 500 }}
                >
                  <ChevronLeft size={18} />
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-8 py-3 rounded-[10px] text-white transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #0066FF, #0052CC)",
                    boxShadow: "0 4px 15px rgba(0,102,255,0.3)",
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Order items */}
              <div className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-6">
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                  Itens do Pedido
                </h3>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#F0F1F3] rounded-[6px] overflow-hidden shrink-0 p-1.5 flex items-center justify-center">
                        <ImageWithFallback
                          src={item.product.image}
                          alt={item.product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: 14, fontWeight: 500 }}>{item.product.name}</p>
                        <p className="text-[#6B7280]" style={{ fontSize: 13 }}>Qtd: {item.quantity}</p>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address summary */}
              <div className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 600 }}>
                    Endereco de Entrega
                  </h3>
                  <button
                    onClick={() => setStep(1)}
                    className="text-[#0066FF] cursor-pointer"
                    style={{ fontSize: 13, fontWeight: 500 }}
                  >
                    Editar
                  </button>
                </div>
                <p style={{ fontSize: 14, color: "#4B5563" }}>
                  {address.rua || "Rua Augusta"}, {address.numero || "1500"}{address.complemento ? `, ${address.complemento}` : ""}
                </p>
                <p style={{ fontSize: 14, color: "#4B5563" }}>
                  {address.bairro || "Consolacao"} - {address.cidade || "Sao Paulo"}/{address.estado || "SP"}
                </p>
                <p style={{ fontSize: 14, color: "#4B5563" }}>CEP: {address.cep || "01310-100"}</p>
              </div>

              {/* Payment summary */}
              <div className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 600 }}>
                    Pagamento
                  </h3>
                  <button
                    onClick={() => setStep(2)}
                    className="text-[#0066FF] cursor-pointer"
                    style={{ fontSize: 13, fontWeight: 500 }}
                  >
                    Editar
                  </button>
                </div>
                <p style={{ fontSize: 14, color: "#4B5563" }}>
                  {payment.method === "credit" && "Cartao de Credito"}
                  {payment.method === "debit" && "Cartao de Debito"}
                  {payment.method === "pix" && "Pix"}
                  {payment.method === "boleto" && "Boleto Bancario"}
                  {(payment.method === "credit" || payment.method === "debit") && payment.cardNumber && (
                    <span className="ml-2">**** {payment.cardNumber.slice(-4)}</span>
                  )}
                </p>
              </div>

              {/* Terms */}
              <div className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-6">
                <label className="flex items-start gap-3 cursor-pointer" style={{ fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={() => setAgreedTerms(!agreedTerms)}
                    className="accent-[#0066FF] rounded w-4 h-4 mt-0.5 shrink-0"
                  />
                  <span className="text-[#4B5563]">
                    Li e concordo com os{" "}
                    <span className="text-[#0066FF] underline">Termos de Uso</span> e a{" "}
                    <span className="text-[#0066FF] underline">Politica de Privacidade</span> da TechPulse.
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-[rgba(0,0,0,0.1)] rounded-[10px] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                  style={{ fontSize: 14, fontWeight: 500 }}
                >
                  <ChevronLeft size={18} />
                  Voltar e Editar
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={isLoading || !agreedTerms}
                  className="flex items-center justify-center gap-2 px-10 py-3.5 rounded-[10px] text-white transition-all duration-200 hover:scale-[1.01] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    boxShadow: "0 4px 15px rgba(16,185,129,0.4)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Confirmar Pedido
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-[320px] shrink-0">
          <div className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-5 sticky top-[140px]">
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
              Resumo
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between" style={{ fontSize: 14 }}>
                <span className="text-[#6B7280]">
                  Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} itens)
                </span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between" style={{ fontSize: 14 }}>
                <span className="text-[#6B7280]">Frete</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[rgba(0,0,0,0.06)]">
                <span style={{ fontSize: 15, fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0066FF" }}>
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.06)]">
              {cart.slice(0, 3).map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 bg-[#F0F1F3] rounded overflow-hidden shrink-0 p-1 flex items-center justify-center">
                    <ImageWithFallback
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ fontSize: 12, fontWeight: 500 }}>{item.product.name}</p>
                    <p className="text-[#6B7280]" style={{ fontSize: 11 }}>x{item.quantity}</p>
                  </div>
                </div>
              ))}
              {cart.length > 3 && (
                <p className="text-[#6B7280] text-center mt-2" style={{ fontSize: 12 }}>
                  +{cart.length - 3} mais itens
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}