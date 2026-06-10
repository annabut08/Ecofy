import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader, Th, Td, BadgeGreen, BadgeRed } from "../components/MunicipalTable";
import styles from "../municipal.module.css";

const API = "https://ecofy-beta.vercel.app";
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function DevicesPanel() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    axios
      .get(`${API}/devices/`, { headers: getHeaders() })
      .then((r) => setDevices(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>IoT Пристрої</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Назва</Th>
            <Th>Серійний номер</Th>
            <Th>Тип</Th>
            <Th>Батарея</Th>
            <Th>Контейнер</Th>
            <Th>Статус</Th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.device_id} className={styles.tr}>
              <Td>{d.device_id}</Td>
              <Td>{d.device_name}</Td>
              <Td>{d.serial_number}</Td>
              <Td>{d.device_type}</Td>
              <Td>
                <div className={styles.progressWrap}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${d.battery_level ?? 0}%`,
                        background:
                          d.battery_level <= 10
                            ? "#DC2626"
                            : d.battery_level <= 20
                            ? "#F39C12"
                            : "#41B87A",
                      }}
                    />
                  </div>
                  <span className={styles.progressLabel}>
                    {d.battery_level ?? 0}%
                  </span>
                </div>
              </Td>
              <Td>{d.container_id ?? "—"}</Td>
              <Td>
                {d.status === "active"
                  ? <BadgeGreen>{d.status}</BadgeGreen>
                  : <BadgeRed>{d.status}</BadgeRed>}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}