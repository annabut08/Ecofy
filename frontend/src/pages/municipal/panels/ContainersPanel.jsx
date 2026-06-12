import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader, Th, Td, BadgeGreen, BadgeRed } from "../components/MunicipalTable";
import styles from "../municipal.module.css";

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function ContainersPanel() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newContainer, setNewContainer] = useState({
  type: "",
  container_site_id: "",
  fill_level: 0,
  status: "active",
  });
  

  const load = useCallback(() => {
    axios
      .get(`${API}/containers/`, { headers: getHeaders() })
      .then((r) => setContainers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

    const createContainer = async () => {
    try {
      await axios.post(
        `${API}/containers/`,
        {
          type: newContainer.type,
          container_site_id: Number(newContainer.container_site_id),
          fill_level: Number(newContainer.fill_level),
          status: newContainer.status,
        },
        { headers: getHeaders() }
      );

      setNewContainer({
        type: "",
        container_site_id: "",
        fill_level: 0,
        status: "active",
      });

      load();
    } catch (error) {
      console.error(error);
      alert("Не вдалося створити контейнер");
    }
  };

  const deleteContainer = async (id) => {
    if (!window.confirm("Видалити контейнер?")) return;

    try {
      await axios.delete(
        `${API}/containers/${id}`,
        { headers: getHeaders() }
      );

      load();
    } catch (error) {
      console.error(error);
      alert("Не вдалося видалити контейнер");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Контейнери в реальному часі</h2>
      <div className={styles.addForm}>
  <h3 className={styles.formTitle}>Створити контейнер</h3>
    <div className={styles.formRow}>
      <input
        className={styles.input}
        placeholder="Тип"
        value={newContainer.type}
        onChange={(e) =>
          setNewContainer({
            ...newContainer,
            type: e.target.value,
          })
        }
      />

      <input
        className={styles.input}
        type="number"
        placeholder="ID майданчика"
        value={newContainer.container_site_id}
        onChange={(e) =>
          setNewContainer({
            ...newContainer,
            container_site_id: e.target.value,
          })
        }
      />

      <button
        className={styles.btnPrimary}
        onClick={createContainer}
      >
        ➕ Створити
      </button>
    </div>
  </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Тип</Th>
            <Th>Майданчик</Th>
            <Th>Заповнення</Th>
            <Th>Статус</Th>
            <Th>Дії</Th>
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <tr key={c.container_id} className={styles.tr}>
              <Td>{c.container_id}</Td>
              <Td>{c.type}</Td>
              <Td>{c.container_site_id}</Td>
              <Td>
                <div className={styles.progressWrap}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${c.fill_level ?? 0}%`,
                        background:
                          c.fill_level >= 80
                            ? "#F39C12"
                            : c.fill_level >= 50
                            ? "#E5B93D"
                            : "#41B87A",
                      }}
                    />
                  </div>
                  <span className={styles.progressLabel}>
                    {c.fill_level ?? 0}%
                  </span>
                </div>
              </Td>
              <Td>
                {c.status === "active" || c.status === "активний"
                  ? <BadgeGreen>{c.status}</BadgeGreen>
                  : <BadgeRed>{c.status}</BadgeRed>}
              </Td>
              <Td>
              <button
                className={styles.btnDanger}
                onClick={() => deleteContainer(c.container_id)}
              >
                🗑 Видалити
              </button>
            </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}