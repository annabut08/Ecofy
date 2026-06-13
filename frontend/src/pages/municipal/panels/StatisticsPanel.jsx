import { useState, useEffect } from "react";
import { Loader, StatCard } from "../components/MunicipalTable";
import { municipalApi } from "../api/municipalApi";
import { downloadCSV } from "../../admin/utils/csvExport";
import styles from "../municipal.module.css";

const STATS_LABELS = {
  total_pickups:    "Всього вивозів",
  completed_pickups:"Завершених",
  pending_pickups:  "Очікується",
  completion_rate:  "Виконання %",
  date_from:        "Період від",
  date_to:          "Період до",
};

export default function StatisticsPanel() {
  const [stats, setStats] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    municipalApi.getPickupStatistics(dateFrom, dateTo)
      .then((r) => { if (!cancelled) setStats(r.data); })
      .catch(console.error);
    return () => { cancelled = true; };
  }, [trigger]);

  const handleApply = () => {
    setStats(null);
    setTrigger((t) => t + 1);
  };

  const handleExport = () => {
    if (!stats) return;
    const pending = stats.total_pickups - stats.completed_pickups;
    const rate = stats.total_pickups > 0
      ? Math.round((stats.completed_pickups / stats.total_pickups) * 100) : 0;

    downloadCSV([{
      total_pickups:     stats.total_pickups,
      completed_pickups: stats.completed_pickups,
      pending_pickups:   pending,
      completion_rate:   `${rate}%`,
      date_from:         dateFrom || "—",
      date_to:           dateTo   || "—",
    }], "pickup_statistics.csv", STATS_LABELS);
  };

  return (
    <div>
      <h2 className={styles.panelTitle}>Статистика вивозів</h2>

      <div className={styles.filterRow}>
        <div>
          <label className={styles.filterLabel}>Від</label>
          <input className={styles.input} type="date" value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div>
          <label className={styles.filterLabel}>До</label>
          <input className={styles.input} type="date" value={dateTo}
            onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button className={styles.btnPrimary} onClick={handleApply}>Застосувати</button>
        <button className={styles.btnOutline} onClick={handleExport} disabled={!stats}>
          📥 Експорт CSV
        </button>
      </div>

      {!stats ? <Loader /> : (
        <div className={styles.statsGrid}>
          <StatCard icon="🚚" value={stats.total_pickups}      label="Всього вивозів" color="#2196F3" />
          <StatCard icon="✅" value={stats.completed_pickups}  label="Завершених"     color="#41B87A" />
          <StatCard icon="⏳" value={stats.total_pickups - stats.completed_pickups} label="Очікується" color="#F39C12" />
          <StatCard icon="📊"
            value={stats.total_pickups > 0
              ? `${Math.round((stats.completed_pickups / stats.total_pickups) * 100)}%`
              : "0%"}
            label="Виконання" color="#9C27B0" />
        </div>
      )}
    </div>
  );
}