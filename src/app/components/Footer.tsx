import { useState } from "react";
import { Link } from "react-router";
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Youtube, Send } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="text-center md:text-left">
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700 }}>
                Fique por dentro das{" "}
                <span style={{ background: "linear-gradient(135deg, #0066FF, #00D9FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  novidades
                </span>
              </h3>
              <p className="text-white/60 mt-1" style={{ fontSize: 14 }}>
                Receba ofertas exclusivas e lancamentos em primeira mao.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex-1 w-full max-w-md">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/10 text-white placeholder:text-white/40 rounded-[10px] border border-white/10 focus:border-[#00D9FF] focus:outline-none transition-colors"
                  style={{ fontSize: 14 }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">Inscrever</span>
                </button>
              </div>
              {subscribed && (
                <p className="text-[#10B981] mt-2" style={{ fontSize: 13 }}>
                  Inscricao realizada com sucesso!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo size="md" />
            <p className="text-white/50 mt-4" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Sua loja de tecnologia favorita. Os melhores gadgets e eletronicos com os melhores precos do mercado.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0066FF] flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0066FF] flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0066FF] flex items-center justify-center transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0066FF] flex items-center justify-center transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600 }}>
              Institucional
            </h4>
            <ul className="space-y-2.5">
              {["Sobre Nos", "Trabalhe Conosco", "Politica de Privacidade", "Termos de Uso", "Blog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-[#00D9FF] transition-colors" style={{ fontSize: 13 }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600 }}>
              Ajuda
            </h4>
            <ul className="space-y-2.5">
              {["Central de Ajuda", "Como Comprar", "Formas de Pagamento", "Trocas e Devolucoes", "Fale Conosco"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-[#00D9FF] transition-colors" style={{ fontSize: 13 }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600 }}>
              Contato
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/50" style={{ fontSize: 13 }}>
                <MapPin size={16} className="shrink-0 mt-0.5" />
                Av. Paulista, 1578 - Bela Vista, Sao Paulo - SP
              </li>
              <li className="flex items-center gap-2 text-white/50" style={{ fontSize: 13 }}>
                <Phone size={16} className="shrink-0" />
                (11) 4002-8922
              </li>
              <li className="flex items-center gap-2 text-white/50" style={{ fontSize: 13 }}>
                <Mail size={16} className="shrink-0" />
                contato@techpulse.com.br
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40" style={{ fontSize: 12 }}>
            2026 TechPulse. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white/40" style={{ fontSize: 12 }}>Desenvolvido por:</span>
            <span className="font-['Inter',sans-serif]" style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.5px" }}>
              <span className="text-white">Jerônimo</span>
              <span className="text-[#166534]">.</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}