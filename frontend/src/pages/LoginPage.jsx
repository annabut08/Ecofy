// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = "https://ecofy-beta.vercel.app";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("username", form.email);
      params.append("password", form.password);

      const res = await axios.post(`${API}/auth/login`, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token } = res.data;
      localStorage.setItem("token", access_token);

      // Дістаємо userId з JWT
      const payload = JSON.parse(atob(access_token.split(".")[1]));
      localStorage.setItem("user_id", payload.sub);

      navigate("/dashboard");
    } catch (err) {
        const msg = err.response?.data?.detail;
        setError(typeof msg === "string" ? msg : "Невірний email або пароль");
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <div style={styles.logo}>🌿 Ecofy</div>
        <h1 style={styles.title}>Вхід</h1>
        <p style={styles.sub}>Раді бачити тебе знову</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Пароль</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Введіть пароль"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Завантаження..." : "Увійти"}
          </button>
        </form>

        <p style={styles.footer}>
          Немає акаунта?{" "}
          <Link to="/register" style={styles.link}>
            Зареєструватись
          </Link>
        </p>
      </div>
    </div>
  );
}

// Спільні стилі — додай в кінець обох файлів
const GREEN = "#41B87A";
const MUTED = "#6B7280";

const styles = {
  root: {
    minHeight: "100vh",
    background: "#F7FBF8",
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
    maxWidth: 420,
    boxShadow: "0 8px 40px rgba(65,184,122,0.12)",
    border: "1px solid #E5F5EC",
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    color: GREEN,
    marginBottom: 24,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: 900,
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
    textAlign: "center",
  },
  sub: {
    color: MUTED,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginTop: 8,
  },
  input: {
    border: "1.5px solid #E5E7EB",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 15,
    outline: "none",
    transition: "border 0.2s",
    background: "#FAFAFA",
  },
  btn: {
    background: GREEN,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "14px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 16,
    transition: "background 0.2s",
  },
  error: {
    background: "#FEF2F2",
    color: "#DC2626",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    marginBottom: 16,
    border: "1px solid #FECACA",
  },
  footer: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
    color: MUTED,
  },
  link: {
    color: GREEN,
    fontWeight: 600,
    textDecoration: "none",
  },
};