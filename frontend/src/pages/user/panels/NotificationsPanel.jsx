import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader } from "../components/UserTable";
import styles from "../user.module.css";

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function NotificationsPanel() {
  const [collection, setCollection] = useState([]);
  const [newSites, setNewSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("collection");

  const load = useCallback(() => {
    Promise.all([
      axios.get(`${API}/users/notifications/collection`, { headers: getHeaders() }),
      axios.get(`${API}/users/notifications/container-sites`, { headers: getHeaders() }),
    ])
      .then(([colRes, sitesRes]) => {
        setCollection(colRes.data);
        setNewSites(sitesRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  const current = tab === "collection" ? collection : newSites;

  return (
    <div>
      <h2 className={styles.panelTitle}>Сповіщення</h2>

      {/* Tabs */}
      <div className={styles.filterRow}>
        <button
          className={`${styles.categoryBtn} ${tab === "collection" ? styles.categoryBtnActive : ""}`}
          onClick={() => setTab("collection")}
        >
          🚚 Вивіз сміття ({collection.length})
        </button>
        <button
          className={`${styles.categoryBtn} ${tab === "sites" ? styles.categoryBtnActive : ""}`}
          onClick={() => setTab("sites")}
        >
          📍 Нові майданчики ({newSites.length})
        </button>
      </div>

      {current.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
          Сповіщень поки немає
        </div>
      ) : current.map((n, i) => (
        <div key={n.notification_id ?? i} className={styles.notifCard}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "#E8F5E9", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
          }}>
            {tab === "collection" ? "🚚" : "📍"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4 }}>
              {n.message}
            </div>
            {n.created_at && (
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                {new Date(n.created_at).toLocaleString("uk-UA")}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}