import { adminApi } from "../../../api/adminApi";
import styles from "../admin.module.css";

const COLUMN_LABELS = {
  user_id: "ID", first_name: "Ім'я", last_name: "Прізвище",
  patronymic: "По батькові", email: "Email", phone_number: "Телефон",
  city_id: "ID міста", created_at: "Дата реєстрації", status: "Статус",
  organization_id: "ID", name: "Назва", type: "Тип", city: "Місто",
  street: "Вулиця", building: "Будинок", edrpou: "ЄДРПОУ",
  container_site_id: "ID майданчика", location_lat: "Широта",
  location_lng: "Довгота", entrance: "Під'їзд", description: "Опис",
  container_id: "ID", capacity: "Місткість (л)", fill_level: "Заповнення %",
  last_update: "Оновлено", tip_id: "ID", title: "Заголовок",
  content: "Текст", category: "Категорія", is_published: "Опубліковано",
};

const formatValue = (key, value) => {
  if (value === null || value === undefined) return "";
  if (key === "status") return (value === true || value === "true" || value === "active") ? "Активний" : "Заблокований";
  if (key === "is_published") return value ? "Так" : "Ні";
  return String(value);
};

const exportCSV = (data, filename) => {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const headers = keys.map((k) => COLUMN_LABELS[k] ?? k);
  const rows = data.map((row) =>
    keys.map((k) => `"${formatValue(k, row[k]).replace(/"/g, '""')}"`).join(",")
  );
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + [headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

const EXPORTS = [
  { id: "users",      icon: "👤", label: "Користувачі",  desc: "Акаунти та статуси",      fn: () => adminApi.getUsers(),      file: "users.csv" },
  { id: "sites",      icon: "📍", label: "Майданчики",   desc: "Контейнерні локації",      fn: () => adminApi.getSites(),      file: "sites.csv" },
  { id: "containers", icon: "🗑️", label: "Контейнери",   desc: "Заповненість і статус",    fn: () => adminApi.getContainers(), file: "containers.csv" },
  { id: "tips",       icon: "♻️", label: "Поради",       desc: "Категорії та публікації",  fn: () => adminApi.getTips(),       file: "tips.csv" },
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
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Експорт даних</h2>
      </div>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24, marginTop: -8 }}>
        Оберіть дані для завантаження у форматі CSV
      </p>
      <div className={styles.exportGrid}>
        {EXPORTS.map((e) => (
          <div key={e.id} className={styles.exportCard}>
            <div className={styles.exportIconWrap}>
              <span className={styles.exportIconEmoji}>{e.icon}</span>
            </div>
            <div>
              <div className={styles.exportLabel}>{e.label}</div>
              <div className={styles.exportDesc}>{e.desc}</div>
            </div>
            <button className={styles.btnExport} onClick={() => handleExport(e)}>
              ↓ Завантажити CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}