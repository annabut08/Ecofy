import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
    <div style={s.root}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>🟡 Ecofy Бізнес</div>
        <h1 style={s.title}>Реєстрація компанії</h1>

        {/* Stepper */}
        <div style={s.stepper}>
          {STEPS.map((st, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                ...s.stepDot,
                background: i <= step ? "#D97706" : "#E5E7EB",
                color: i <= step ? "#fff" : "#9CA3AF",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 13, fontWeight: i === step ? 700 : 400,
                color: i === step ? "#D97706" : "#9CA3AF",
              }}>
                {st.title}
              </span>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 32, height: 2, borderRadius: 99,
                  background: i < step ? "#D97706" : "#E5E7EB",
                  margin: "0 4px",
                }} />
              )}
            </div>
          ))}
        </div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <div style={s.fields}>
            {currentFields.map((key) => {
              const cfg = FIELDS_CONFIG[key];
              return (
                <div key={key}>
                  <label style={s.label}>{cfg.label}</label>
                  {cfg.type === "select" ? (
                    <select
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      style={s.input}
                    >
                      {cfg.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      style={s.input}
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
              <button type="button" style={s.btnBack} onClick={handleBack}>
                ← Назад
              </button>
            )}
            <button
              type="submit"
              style={s.btnPrimary}
              disabled={loading}
            >
              {step === STEPS.length - 1
                ? (loading ? "Реєстрація..." : "Зареєструватись")
                : "Далі →"}
            </button>
          </div>
        </form>

        <p style={s.footer}>
          Вже є акаунт?{" "}
          <Link to="/login" style={s.link}>Увійти</Link>
        </p>
        <p style={s.footer}>
          Реєстрація як користувач?{" "}
          <Link to="/register" style={s.link}>Звичайна реєстрація</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight: "100vh",
    background: "#FFFDF7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "48px 40px",
    width: "100%",
    maxWidth: 480,
    boxShadow: "0 8px 40px rgba(217,119,6,0.1)",
    border: "1px solid #FDE68A",
  },
  logo: {
    fontSize: 20, fontWeight: 800, color: "#D97706",
    marginBottom: 16, textAlign: "center",
  },
  title: {
    fontSize: 26, fontWeight: 900, margin: "0 0 24px",
    letterSpacing: "-0.5px", textAlign: "center", color: "#1C1C1C",
  },
  stepper: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 4, marginBottom: 28, flexWrap: "wrap",
  },
  stepDot: {
    width: 28, height: 28, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  fields: { display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 },
  label: {
    display: "block", fontSize: 13, fontWeight: 600,
    color: "#374151", marginBottom: 6,
  },
  input: {
    width: "100%", border: "1.5px solid #FDE68A",
    borderRadius: 10, padding: "11px 14px", fontSize: 15,
    outline: "none", background: "#FFFDF7", boxSizing: "border-box",
    fontFamily: "inherit", color: "#1C1C1C",
  },
  btnPrimary: {
    flex: 1, background: "#D97706", color: "#fff",
    border: "none", borderRadius: 10, padding: "13px",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
  },
  btnBack: {
    background: "#FEF3C7", color: "#D97706",
    border: "none", borderRadius: 10, padding: "13px 20px",
    fontSize: 15, fontWeight: 600, cursor: "pointer",
  },
  error: {
    background: "#FEF2F2", color: "#DC2626",
    borderRadius: 8, padding: "10px 14px",
    fontSize: 14, marginBottom: 16, border: "1px solid #FECACA",
  },
  footer: { textAlign: "center", marginTop: 16, fontSize: 14, color: "#6B7280" },
  link: { color: "#D97706", fontWeight: 600, textDecoration: "none" },
};