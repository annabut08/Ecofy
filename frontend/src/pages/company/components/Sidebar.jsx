import { useTranslation } from "react-i18next";
import styles from "../company.module.css";
import LanguageSwitcher from "../../../components/common/LanguageSwitcher";

export default function Sidebar({ active, setActive, onLogout }) {
  const { t } = useTranslation();

  const MENU = [
    { id: "requests", label: "📋 " + (t("company.requests") || "Заявки") },
    { id: "stats", label: "📊 " + (t("company.stats") || "Статистика") },
    { id: "profile", label: "🏢 " + (t("company.profile") || "Профіль") },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>🌿 Ecofy Бізнес</div>
      <nav className={styles.sidebarNav}>
        {MENU.map((m) => (
          <button
            key={m.id}
            className={`${styles.sidebarItem} ${active === m.id ? styles.sidebarItemActive : ""}`}
            onClick={() => setActive(m.id)}
          >
            {m.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "0 12px", marginBottom: 12 }}>
        <LanguageSwitcher />
      </div>
      <button className={styles.logoutBtn} onClick={onLogout}>
        🚪 {t("common.logout") || "Вийти"}
      </button>
    </aside>
  );
}