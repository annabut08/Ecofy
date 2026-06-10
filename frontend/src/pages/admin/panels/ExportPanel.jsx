import { adminApi } from "../../../api/adminApi";
import styles from "../admin.module.css";

const exportCSV = (data, filename) => {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(","),
    ...data.map((row) => keys.map((k) => `"${row[k] ?? ""}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

const EXPORTS = [
  { type: "users", icon: "👤", label: "Користувачі", desc: "Список всіх акаунтів", fn: () => adminApi.getUsers(), file: "users.csv" },
  { type: "sites", icon: "📍", label: "Майданчики", desc: "Контейнерні майданчики", fn: () => adminApi.getSites(), file: "sites.csv" },
  { type: "containers", icon: "🗑️", label: "Контейнери", desc: "Всі контейнери", fn: () => adminApi.getContainers(), file: "containers.csv" },
  { type: "tips", icon: "♻️", label: "Поради", desc: "Поради з сортування", fn: () => adminApi.getTips(), file: "tips.csv" },
];

export default function ExportPanel() {
  const handleExport = async (item) => {
    try {
      const res = await item.fn();
      exportCSV(res.data, item.file);
    } catch (err) {
      console.error("Помилка експорту:", err);
    }
  };

  return (
    <div>
      <h2 className={styles.panelTitle}>Експорт даних</h2>
      <p className={{ color: "#6B7280", marginBottom: 32 }}>
        Завантажте дані системи у форматі CSV.
      </p>
      <div className={styles.exportGrid}>
        {EXPORTS.map((e) => (
          <div key={e.type} className={styles.exportCard}>
            <div className={styles.exportIcon}>{e.icon}</div>
            <div className={styles.exportLabel}>{e.label}</div>
            <div className={styles.exportDesc}>{e.desc}</div>
            <button className={styles.btnPrimary} onClick={() => handleExport(e)}>
              Завантажити CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}