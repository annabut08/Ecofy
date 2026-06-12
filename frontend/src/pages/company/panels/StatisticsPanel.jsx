import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader, StatCard } from "../components/CompanyTable";
import styles from "../company.module.css";

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const WASTE_COLORS = {
  "Пластик": "#2196F3",
  "Скло": "#41B87A",
  "Папір": "#F39C12",
  "Метал": "#9C27B0",
  "Електроніка": "#F44336",
  "Інше": "#9CA3AF",
};

export default function StatisticsPanel() {
  const [stats, setStats] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true); 

  const loadStats = useCallback(() => {
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);

    axios
        .get(`${API}/requests/statistics?${params}`, { headers: getHeaders() })
        .then((r) => setStats(r.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [dateFrom, dateTo]);

useEffect(() => { loadStats(); }, [loadStats]);

  const totalKg = stats.reduce((s, i) => s + (i.total_amount_kg ?? 0), 0);
  const totalRequests = stats.reduce((s, i) => s + (i.total_requests ?? 0), 0);

  const exportCSV = () => {
    if (!stats.length) return;
    const rows = [
      "Тип відходів,Кількість заявок,Загальний обсяг (кг)",
      ...stats.map((s) => `${s.waste_type},${s.total_requests},${s.total_amount_kg ?? 0}`),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "waste_statistics.csv";
    a.click();
  };

  return (
    <div>
      <h2 className={styles.panelTitle}>Статистика зданих відходів</h2>

      <div className={styles.filterRow}>
        <div>
          <label className={styles.filterLabel}>Від</label>
          <input
            className={styles.input}
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div>
          <label className={styles.filterLabel}>До</label>
          <input
            className={styles.input}
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <button className={styles.btnPrimary} onClick={loadStats}>
          Застосувати
        </button>
        <button className={styles.btnOutline} onClick={exportCSV}>
          📥 Експорт CSV
        </button>
      </div>

      {loading ? <Loader /> : (
        <>
          {/* Загальна статистика */}
          <div className={styles.statsGrid} style={{ marginBottom: 32 }}>
            <StatCard icon="📦" value={totalRequests} label="Всього заявок" color="#2196F3" />
            <StatCard icon="⚖️" value={`${totalKg} кг`} label="Здано вторсировини" color="#41B87A" />
            <StatCard icon="♻️" value={stats.length} label="Типів відходів" color="#F39C12" />
          </div>

          {/* Таблиця по типах */}
          {stats.length > 0 ? (
            <>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                Розбивка по типах відходів
              </h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Тип відходів</th>
                    <th className={styles.th}>Кількість заявок</th>
                    <th className={styles.th}>Обсяг (кг)</th>
                    <th className={styles.th}>Частка</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => {
                    const color = WASTE_COLORS[s.waste_type] || "#9CA3AF";
                    const pct = totalKg > 0
                      ? Math.round(((s.total_amount_kg ?? 0) / totalKg) * 100)
                      : 0;
                    return (
                      <tr key={s.waste_type} className={styles.tr}>
                        <td className={styles.td}>
                          <span style={{
                            background: `${color}22`, color,
                            fontSize: 12, fontWeight: 700,
                            borderRadius: 6, padding: "3px 10px",
                            display: "inline-block",
                          }}>
                            {s.waste_type}
                          </span>
                        </td>
                        <td className={styles.td}>{s.total_requests}</td>
                        <td className={styles.td}>{s.total_amount_kg ?? 0} кг</td>
                        <td className={styles.td}>
                          <div className={styles.progressWrap}>
                            <div className={styles.progressTrack}>
                              <div
                                className={styles.progressBar}
                                style={{ width: `${pct}%`, background: color }}
                              />
                            </div>
                            <span className={styles.progressLabel}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
              Даних за обраний період немає.
            </div>
          )}
        </>
      )}
    </div>
  );
}