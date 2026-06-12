import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Th, Td, Loader, BadgeGreen, BadgeRed, BadgeYellow } from "../components/CompanyTable";
import styles from "../company.module.css";

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const STATUS_LABELS = {
  pending: "Очікує",
  approved: "Схвалено",
  rejected: "Відхилено",
  completed: "Завершено",
};

export default function RequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    waste_type: "Пластик",
    waste_description: "",
    amount_kg: "",
    organization_id: "",
  });

  const load = useCallback(() => {
    Promise.all([
      axios.get(`${API}/requests/`, { headers: getHeaders() }),
      axios.get(`${API}/organizations/`, { headers: getHeaders() }),
    ])
      .then(([reqRes, orgRes]) => {
        setRequests(reqRes.data);
        setOrganizations(orgRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(
        `${API}/requests/`,
        {
          waste_type: form.waste_type,
          waste_description: form.waste_description || null,
          amount_kg: Number(form.amount_kg),
          organization_id: Number(form.organization_id),
        },
        { headers: getHeaders() }
      );
      setForm({ waste_type: "Пластик", waste_description: "", amount_kg: "", organization_id: "" });
      load();
    } catch (err) {
      console.error("Помилка створення заявки:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити заявку?")) return;
    try {
      await axios.delete(`${API}/requests/${id}`, { headers: getHeaders() });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const label = STATUS_LABELS[status] || status;
    if (status === "approved" || status === "completed") return <BadgeGreen>{label}</BadgeGreen>;
    if (status === "rejected") return <BadgeRed>{label}</BadgeRed>;
    return <BadgeYellow>{label}</BadgeYellow>;
  };

  return (
    <div>
      <h2 className={styles.panelTitle}>Заявки на вивіз вторсировини</h2>

      <form onSubmit={handleAdd} className={styles.addForm}>
        <h3 className={styles.formTitle}>Нова заявка</h3>
        <div className={styles.formRow}>
          <select
            className={styles.input}
            value={form.waste_type}
            onChange={(e) => setForm({ ...form, waste_type: e.target.value })}
          >
            {["Пластик", "Скло", "Папір", "Метал", "Електроніка", "Інше"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <input
            className={styles.input}
            type="number"
            placeholder="Кількість (кг)"
            value={form.amount_kg}
            onChange={(e) => setForm({ ...form, amount_kg: e.target.value })}
            min="1"
            required
          />

          <select
            className={styles.input}
            value={form.organization_id}
            onChange={(e) => setForm({ ...form, organization_id: e.target.value })}
            required
          >
            <option value="">Оберіть організацію</option>
            {organizations.map((o) => (
              <option key={o.organization_id} value={o.organization_id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          className={styles.input}
          placeholder="Опис (необов'язково)"
          value={form.waste_description}
          onChange={(e) => setForm({ ...form, waste_description: e.target.value })}
          rows={2}
          style={{ resize: "vertical" }}
        />

        <button className={styles.btnPrimary} type="submit" disabled={saving}>
          {saving ? "Збереження..." : "Подати заявку"}
        </button>
      </form>

      {loading ? <Loader /> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Тип відходів</Th>
              <Th>Кількість</Th>
              <Th>Організація</Th>
              <Th>Статус</Th>
              <Th>Дата</Th>
              <Th>Дії</Th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>
                  Заявок поки немає. Подайте першу заявку вище.
                </td>
              </tr>
            ) : requests.map((r) => (
              <tr key={r.request_id} className={styles.tr}>
                <Td>{r.request_id}</Td>
                <Td>
                  <span className={styles.badgeGreen}>{r.waste_type}</span>
                </Td>
                <Td>{r.amount_kg} кг</Td>
                <Td>{r.organization_id}</Td>
                <Td>{getStatusBadge(r.status)}</Td>
                <Td>
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString("uk-UA")
                    : "—"}
                </Td>
                <Td>
                  {r.status === "pending" && (
                    <button
                      className={styles.btnDanger}
                      onClick={() => handleDelete(r.request_id)}
                    >
                      Скасувати
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}