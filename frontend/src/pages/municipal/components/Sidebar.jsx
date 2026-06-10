import styles from "../municipal.module.css";

const MENU = [
  { id: "overview", label: "📊 Огляд" },
  { id: "containers", label: "🗑️ Контейнери" },
  { id: "pickups", label: "🚚 Вивози" },
  { id: "devices", label: "⚡ Пристрої" },
  { id: "stats", label: "📈 Статистика" },
];

export default function Sidebar({ active, setActive, onLogout }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>🌿 Ecofy Org</div>
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