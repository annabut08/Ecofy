import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    icon: "🗺️",
    title: "Знайди найближчий пункт",
    desc: "Інтерактивна карта показує всі контейнерні майданчики у твоєму місті з рівнем заповнення в реальному часі.",
  },
  {
    icon: "♻️",
    title: "Сортуй правильно",
    desc: "Поради по кожному типу відходів — скло, папір, пластик, метал. Зрозуміло і без зайвого.",
  },
  {
    icon: "🔔",
    title: "Будь в курсі",
    desc: "Сповіщення про нові майданчики та графік вивезення відходів у твоєму районі.",
  },
];

const STATS = [
  { value: "50+", label: "міст України" },
  { value: "1200+", label: "майданчиків" },
  { value: "15к+", label: "користувачів" },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={styles.root}>
      {/* NAV */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <span style={styles.logo}>🌿 Ecofy</span>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Можливості</a>
          <a href="#stats" style={styles.navLink}>Цифри</a>
          <a href="/login" style={styles.navLink}>Увійти</a>
          <a href="/register" style={styles.btnOutline}>Почати</a>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={styles.hero}>
        <div style={styles.heroLeaf}>🍃</div>
        <div style={styles.heroContent}>
          <p style={styles.eyebrow}>Для тих, хто думає про завтра</p>
          <h1 style={styles.heroTitle}>
            Переробляй<br />
            <span style={styles.accent}>розумно.</span>
          </h1>
          <p style={styles.heroSub}>
            Ecofy допомагає знаходити пункти прийому відходів, стежити за їх заповненістю
            та отримувати поради з сортування — все в одному місці.
          </p>
          <div style={styles.heroActions}>
            <a href="/register" style={styles.btnPrimary}>Спробувати безкоштовно</a>
            <a href="#features" style={styles.btnGhost}>Дізнатися більше ↓</a>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.mapCard}>
            <div style={styles.mapCardHeader}>
              <span style={styles.mapDot} />
              <span style={styles.mapCardTitle}>вул. Сумська, 12</span>
              <span style={styles.fillBadge}>45%</span>
            </div>
            <div style={styles.mapTags}>
              {["Скло", "Папір", "Пластик"].map((t) => (
                <span key={t} style={styles.tag}>{t}</span>
              ))}
            </div>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: "45%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" style={styles.statsSection}>
        {STATS.map((s) => (
          <div key={s.label} style={styles.statItem}>
            <span style={styles.statValue}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.features}>
        <h2 style={styles.sectionTitle}>Що вміє Ecofy</h2>
        <div style={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Готовий сортувати краще?</h2>
        <p style={styles.ctaSub}>Приєднуйся до тисяч людей, які вже роблять різницю.</p>
        <a href="/register" style={styles.btnPrimary}>Створити акаунт</a>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span>🌿 Ecofy © 2026</span>
        <span style={styles.footerSub}>Разом — чистіше майбутнє</span>
      </footer>
    </div>
  );
}

const GREEN = "#41B87A";
const BG = "#F7FBF8";
const TEXT = "#111111";
const MUTED = "#6B7280";

const styles = {
  root: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    background: BG,
    color: TEXT,
    minHeight: "100vh",
  },
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 48px",
    transition: "background 0.3s, box-shadow 0.3s",
    background: "transparent",
  },
  navScrolled: {
    background: "#ffffffee",
    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
    backdropFilter: "blur(8px)",
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    color: GREEN,
    letterSpacing: "-0.5px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 28,
  },
  navLink: {
    color: TEXT,
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 500,
    opacity: 0.75,
    transition: "opacity 0.2s",
  },
  btnOutline: {
    border: `1.5px solid ${GREEN}`,
    color: GREEN,
    borderRadius: 8,
    padding: "8px 20px",
    fontSize: 15,
    fontWeight: 600,
    textDecoration: "none",
    transition: "background 0.2s, color 0.2s",
  },
  hero: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "120px 48px 80px",
    gap: 48,
    position: "relative",
    overflow: "hidden",
  },
  heroLeaf: {
    position: "absolute",
    top: 80,
    right: 80,
    fontSize: 220,
    opacity: 0.06,
    pointerEvents: "none",
    userSelect: "none",
  },
  heroContent: {
    maxWidth: 560,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: GREEN,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: "clamp(48px, 6vw, 80px)",
    fontWeight: 900,
    lineHeight: 1.05,
    margin: "0 0 24px",
    letterSpacing: "-2px",
  },
  accent: {
    color: GREEN,
  },
  heroSub: {
    fontSize: 18,
    lineHeight: 1.65,
    color: MUTED,
    marginBottom: 40,
    maxWidth: 460,
  },
  heroActions: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
  },
  btnPrimary: {
    background: GREEN,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "14px 32px",
    fontSize: 16,
    fontWeight: 700,
    textDecoration: "none",
    cursor: "pointer",
    transition: "background 0.2s",
    display: "inline-block",
  },
  btnGhost: {
    color: MUTED,
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 500,
  },
  heroVisual: {
    flexShrink: 0,
  },
  mapCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 8px 40px rgba(65,184,122,0.15)",
    width: 280,
    border: "1px solid #E5F5EC",
  },
  mapCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  mapDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: GREEN,
    flexShrink: 0,
  },
  mapCardTitle: {
    fontWeight: 700,
    fontSize: 15,
    flex: 1,
  },
  fillBadge: {
    background: "#FFF3E0",
    color: "#F39C12",
    fontWeight: 700,
    fontSize: 13,
    borderRadius: 6,
    padding: "2px 8px",
  },
  mapTags: {
    display: "flex",
    gap: 6,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  tag: {
    background: "#E8F5E9",
    color: GREEN,
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 6,
    padding: "3px 10px",
  },
  progressTrack: {
    background: "#F0F0F0",
    borderRadius: 99,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    background: "#F39C12",
    height: "100%",
    borderRadius: 99,
  },
  statsSection: {
    display: "flex",
    justifyContent: "center",
    gap: 64,
    padding: "48px 48px",
    background: "#fff",
    borderTop: "1px solid #E5F5EC",
    borderBottom: "1px solid #E5F5EC",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 42,
    fontWeight: 900,
    color: GREEN,
    letterSpacing: "-1px",
  },
  statLabel: {
    fontSize: 14,
    color: MUTED,
    fontWeight: 500,
  },
  features: {
    padding: "96px 48px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: 900,
    marginBottom: 48,
    letterSpacing: "-1px",
    textAlign: "center",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },
  featureCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    border: "1px solid #E5F5EC",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.2s",
  },
  featureIcon: {
    fontSize: 36,
    marginBottom: 16,
    display: "block",
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 10,
    letterSpacing: "-0.3px",
  },
  featureDesc: {
    fontSize: 15,
    color: MUTED,
    lineHeight: 1.6,
  },
  cta: {
    background: GREEN,
    color: "#fff",
    textAlign: "center",
    padding: "96px 48px",
  },
  ctaTitle: {
    fontSize: 40,
    fontWeight: 900,
    marginBottom: 16,
    letterSpacing: "-1px",
  },
  ctaSub: {
    fontSize: 18,
    opacity: 0.85,
    marginBottom: 40,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 48px",
    background: "#fff",
    borderTop: "1px solid #E5F5EC",
    fontSize: 14,
    color: MUTED,
    flexWrap: "wrap",
    gap: 8,
  },
  footerSub: {
    opacity: 0.6,
  },
};