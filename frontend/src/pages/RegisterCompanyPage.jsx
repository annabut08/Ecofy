import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "./RegisterCompanyPage.module.css";

const API = "https://ecofy-beta.vercel.app";

const STEPS = [
  { title: "Основна інформація", fields: ["name", "type", "edrpou"] },
  { title: "Контактні дані", fields: ["email", "phone_number", "city", "street", "building"] },
  { title: "Пароль", fields: ["password", "confirm_password"] },
];

const FIELDS_CONFIG = {
  name: { label: "Назва компанії", type: "text", placeholder: "ТОВ Екологія Плюс" },
  type: { label: "Тип діяльності", type: "select", options: ["ОСББ", "Приватна компанія", "Державне підприємство", "ФОП", "Інше"] },
  edrpou: { label: "ЄДРПОУ", type: "text", placeholder: "12345678" },
  email: { label: "Email", type: "email", placeholder: "info@company.ua" },
  phone_number: { label: "Телефон", type: "tel", placeholder: "+38 (050) 123-45-67" },
  city: { label: "Місто", type: "text", placeholder: "Харків" },
  street: { label: "Вулиця", type: "text", placeholder: "вул. Сумська" },
  building: { label: "Будинок", type: "text", placeholder: "12" },
  password: { label: "Пароль", type: "password", placeholder: "Мінімум 6 символів" },
  confirm_password: { label: "Підтвердіть пароль", type: "password", placeholder: "Повторіть пароль" },
};

export default function RegisterCompanyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", type: "ОСББ", edrpou: "",
    email: "", phone_number: "", city: "", street: "", building: "",
    password: "", confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep = () => {
    const fields = STEPS[step].fields;
    for (const f of fields) {
      if (!form[f]) {
        setError(`Заповніть поле: ${FIELDS_CONFIG[f].label}`);
        return false;
      }
    }
    if (step === 0 && form.edrpou.length !== 8) {
      setError("ЄДРПОУ має містити 8 цифр");
      return false;
    }
    if (step === 2 && form.password !== form.confirm_password) {
      setError("Паролі не співпадають");
      return false;
    }
    if (step === 2 && form.password.length < 6) {
      setError("Пароль має бути мінімум 6 символів");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      await axios.post(`${API}/client-companies/register`, {
        name: form.name,
        type: form.type,
        edrpou: form.edrpou,
        email: form.email,
        phone_number: form.phone_number,
        city: form.city,
        street: form.street,
        building: form.building,
        password: form.password,
      });
      navigate("/login", { state: { email: form.email, registered: true } });
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Помилка реєстрації");
    } finally {
      setLoading(false);
    }
  };

  const currentFields = STEPS[step].fields;

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>🟡 Ecofy Бізнес</div>
        <h1 style={styles.title}>Реєстрація компанії</h1>

        {/* Stepper */}
        <div style={styles.stepper}>
        {STEPS.map((st, i) => (
          <div key={i} style={styles.stepItem}>
            <div
              style={{
                ...styles.stepDot,
                background: i <= step ? "#D97706" : "#E5E7EB",
                color: i <= step ? "#fff" : "#9CA3AF",
              }}
            >
              {i < step ? "✓" : i + 1}
            </div>

            <span
              style={{
                ...styles.stepLabel,
                color: i === step ? "#D97706" : "#9CA3AF",
                fontWeight: i === step ? 700 : 500,
              }}
            >
              {st.title}
            </span>
          </div>
        ))}
      </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <div style={styles.fields}>
            {currentFields.map((key) => {
              const cfg = FIELDS_CONFIG[key];
              return (
                <div key={key}>
                  <label style={styles.label}>{cfg.label}</label>
                  {cfg.type === "select" ? (
                    <select
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      style={styles.input}
                    >
                      {cfg.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      style={styles.input}
                      type={cfg.type}
                      name={key}
                      placeholder={cfg.placeholder}
                      value={form[key]}
                      onChange={handleChange}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {step > 0 && (
              <button type="button" style={styles.btnBack} onClick={handleBack}>
                ← Назад
              </button>
            )}
            <button
              type="submit"
              style={styles.btnPrimary}
              disabled={loading}
            >
              {step === STEPS.length - 1
                ? (loading ? "Реєстрація..." : "Зареєструватись")
                : "Далі →"}
            </button>
          </div>
        </form>

        <p style={styles.footer}>
          Вже є акаунт?{" "}
          <Link to="/login" style={styles.link}>Увійти</Link>
        </p>
        <p style={styles.footer}>
          Реєстрація як користувач?{" "}
          <Link to="/register" style={styles.link}>Звичайна реєстрація</Link>
        </p>
      </div>
    </div>
  );
}

