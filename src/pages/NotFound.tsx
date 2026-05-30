import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 — route inexistante :", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center justify-center py-24"
        style={{ background: "linear-gradient(160deg, hsl(var(--chess-blue-dark)) 0%, hsl(var(--chess-blue)) 100%)" }}>
        <div className="container text-center text-white">
          <div className="mb-8 select-none" style={{ fontSize: "clamp(5rem, 20vw, 9rem)", lineHeight: 1, filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.4))" }}>
            ♚
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "hsl(var(--chess-gold))" }}>
            Erreur 404
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Roi renversé</h1>
          <p className="text-white/55 max-w-sm mx-auto mb-10 leading-relaxed">
            Cette page n'existe pas — comme un coup illégal, elle a été annulée.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: "linear-gradient(135deg, hsl(var(--chess-gold-dark)), hsl(var(--chess-gold)))" }}>
              <Home size={16} /> Accueil
            </Link>
            <button onClick={() => history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white/80 transition-all hover:text-white hover:bg-white/10 active:scale-95 border border-white/20">
              <ArrowLeft size={16} /> Retour
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
