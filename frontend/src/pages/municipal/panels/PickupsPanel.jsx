import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Th, Td, Loader, BadgeGreen, BadgeYellow } from "../components/MunicipalTable";
import styles from "../municipal.module.css";

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function PickupsPanel() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    container_site_id: "",
    scheduled_time: "",
    vehicle_id: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    axios.get(`${API}/pickups/`, { headers: getHeaders() })
      .then((r) => setPickups(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

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
      load();
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
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити вивіз?")) return;
    await axios.delete(`${API}/pickups/${id}`, { headers: getHeaders() });
    load();
  };

  return (
    <div>
      <h2 className={styles.panelTitle}>Графік вивозів</h2>

      <form onSubmit={handleAdd} className={styles.addForm}>
        <h3 className={styles.formTitle}>Запланувати вивіз</h3>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            placeholder="ID майданчика"
            type="number"
            value={form.container_site_id}
            onChange={(e) => setForm({ ...form, container_site_id: e.target.value })}
            required
          />
          <input
            className={styles.input}
            type="datetime-local"
            value={form.scheduled_time}
            onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
            required
          />
          <input
            className={styles.input}
            placeholder="Номер авто (необов'язково)"
            value={form.vehicle_id}
            onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
          />
        </div>
        <button className={styles.btnPrimary} type="submit" disabled={saving}>
          {saving ? "Збереження..." : "Запланувати"}
        </button>
      </form>

      {loading ? <Loader /> : (
        <table className={styles.table}>
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
              <tr key={p.pickup_id} className={styles.tr}>
                <Td>{p.pickup_id}</Td>
                <Td>{p.container_site_id}</Td>
                <Td>{new Date(p.scheduled_time).toLocaleString("uk-UA")}</Td>
                <Td>
                  {p.completed_time
                    ? <BadgeGreen>{new Date(p.completed_time).toLocaleString("uk-UA")}</BadgeGreen>
                    : <BadgeYellow>Очікується</BadgeYellow>}
                </Td>
                <Td>{p.vehicle_id ?? "—"}</Td>
                <Td>
                  <div className={styles.actions}>
                    {!p.completed_time && (
                      <button className={styles.btnSuccess} onClick={() => handleComplete(p.pickup_id)}>
                        ✓ Завершити
                      </button>
                    )}
                    <button className={styles.btnDanger} onClick={() => handleDelete(p.pickup_id)}>
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