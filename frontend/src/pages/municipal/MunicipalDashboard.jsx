// src/pages/municipal/MunicipalDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ── Sidebar ───────────────────────────────────────────────
const MENU = [
  { id: "overview", label: "📊 Огляд" },
  { id: "containers", label: "🗑️ Контейнери" },
  { id: "pickups", label: "🚚 Вивози" },
  { id: "devices", label: "⚡ Пристрої" },
  { id: "stats", label: "📈 Статистика" },
];

function Sidebar({ active, setActive, onLogout }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarLogo}>🌿 Ecofy Org</div>
      <nav style={styles.sidebarNav}>
        {MENU.map((m) => (
          <button
            key={m.id}
            style={{
              ...styles.sidebarItem,
              ...(active === m.id ? styles.sidebarItemActive : {}),
            }}
            onClick={() => setActive(m.id)}
          >
            {m.label}
          </button>
        ))}
      </nav>
      <button style={styles.logoutBtn} onClick={onLogout}>
        🚪 Вийти
      </button>
    </aside>
  );
}

// ── Overview ──────────────────────────────────────────────
function OverviewPanel() {
  const [stats, setStats] = useState(null);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/pickups/statistics`, { headers: getHeaders() }),
      axios.get(`${API}/container-sites/`, { headers: getHeaders() }),
    ])
      .then(([statsRes, sitesRes]) => {
        setStats(statsRes.data);
        setSites(sitesRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 style={styles.panelTitle}>Огляд</h2>
      <div style={styles.statsGrid}>
        <StatCard
          icon="📍"
          value={sites.length}
          label="Майданчиків"
          color="#41B87A"
        />
        <StatCard
          icon="🚚"
          value={stats?.total_pickups ?? 0}
          label="Вивозів всього"
          color="#2196F3"
        />
        <StatCard
          icon="✅"
          value={stats?.completed_pickups ?? 0}
          label="Завершених"
          color="#4CAF50"
        />
        <StatCard
          icon="⏳"
          value={(stats?.total_pickups ?? 0) - (stats?.completed_pickups ?? 0)}
          label="Заплановано"
          color="#F39C12"
        />
      </div>

      <h3 style={{ ...styles.panelTitle, fontSize: 18, marginTop: 32 }}>
        Мої майданчики
      </h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <Th>Адреса</Th>
            <Th>Вхід</Th>
            <Th>Координати</Th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s) => (
            <tr key={s.container_site_id} style={styles.tr}>
              <Td>{s.street}, {s.building}</Td>
              <Td>{s.entrance ?? "—"}</Td>
              <Td style={{ fontSize: 12, color: "#9E9E9E" }}>
                {s.location_lat}, {s.location_lng}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Containers ────────────────────────────────────────────
function ContainersPanel() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/containers/`, { headers: getHeaders() })
      .then((r) => setContainers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 style={styles.panelTitle}>Контейнери в реальному часі</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Тип</Th>
            <Th>Майданчик</Th>
            <Th>Заповнення</Th>
            <Th>Температура</Th>
            <Th>Нахил</Th>
            <Th>Статус</Th>
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <tr key={c.container_id} style={styles.tr}>
              <Td>{c.container_id}</Td>
              <Td>{c.type}</Td>
              <Td>{c.container_site_id}</Td>
              <Td>
                <div style={styles.progressWrap}>
                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressBar,
                        width: `${c.fill_level ?? 0}%`,
                        background:
                          c.fill_level >= 80
                            ? "#F39C12"
                            : c.fill_level >= 50
                            ? "#E5B93D"
                            : "#41B87A",
                      }}
                    />
                  </div>
                  <span style={styles.progressLabel}>{c.fill_level ?? 0}%</span>
                </div>
              </Td>
              <Td>{c.temperature != null ? `${c.temperature}°C` : "—"}</Td>
              <Td>
                <span style={c.tilted ? styles.badgeRed : styles.badgeGreen}>
                  {c.tilted ? "Нахилений" : "Норма"}
                </span>
              </Td>
              <Td>
                <span style={styles.badgeGreen}>{c.status}</span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Pickups ───────────────────────────────────────────────
