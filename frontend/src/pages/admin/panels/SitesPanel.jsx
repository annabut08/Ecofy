import { useState, useEffect, useCallback } from "react";
import { Th, Td, Loader } from "../components/AdminTable";
import { adminApi } from "../../../api/adminApi";
import styles from "../admin.module.css";



export default function SitesPanel() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
  adminApi.getSites()
      .then((r) => setSites(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Контейнерні майданчики</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Адреса</Th>
            <Th>Місто</Th>
            <Th>Організація</Th>
            <Th>Координати</Th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s) => (
            <tr key={s.container_site_id} className={styles.tr}>
              <Td>{s.container_site_id}</Td>
              <Td>{s.street}, {s.building}</Td>
              <Td>{s.city_id ?? "—"}</Td>
              <Td>{s.organization_id}</Td>
              <Td style={{ fontSize: 12, color: "#9E9E9E" }}>
                {s.location_lat}, {s.location_lng}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
