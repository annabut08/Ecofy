import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Loader } from "../components/UserTable";
import styles from "../user.module.css";

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function ProfilePanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({});

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    axios
      .get(`${API}/users/${userId}`, { headers: getHeaders() })
      .then((r) => {
        setUser(r.data);
        setForm({
          first_name: r.data.first_name || "",
          last_name: r.data.last_name || "",
          email: r.data.email || "",
          phone_number: r.data.phone_number || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await axios.put(`${API}/users/${userId}`, form, { headers: getHeaders() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const daysInEcofy = useMemo(() => {
    if (!user?.created_at) return 0;
    const now = new Date();
    const created = new Date(user.created_at);
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Мій профіль</h2>

      {/* Info cards */}
      <div className={styles.statsGrid} style={{ marginBottom: 32 }}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🌿</span>
          <span className={styles.statValue} style={{ color: "#41B87A", fontSize: 28 }}>
            {daysInEcofy}
          </span>
          <span className={styles.statLabel}>днів в Ecofy</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📍</span>
          <span className={styles.statValue} style={{ color: "#2196F3", fontSize: 20, letterSpacing: "-0.5px" }}>
            {user?.city_id ? `Місто #${user.city_id}` : "Не вказано"}
          </span>
          <span className={styles.statLabel}>Поточне місто</span>
        </div>
      </div>

      {/* Edit form */}
      <div style={{
        background: "#fff", borderRadius: 16, padding: 32,
        border: "1px solid #E5F5EC",
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: "#0D1F0D" }}>
          Редагувати профіль
        </h3>
        <form onSubmit={handleSave}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16, marginBottom: 24,
          }}>
            {[
              { key: "first_name", label: "Ім'я" },
              { key: "last_name", label: "Прізвище" },
              { key: "email", label: "Email", type: "email" },
              { key: "phone_number", label: "Телефон", type: "tel" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{
                  display: "block", fontSize: 13, fontWeight: 600,
                  color: "#374151", marginBottom: 6,
                }}>
                  {f.label}
                </label>
                <input
                  className={styles.input}
                  type={f.type || "text"}
                  value={form[f.key] || ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className={styles.btnPrimary} type="submit" disabled={saving}>
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
            {success && (
              <span style={{ color: "#41B87A", fontSize: 14, fontWeight: 600 }}>
                ✓ Збережено
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}