import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "./login/login.module.css";

const API = "https://ecofy-beta.vercel.app";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Паролі не співпадають");
      return;
    }
    if (form.password.length < 6) {
      setError("Пароль має бути мінімум 6 символів");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/users/register`, {
        first_name: form.first_name,
        last_name: "",
        email: form.email,
        password: form.password,
      });

      navigate("/login", { state: { email: form.email } });
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(
        typeof msg === "string" ? msg : "Помилка реєстрації. Спробуй ще раз."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <div style={styles.logo}>🌿 Ecofy</div>
        <h1 style={styles.title}>Реєстрація</h1>
        <p style={styles.sub}>Створи акаунт та починай сортувати</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Ім'я</label>
          <input
            style={styles.input}
            type="text"
            name="first_name"
            placeholder="Твоє ім'я"
            value={form.first_name}
            onChange={handleChange}
            required
          />

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
            placeholder="Мінімум 6 символів"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Підтвердіть пароль</label>
          <input
            style={styles.input}
            type="password"
            name="confirm_password"
            placeholder="Повторіть пароль"
            value={form.confirm_password}
            onChange={handleChange}
            required
          />

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Завантаження..." : "Зареєструватись"}
          </button>
        </form>

        <p style={styles.footer}>
          Вже є акаунт?{" "}
          <Link to="/login" style={styles.link}>
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}