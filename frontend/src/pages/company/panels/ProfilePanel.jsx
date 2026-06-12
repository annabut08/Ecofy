import { useState, useEffect } from "react";
import { Loader } from "../components/CompanyTable";
import { companyApi } from "../../../api/companyApi";
import styles from "../company.module.css";

const FIELDS = [
  { key: "name",         label: "Назва компанії", type: "text"  },
  { key: "type",         label: "Тип діяльності", type: "text"  },
  { key: "edrpou",       label: "ЄДРПОУ",          type: "text"  },
  { key: "email",        label: "Email",            type: "email" },
  { key: "phone_number", label: "Телефон",          type: "tel"   },
  { key: "city",         label: "Місто",            type: "text"  },
  { key: "street",       label: "Вулиця",           type: "text"  },
  { key: "building",     label: "Будинок",          type: "text"  },
];

export default function ProfilePanel() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({});

  const clientId = localStorage.getItem("user_id");

  useEffect(() => {
    companyApi.getProfile(clientId)
      .then((r) => {
        setCompany(r.data);
        setForm({
          name:         r.data.name         || "",
          type:         r.data.type         || "",
          city:         r.data.city         || "",
          street:       r.data.street       || "",
          building:     r.data.building     || "",
          phone_number: r.data.phone_number || "",
          email:        r.data.email        || "",
          edrpou:       r.data.edrpou       || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [clientId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await companyApi.updateProfile(clientId, form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Профіль компанії</h2>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16, marginBottom: 32,
      }}>
        {[
          { icon: "🏢", label: "Назва",  value: company?.name          },
          { icon: "🏭", label: "Тип",    value: company?.type  || "—"  },
          { icon: "📋", label: "ЄДРПОУ", value: company?.edrpou || "—" },
          { icon: "📍", label: "Місто",  value: company?.city  || "—"  },
        ].map((c) => (
          <div key={c.label} style={{
            background: "#fff", borderRadius: 12, padding: "20px 24px",
            border: "1px solid #FDE68A",
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {c.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111", marginTop: 4 }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #FDE68A" }}>
        <h3 className={styles.formTitle} style={{ marginBottom: 24 }}>Редагувати дані</h3>
        <form onSubmit={handleSave}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16, marginBottom: 24,
          }}>
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  {f.label}
                </label>
                <input
                  className={styles.input}
                  type={f.type}
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
              <span style={{ color: "#41B87A", fontSize: 14, fontWeight: 600 }}>✓ Збережено</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}