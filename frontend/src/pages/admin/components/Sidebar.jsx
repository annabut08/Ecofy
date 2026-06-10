import styles from "../admin.module.css";

const MENU = [
  { id: "users", label: "👤 Користувачі" },
  { id: "organizations", label: "🏢 Організації" },
  { id: "sites", label: "📍 Майданчики" },
  { id: "containers", label: "🗑️ Контейнери" },
  { id: "tips", label: "♻️ Поради" },
  { id: "notifications", label: "🔔 Сповіщення" },
  { id: "export", label: "📥 Експорт" },
];

export default function Sidebar({ active, setActive, onLogout }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>🌿 Ecofy Admin</div>
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
      <button className={styles.logoutBtn} onClick={onLogout}>
        🚪 Вийти
      </button>
    </aside>
  );
}