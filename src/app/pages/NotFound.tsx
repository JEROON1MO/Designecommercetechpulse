import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 80, fontWeight: 800, color: "#0066FF", lineHeight: 1 }}>
        404
      </h1>
      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 600, color: "#1A1A1A", marginTop: 16 }}>
        Pagina nao encontrada
      </p>
      <p style={{ fontSize: 15, color: "#6B7280", marginTop: 8 }}>
        A pagina que voce esta procurando nao existe ou foi movida.
      </p>
      <Link
        to="/"
        className="inline-block mt-8 px-8 py-3 bg-[#0066FF] text-white rounded-[10px] hover:bg-[#0052CC] transition-colors"
        style={{ fontSize: 15, fontWeight: 600 }}
      >
        Voltar ao Inicio
      </Link>
    </div>
  );
}
