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
  const [newDevice, setNewDevice] = useState({
  device_name: "",
  serial_number: "",
  device_type: "",
  container_id: "",
  battery_level: 100,
  });

  const load = useCallback(() => {
    axios
      .get(`${API}/devices/`, { headers: getHeaders() })
      .then((r) => setDevices(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const createDevice = async () => {
  try {
    await axios.post(
      `${API}/devices/`,
      {
        device_name: newDevice.device_name,
        serial_number: newDevice.serial_number,
        device_type: newDevice.device_type,
        container_id: Number(newDevice.container_id),
        battery_level: Number(newDevice.battery_level),
      },
      { headers: getHeaders() }
    );

    setNewDevice({
      device_name: "",
      serial_number: "",
      device_type: "",
      container_id: "",
      battery_level: 100,
    });

    load();
    } catch (error) {
      console.error(error);
      alert("Не вдалося додати пристрій");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>IoT Пристрої</h2>
      <div className={styles.addForm}>
  <h3 className={styles.formTitle}>Додати пристрій</h3>

  <div className={styles.formRow}>
    <input
      className={styles.input}
      placeholder="Назва пристрою"
      value={newDevice.device_name}
      onChange={(e) =>
        setNewDevice({
          ...newDevice,
          device_name: e.target.value,
        })
      }
    />

    <input
      className={styles.input}
      placeholder="Серійний номер"
      value={newDevice.serial_number}
      onChange={(e) =>
        setNewDevice({
          ...newDevice,
          serial_number: e.target.value,
        })
      }
    />

    <input
      className={styles.input}
      placeholder="Тип пристрою"
      value={newDevice.device_type}
      onChange={(e) =>
        setNewDevice({
          ...newDevice,
          device_type: e.target.value,
        })
      }
    />

    <input
      className={styles.input}
      type="number"
      placeholder="ID контейнера"
      value={newDevice.container_id}
      onChange={(e) =>
        setNewDevice({
          ...newDevice,
          container_id: e.target.value,
        })
      }
    />

    <input
      className={styles.input}
      type="number"
      min="0"
      max="100"
      placeholder="Батарея"
      value={newDevice.battery_level}
      onChange={(e) =>
        setNewDevice({
          ...newDevice,
          battery_level: e.target.value,
        })
      }
    />
      <button
        className={styles.btnPrimary}
        onClick={createDevice}
      >
        ➕ Додати
      </button>
    </div>
  </div>
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