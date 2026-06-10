import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader, StatCard } from "../components/MunicipalTable";
import styles from "../municipal.module.css";

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function StatisticsPanel() {
  const [stats, setStats] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(() => {
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);

    axios
      .get(`${API}/pickups/statistics?${params}`, { headers: getHeaders() })
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [dateFrom, dateTo]);

  useEffect(() => { loadStats(); }, [loadStats]);

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
      <h2 className={styles.panelTitle}>Статистика вивозів</h2>

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

      {loading ? <Loader /> : stats ? (
        <div className={styles.statsGrid}>
          <StatCard icon="🚚" value={stats.total_pickups} label="Всього вивозів" color="#2196F3" />
          <StatCard icon="✅" value={stats.completed_pickups} label="Завершених" color="#41B87A" />
          <StatCard
            icon="⏳"
            value={stats.total_pickups - stats.completed_pickups}
            label="Очікується"
            color="#F39C12"
          />
          <StatCard
            icon="📊"
            value={stats.total_pickups > 0
              ? `${Math.round((stats.completed_pickups / stats.total_pickups) * 100)}%`
              : "0%"}
            label="Виконання"
            color="#9C27B0"
          />
        </div>
      ) : null}
    </div>
  );
}