import Layout from "@/components/Layout";
import Reveal from "@/components/Reveal";
import PageSEO from "@/components/PageSEO";
import { Link } from "react-router-dom";
import { Camera, ArrowRight, ChevronRight, Loader2, Users, Target, Trophy, Calendar, MapPin } from "lucide-react";
import { useGallery, useSiteConfig, useTournaments, usePlayers } from "@/hooks/useSupabase";
import { useMemo } from "react";
import heroImage from "@/assets/hero-chess.jpg";
import tournamentImage from "@/assets/tournament.jpg";

const Index = () => {
  const { data: gallery, loading: galleryLoading } = useGallery(10);
  const { data: tournaments } = useTournaments();
  const { data: players } = usePlayers();
  const { get } = useSiteConfig();

  const nextTournament = useMemo(() =>
    tournaments
      .filter(t => !t.is_past)
      .sort((a, b) => (a.date_iso || a.date).localeCompare(b.date_iso || b.date))[0] ?? null,
  [tournaments]);

  const recentResults = useMemo(() =>
    tournaments
      .filter(t => t.is_past && t.extra_places && t.extra_places.length > 0)
      .sort((a, b) => (b.date_iso || b.date).localeCompare(a.date_iso || a.date))
      .slice(0, 3),
  [tournaments]);

  // ── Config depuis Supabase — fallbacks vides ou neutres ────────
  const clubName           = String(get('club_name',                ''));
  const heroTitle          = String(get('hero_title',               ''));
  const heroSub            = String(get('hero_subtitle',            ''));
  const founded            = String(get('club_founded',             ''));
  const members            = String(get('club_members',             ''));
  const teams              = String(get('club_teams',               ''));
  const aboutTitle         = String(get('about_hero_title',         ''));
  const tournamentsPerYear = String(get('club_tournaments_per_year',''));
  const heroImageUrl       = get('hero_image_url', null) as string | null;
  const presentationImageUrl = get('presentation_image_url', null) as string | null;

  // Premier paragraphe de l'histoire comme texte court sur l'accueil
  const storyParagraphs = get('about_story_paragraphs', []) as string[];
  const aboutTextShort  = Array.isArray(storyParagraphs) ? (storyParagraphs[0] || '') : '';

  const currentYear = new Date().getFullYear();
  const yearsExist  = founded ? currentYear - parseInt(founded) : null;

  const schedule      = (get('schedule',      []) as { day: string; hours: string }[]);
  const clubValues    = (get('values',        []) as { title: string; desc: string }[]);
  const testimonials  = (get('testimonials',  []) as { name: string; role: string; text: string }[]);
  const sponsors      = (get('sponsors',      []) as { name: string; logo_url?: string; url?: string }[]);

  // Stats dynamiques : compte réel depuis la DB
  const dynamicMembers    = players.length > 0 ? players.length.toString() : members;
  const pastTournamentsCount = tournaments.filter(t => t.is_past).length;
  const dynamicTournaments = pastTournamentsCount > 0 ? pastTournamentsCount.toString() : tournamentsPerYear;

  const clubAddress  = String(get('club_address', ''));
  const clubEmail    = String(get('club_email',   ''));
  const clubPhone    = String(get('club_phone',   ''));
  const socialFb     = String(get('social_facebook',  '') || '');
  const socialIg     = String(get('social_instagram', '') || '');
  const socialYt     = String(get('social_youtube',   '') || '');
  const clubDesc     = String(get('club_description', "Club d'échecs CSA Akbou à Akbou, Béjaïa. Tournois homologués, cours pour tous niveaux, compétitions officielles."));

  const sameAs = [
    'https://csa-akbou-chess.com',
    socialFb, socialIg, socialYt,
  ].filter(v => v && v !== 'null' && v.startsWith('http'));

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: clubName || 'CSA Akbou Chess',
    alternateName: "Club d'échecs CSA Akbou",
    url: 'https://csa-akbou-chess.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://csa-akbou-chess.com/og-image.jpg',
      width: 1200,
      height: 630,
    },
    image: 'https://csa-akbou-chess.com/og-image.jpg',
    sport: 'Chess',
    description: clubDesc,
    foundingDate: founded || undefined,
    email: clubEmail || undefined,
    telephone: clubPhone || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: clubAddress || undefined,
      addressLocality: 'Akbou',
      addressRegion: 'Béjaïa',
      addressCountry: 'DZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.4667,
      longitude: 4.5333,
    },
    sameAs,
  };

  return (
    <Layout>
      <PageSEO
        title="CSA Akbou Chess — Club d'échecs à Akbou, Béjaïa"
        description={clubDesc || "Club d'échecs CSA Akbou à Akbou, Béjaïa (Algérie). Tournois homologués FFE, cours pour débutants et compétiteurs, séances hebdomadaires."}
        path="/"
        ogImage="/og-home.jpg"
        jsonLd={homeJsonLd}
      />
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(var(--chess-blue-dark)) 0%, hsl(var(--chess-blue)) 60%, hsl(var(--chess-blue-mid)) 100%)" }}>
        <div className="absolute inset-0">
          <img src={heroImageUrl || heroImage} alt="" className="w-full h-full object-cover opacity-15 mix-blend-luminosity" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(var(--chess-blue-dark)/0.92), hsl(var(--chess-blue)/0.80) 55%, hsl(var(--chess-blue-mid)/0.65))" }} />
        </div>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(hsl(var(--chess-gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--chess-gold)) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--chess-gold)), transparent 70%)" }} />

        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-3xl">
            <Reveal>
              {(clubName || founded) && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border"
                  style={{ background: "hsl(var(--chess-gold)/0.12)", borderColor: "hsl(var(--chess-gold)/0.30)", color: "hsl(var(--chess-gold-light))" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsl(var(--chess-gold))" }} />
                  {clubName}{founded ? ` — depuis ${founded}` : ''}
                </div>
              )}
            </Reveal>
            <Reveal delay={100}>
              {heroTitle && (
                <h1 className="text-4xl sm:text-5xl font-bold leading-[1.08] text-white md:text-6xl lg:text-7xl text-balance mb-6">
                  {heroTitle}
                </h1>
              )}
            </Reveal>
            <Reveal delay={180}>
              {heroSub && (
                <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-10">{heroSub}</p>
              )}
            </Reveal>
            <Reveal delay={260}>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white transition-all hover:brightness-110 active:scale-95 shadow-lg"
                  style={{ background: "linear-gradient(135deg, hsl(var(--chess-gold-dark)), hsl(var(--chess-gold)))", boxShadow: "0 8px 24px -4px hsl(var(--chess-gold)/0.4)" }}>
                  S'inscrire au club <ChevronRight size={16} />
                </Link>
                <Link to="/tournois"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white transition-all hover:bg-white/15 active:scale-95 border border-white/20 backdrop-blur-sm">
                  Voir les tournois <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
            {(members || yearsExist || teams) && (
              <Reveal delay={380}>
                <div className="flex flex-wrap gap-8 mt-14">
                  {members && (
                    <div className="flex flex-col">
                      <span className="text-3xl font-display font-bold" style={{ color: "hsl(var(--chess-gold))" }}>{members}</span>
                      <span className="text-xs text-white/45 uppercase tracking-widest mt-0.5">Membres</span>
                    </div>
                  )}
                  {yearsExist && (
                    <div className="flex flex-col">
                      <span className="text-3xl font-display font-bold" style={{ color: "hsl(var(--chess-gold))" }}>{yearsExist}</span>
                      <span className="text-xs text-white/45 uppercase tracking-widest mt-0.5">Ans d'existence</span>
                    </div>
                  )}
                  {teams && (
                    <div className="flex flex-col">
                      <span className="text-3xl font-display font-bold" style={{ color: "hsl(var(--chess-gold))" }}>{teams}</span>
                      <span className="text-xs text-white/45 uppercase tracking-widest mt-0.5">Équipes</span>
                    </div>
                  )}
                </div>
              </Reveal>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--background)))" }} />
      </section>

      {/* ── PROCHAIN TOURNOI ── */}
      {nextTournament && (
        <section className="py-10 md:py-12 border-b" style={{ background: "hsl(var(--chess-gold)/0.04)", borderColor: "hsl(var(--chess-gold)/0.15)" }}>
          <div className="container">
            <Reveal>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border p-5 md:p-7 shadow-sm"
                style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--chess-gold)/0.3)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, hsl(var(--chess-gold-dark)), hsl(var(--chess-gold)))" }}>
                    <Trophy size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: "hsl(var(--chess-gold-dark))" }}>
                      Prochain tournoi
                    </p>
                    <h3 className="text-lg font-bold leading-tight">{nextTournament.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {nextTournament.date}</span>
                      {nextTournament.location && <span className="flex items-center gap-1"><MapPin size={12} /> {nextTournament.location}</span>}
                      {nextTournament.type && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border"
                          style={{ background: "hsl(var(--chess-blue)/0.07)", color: "hsl(var(--chess-blue))", borderColor: "hsl(var(--chess-blue)/0.18)" }}>
                          {nextTournament.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link to="/tournois"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:brightness-110 active:scale-95"
                  style={{ background: "linear-gradient(135deg, hsl(var(--chess-gold-dark)), hsl(var(--chess-gold)))" }}>
                  {nextTournament.registrations_closed ? 'Voir le tournoi' : "S'inscrire"} <ChevronRight size={14} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── PRÉSENTATION ── */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <Reveal direction="left">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl pointer-events-none"
                  style={{ background: "linear-gradient(135deg, hsl(var(--chess-blue)), hsl(var(--chess-gold)))" }} />
                <img src={presentationImageUrl || tournamentImage} alt="" className="relative rounded-2xl shadow-2xl w-full object-cover" style={{ aspectRatio: "4/3" }} />
                {yearsExist && (
                  <div className="absolute -bottom-5 -right-5 rounded-2xl px-5 py-3 shadow-xl"
                    style={{ background: "linear-gradient(135deg, hsl(var(--chess-gold-dark)), hsl(var(--chess-gold)))" }}>
                    <span className="text-3xl font-display font-bold text-white">{yearsExist}</span>
                    <span className="ml-1.5 text-sm text-white/80">ans d'existence</span>
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal direction="right">
              <div>
                {aboutTitle && (
                  <h2 className="text-4xl font-bold leading-tight md:text-5xl text-balance mb-6">{aboutTitle}</h2>
                )}
                {aboutTextShort && (
                  <p className="text-muted-foreground leading-relaxed mb-8">{aboutTextShort}</p>
                )}
                {/* Stats dynamiques */}
                {(dynamicMembers || dynamicTournaments || teams) && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {dynamicMembers && (
                      <div className="rounded-xl border p-3 sm:p-4 text-center" style={{ background: "hsl(var(--chess-blue)/0.04)", borderColor: "hsl(var(--chess-blue)/0.12)" }}>
                        <p className="text-lg sm:text-2xl font-display font-bold" style={{ color: "hsl(var(--chess-blue))" }}>{dynamicMembers}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Membres</p>
                      </div>
                    )}
                    {dynamicTournaments && (
                      <div className="rounded-xl border p-3 sm:p-4 text-center" style={{ background: "hsl(var(--chess-blue)/0.04)", borderColor: "hsl(var(--chess-blue)/0.12)" }}>
                        <p className="text-lg sm:text-2xl font-display font-bold" style={{ color: "hsl(var(--chess-blue))" }}>{dynamicTournaments}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Tournois joués</p>
                      </div>
                    )}
                    {teams && (
                      <div className="rounded-xl border p-3 sm:p-4 text-center" style={{ background: "hsl(var(--chess-blue)/0.04)", borderColor: "hsl(var(--chess-blue)/0.12)" }}>
                        <p className="text-lg sm:text-2xl font-display font-bold" style={{ color: "hsl(var(--chess-blue))" }}>{teams}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Équipes</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Horaires */}
                {Array.isArray(schedule) && schedule.length > 0 && (
                  <div className="mt-8 rounded-xl border p-4" style={{ background: "hsl(var(--chess-blue)/0.04)", borderColor: "hsl(var(--chess-blue)/0.12)" }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--chess-gold-dark))" }}>Horaires des séances</p>
                    <div className="space-y-2">
                      {schedule.map((h, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="font-medium">{h.day}</span>
                          <span className="text-muted-foreground">{h.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── AVANTAGES / VALEURS ── */}
      {(() => {
        const FALLBACK = [
          { icon: <Users    size={22} style={{ color: "hsl(var(--chess-gold))" }} />, title: "Communauté",  desc: "Joueurs de tous niveaux, du débutant au maître." },
          { icon: <Target   size={22} style={{ color: "hsl(var(--chess-gold))" }} />, title: "Progression", desc: "Cours, analyses et coaching pour progresser." },
          { icon: <Trophy   size={22} style={{ color: "hsl(var(--chess-gold))" }} />, title: "Compétition", desc: "Tournois internes et championnats toute l'année." },
          { icon: <Calendar size={22} style={{ color: "hsl(var(--chess-gold))" }} />, title: "Événements",  desc: "Simultanées, soirées thématiques et rencontres." },
        ];
        const CHESS_PIECES = ['♟', '♞', '♝', '♜'];
        const items = Array.isArray(clubValues) && clubValues.length > 0
          ? clubValues.map((v, i) => ({
              icon: <span className="font-display text-2xl leading-none" style={{ color: "hsl(var(--chess-gold))" }}>{CHESS_PIECES[i % 4]}</span>,
              title: v.title,
              desc: v.desc,
            }))
          : FALLBACK;
        const cols = items.length <= 3 ? `lg:grid-cols-${items.length}` : 'lg:grid-cols-4';
        return (
          <section className="py-24 md:py-32 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(var(--chess-blue-dark)), hsl(var(--chess-blue)))" }}>
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
            <div className="container relative">
              <Reveal>
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-white md:text-5xl">Pourquoi nous rejoindre</h2>
                </div>
              </Reveal>
              <div className={`grid gap-5 sm:grid-cols-2 ${cols}`}>
                {items.map((item, i) => (
                  <Reveal key={item.title} delay={i * 80}>
                    <div className="group rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 border"
                      style={{ background: "hsl(var(--chess-blue-mid)/0.4)", borderColor: "hsl(var(--chess-gold)/0.15)" }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                        style={{ background: "hsl(var(--chess-gold)/0.15)" }}>
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── TÉMOIGNAGES ── */}
      {Array.isArray(testimonials) && testimonials.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="container">
            <Reveal>
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1.5 rounded-full"
                  style={{ background: "hsl(var(--chess-gold)/0.1)", color: "hsl(var(--chess-gold-dark))" }}>
                  ♟ Ce que disent nos membres
                </div>
                <h2 className="text-4xl font-bold md:text-5xl">Ils nous ont rejoint</h2>
              </div>
            </Reveal>
            <div className={`grid gap-6 ${testimonials.length === 1 ? 'max-w-lg mx-auto' : testimonials.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {testimonials.map((t, i) => {
                const initials = t.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
                return (
                  <Reveal key={i} delay={i * 80}>
                    <div className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
                      style={{ borderColor: "hsl(var(--chess-silver-light)/0.5)" }}>
                      <p className="text-3xl leading-none" style={{ color: "hsl(var(--chess-gold)/0.5)" }}>❝</p>
                      <p className="text-sm leading-relaxed text-foreground/80 flex-1">{t.text}</p>
                      <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: "hsl(var(--chess-silver-light)/0.4)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ background: "linear-gradient(135deg, hsl(var(--chess-blue-dark)), hsl(var(--chess-blue)))" }}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{t.name}</p>
                          {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── GALERIE ── */}
      <section className="py-24 md:py-32">
        <div className="container">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1.5 rounded-full"
                  style={{ background: "hsl(var(--chess-gold)/0.1)", color: "hsl(var(--chess-gold-dark))" }}>
                  <Camera size={12} /> Au fil des séances
                </div>
                <h2 className="text-4xl font-bold">Nos derniers moments</h2>
              </div>
              <Link to="/realisations" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                style={{ color: "hsl(var(--chess-blue))" }}>
                Voir tout <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>

          {galleryLoading ? (
            <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin" style={{ color: "hsl(var(--chess-blue))" }} /></div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Camera size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune photo dans la galerie pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {gallery.slice(0, 10).map((photo, i) => (
                <Reveal key={photo.id} delay={i * 60}>
                  <div className="rounded-2xl border overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style={{ borderColor: "hsl(var(--chess-silver-light)/0.5)" }}>
                    <div className="relative h-28 overflow-hidden">
                      <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "linear-gradient(to top, hsl(var(--chess-blue-dark)/0.7), transparent)" }} />
                    </div>
                    {(photo.caption || photo.date_label) && (
                      <div className="px-3 py-2 bg-white">
                        {photo.caption && <p className="text-xs font-medium leading-tight line-clamp-1">{photo.caption}</p>}
                        {photo.date_label && <p className="text-[10px] mt-0.5" style={{ color: "hsl(var(--chess-silver))" }}>{photo.date_label}</p>}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-6 text-center md:hidden">
            <Link to="/realisations" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(var(--chess-blue))" }}>
              Voir toutes nos photos <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PALMARÈS RÉCENTS ── */}
      {recentResults.length > 0 && (
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="container">
            <Reveal>
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1.5 rounded-full"
                  style={{ background: "hsl(var(--chess-gold)/0.1)", color: "hsl(var(--chess-gold-dark))" }}>
                  <Trophy size={12} /> Nos champions
                </div>
                <h2 className="text-4xl font-bold md:text-5xl">Derniers palmarès</h2>
                <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm">Les performances récentes de nos compétiteurs.</p>
              </div>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentResults.map((t, i) => (
                <Reveal key={t.id} delay={i * 80}>
                  <div className="rounded-2xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    {t.fiches_techniques_urls?.[0] ? (
                      <div className="h-36 overflow-hidden shrink-0">
                        <img src={t.fiches_techniques_urls[0]} alt={t.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-20 shrink-0 flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, hsl(var(--chess-blue-dark)), hsl(var(--chess-blue)))" }}>
                        <Trophy size={28} className="text-white/30" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-muted-foreground mb-1">{t.date}</p>
                      <h3 className="font-bold text-base mb-4 line-clamp-2 leading-snug">{t.title}</h3>
                      <div className="space-y-2.5 mt-auto">
                        {t.extra_places!.slice(0, 3).map((p) => (
                          <div key={p.rank} className="flex items-center gap-3">
                            <span className="text-xl w-7 text-center shrink-0 leading-none">
                              {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : '🥉'}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate leading-tight">{p.name}</p>
                              {p.category && <p className="text-[11px] text-muted-foreground">{p.category}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/tournois" className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                style={{ color: "hsl(var(--chess-blue))" }}>
                Voir tous les tournois <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── SPONSORS ── */}
      {Array.isArray(sponsors) && sponsors.length > 0 && (
        <section className="py-12 border-t" style={{ borderColor: "hsl(var(--chess-silver-light)/0.4)" }}>
          <div className="container">
            <Reveal>
              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] mb-8 text-muted-foreground">
                Nos partenaires
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {sponsors.map((s, i) => (
                  <a key={i}
                    href={s.url || '#'}
                    target={s.url ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                    {s.logo_url
                      ? <img src={s.logo_url} alt={s.name} className="h-8 object-contain" />
                      : <span className="text-sm font-bold tracking-wide">{s.name}</span>
                    }
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

    </Layout>
  );
};

export default Index;
