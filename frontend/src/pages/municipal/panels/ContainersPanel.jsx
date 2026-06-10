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

  const load = useCallback(() => {
    axios
      .get(`${API}/containers/`, { headers: getHeaders() })
      .then((r) => setContainers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Контейнери в реальному часі</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Тип</Th>
            <Th>Майданчик</Th>
            <Th>Заповнення</Th>
            <Th>Статус</Th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}