import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteConfig } from "@/lib/SiteConfigContext";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const WhatsAppFloatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { get } = useSiteConfig();
  const whatsappRaw = String(get('social_whatsapp', ''));

  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  let whatsappHref: string | null = null;
  if (whatsappRaw && whatsappRaw !== 'null' && whatsappRaw !== '') {
    const base = whatsappRaw.startsWith('http')
      ? whatsappRaw
      : `https://wa.me/${whatsappRaw.replace(/\D/g, '')}`;
    const sep = base.includes('?') ? '&' : '?';
    whatsappHref = base + sep + 'text=' + encodeURIComponent('Bonjour, je souhaite rejoindre le CSA Akbou Chess !');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20 animate-in fade-in duration-200">{children}</main>
      <Footer />
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rejoindre le club sur WhatsApp"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 select-none"
          style={{ background: "#25D366", boxShadow: "0 8px 24px -4px rgba(37,211,102,0.55)" }}
        >
          <WhatsAppFloatIcon />
          <span className="hidden sm:inline">Rejoindre le club</span>
        </a>
      )}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Retour en haut"
          className="fixed z-50 flex items-center justify-center w-10 h-10 rounded-full text-white transition-all hover:scale-110 active:scale-95"
          style={{
            bottom: whatsappHref ? '5.5rem' : '1.5rem',
            right: '1.5rem',
            background: "hsl(var(--chess-blue))",
            boxShadow: "0 4px 16px -4px hsl(var(--chess-blue)/0.5)",
          }}
        >
          <ChevronUp size={18} />
        </button>
      )}
    </div>
  );
};

export default Layout;