function PickupsPanel() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    container_site_id: "",
    scheduled_time: "",
    vehicle_id: "",
  });
  const [saving, setSaving] = useState(false);

  const loadPickups = () => {
    setLoading(true);
    axios
      .get(`${API}/pickups/`, { headers: getHeaders() })
      .then((r) => setPickups(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

//   useEffect(() => { loadPickups(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(
        `${API}/pickups/`,
        {
          container_site_id: Number(form.container_site_id),
          scheduled_time: form.scheduled_time,
          vehicle_id: form.vehicle_id || null,
        },
        { headers: getHeaders() }
      );
      setForm({ container_site_id: "", scheduled_time: "", vehicle_id: "" });
      loadPickups();
    } catch (err) {
      console.error("Помилка створення вивозу:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(
        `${API}/pickups/${id}`,
        { completed_time: new Date().toISOString() },
        { headers: getHeaders() }
      );
      loadPickups();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити вивіз?")) return;
    await axios.delete(`${API}/pickups/${id}`, { headers: getHeaders() });
    loadPickups();
  };

  return (
    <div>
      <h2 style={styles.panelTitle}>Графік вивозів</h2>

      <form onSubmit={handleAdd} style={styles.addForm}>
        <h3 style={styles.formTitle}>Запланувати вивіз</h3>
        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="ID майданчика"
            type="number"
            value={form.container_site_id}
            onChange={(e) => setForm({ ...form, container_site_id: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="datetime-local"
            value={form.scheduled_time}
            onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Номер авто (необов'язково)"
            value={form.vehicle_id}
            onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
          />
        </div>
        <button style={styles.btnPrimary} type="submit" disabled={saving}>
          {saving ? "Збереження..." : "Запланувати"}
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Майданчик</Th>
              <Th>Заплановано</Th>
              <Th>Завершено</Th>
              <Th>Авто</Th>
              <Th>Дії</Th>
            </tr>
          </thead>
          <tbody>
            {pickups.map((p) => (
              <tr key={p.pickup_id} style={styles.tr}>
                <Td>{p.pickup_id}</Td>
                <Td>{p.container_site_id}</Td>
                <Td>{new Date(p.scheduled_time).toLocaleString("uk-UA")}</Td>
                <Td>
                  {p.completed_time ? (
                    <span style={styles.badgeGreen}>
                      {new Date(p.completed_time).toLocaleString("uk-UA")}
                    </span>
                  ) : (
                    <span style={styles.badgeYellow}>Очікується</span>
                  )}
                </Td>
                <Td>{p.vehicle_id ?? "—"}</Td>
                <Td>
                  <div style={{ display: "flex", gap: 8 }}>
                    {!p.completed_time && (
                      <button
                        style={styles.btnSuccess}
                        onClick={() => handleComplete(p.pickup_id)}
                      >
                        ✓ Завершити
                      </button>
                    )}
                    <button
                      style={styles.btnDanger}
                      onClick={() => handleDelete(p.pickup_id)}
                    >
                      Видалити
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Devices ───────────────────────────────────────────────
function DevicesPanel() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/devices/`, { headers: getHeaders() })
      .then((r) => setDevices(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 style={styles.panelTitle}>IoT Пристрої</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Назва</Th>
            <Th>Серійний номер</Th>
            <Th>Тип</Th>
            <Th>Батарея</Th>
            <Th>Контейнер</Th>
            <Th>Статус</Th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.device_id} style={styles.tr}>
              <Td>{d.device_id}</Td>
              <Td>{d.device_name}</Td>
              <Td style={{ fontSize: 12, color: "#9E9E9E" }}>
                {d.serial_number}
              </Td>
              <Td>{d.device_type}</Td>
              <Td>
                <div style={styles.progressWrap}>
                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressBar,
                        width: `${d.battery_level ?? 0}%`,
                        background:
                          d.battery_level <= 10
                            ? "#DC2626"
                            : d.battery_level <= 20
                            ? "#F39C12"
                            : "#41B87A",
                      }}
                    />
                  </div>
                  <span style={styles.progressLabel}>{d.battery_level ?? 0}%</span>
                </div>
              </Td>
              <Td>{d.container_id ?? "—"}</Td>
              <Td>
                <span
                  style={
                    d.status === "active" ? styles.badgeGreen : styles.badgeRed
                  }
                >
                  {d.status}
                </span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Statistics ────────────────────────────────────────────
function StatisticsPanel() {
  const [stats, setStats] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStats = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);

    axios
      .get(`${API}/pickups/statistics?${params}`, { headers: getHeaders() })
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

//   useEffect(() => { loadStats(); }, []);

  const exportCSV = () => {
    if (!stats) return;
    const csv = `Всього вивозів,Завершених\n${stats.total_pickups},${stats.completed_pickups}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pickup_statistics.csv";
    a.click();
  };

  return (
    <div>
      <h2 style={styles.panelTitle}>Статистика вивозів</h2>

      <div style={styles.filterRow}>
        <div>
          <label style={styles.label}>Від</label>
          <input
            style={styles.input}
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div>
          <label style={styles.label}>До</label>
          <input
            style={styles.input}
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <button style={styles.btnPrimary} onClick={loadStats}>
          Застосувати
        </button>
        <button style={styles.btnOutline} onClick={exportCSV}>
          📥 Експорт CSV
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : stats ? (
        <div style={styles.statsGrid}>
          <StatCard
            icon="🚚"
            value={stats.total_pickups}
            label="Всього вивозів"
            color="#2196F3"
          />
          <StatCard
            icon="✅"
            value={stats.completed_pickups}
            label="Завершених"
            color="#41B87A"
          />
          <StatCard
            icon="⏳"
            value={stats.total_pickups - stats.completed_pickups}
            label="Очікується"
            color="#F39C12"
          />
          <StatCard
            icon="📊"
            value={
              stats.total_pickups > 0
                ? `${Math.round((stats.completed_pickups / stats.total_pickups) * 100)}%`
                : "0%"
            }
            label="Виконання"
            color="#9C27B0"
          />
        </div>
      ) : null}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function MunicipalDashboard() {
  const [active, setActive] = useState("overview");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const panels = {
    overview: <OverviewPanel />,
    containers: <ContainersPanel />,
    pickups: <PickupsPanel />,
    devices: <DevicesPanel />,
    stats: <StatisticsPanel />,
  };

  return (
    <div style={styles.root}>
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} />
      <main style={styles.main}>{panels[active]}</main>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────
const Th = ({ children }) => <th style={styles.th}>{children}</th>;
const Td = ({ children, style }) => (
  <td style={{ ...styles.td, ...style }}>{children}</td>
);
const Loader = () => (
  <div style={{ padding: 40, color: "#9E9E9E", textAlign: "center" }}>
    Завантаження...
  </div>
);

function StatCard({ icon, value, label, color }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statIcon}>{icon}</span>
      <span style={{ ...styles.statValue, color }}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────
const GREEN = "#41B87A";

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "#F7FBF8",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  sidebar: {
    width: 240,
    background: "#fff",
    borderRight: "1px solid #E5F5EC",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  sidebarLogo: {
    fontSize: 18,
    fontWeight: 800,
    color: GREEN,
    padding: "0 24px 24px",
    borderBottom: "1px solid #E5F5EC",
    marginBottom: 16,
  },
  sidebarNav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "0 12px",
  },
  sidebarItem: {
    background: "none",
    border: "none",
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    color: "#374151",
    transition: "background 0.2s",
  },
  sidebarItemActive: {
    background: "#E8F5E9",
    color: GREEN,
    fontWeight: 700,
  },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "#DC2626",
    padding: "12px 24px",
    fontSize: 14,
    cursor: "pointer",
    textAlign: "left",
    fontWeight: 500,
  },
  main: {
    flex: 1,
    padding: 40,
    overflowY: "auto",
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: 900,
    marginBottom: 24,
    letterSpacing: "-0.5px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    border: "1px solid #E5F5EC",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  statIcon: { fontSize: 28 },
  statValue: {
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: "-1px",
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: 500,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  },
  th: {
    background: "#F9FAFB",
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #E5E7EB",
  },
  td: {
    padding: "14px 16px",
    fontSize: 14,
    color: "#111",
    borderBottom: "1px solid #F3F4F6",
  },
  tr: { transition: "background 0.15s" },
  badgeGreen: {
    background: "#E8F5E9",
    color: GREEN,
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 6,
    padding: "3px 10px",
    display: "inline-block",
  },
  badgeRed: {
    background: "#FEF2F2",
    color: "#DC2626",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 6,
    padding: "3px 10px",
    display: "inline-block",
  },
  badgeYellow: {
    background: "#FFF8E1",
    color: "#F39C12",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 6,
    padding: "3px 10px",
    display: "inline-block",
  },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    maxWidth: 100,
    background: "#F0F0F0",
    borderRadius: 99,
    height: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 99,
  },
  progressLabel: {
    fontSize: 12,
    color: "#6B7280",
    minWidth: 32,
  },
  addForm: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    border: "1px solid #E5F5EC",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 700,
    margin: 0,
  },
  formRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  filterRow: {
    display: "flex",
    gap: 16,
    alignItems: "flex-end",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    border: "1.5px solid #E5E7EB",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
    background: "#FAFAFA",
    fontFamily: "inherit",
    minWidth: 160,
  },
  btnPrimary: {
    background: GREEN,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  btnOutline: {
    background: "#fff",
    color: GREEN,
    border: `1.5px solid ${GREEN}`,
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  btnSuccess: {
    background: "#E8F5E9",
    color: GREEN,
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnDanger: {
    background: "#FEF2F2",
    color: "#DC2626",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
};