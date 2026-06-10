import { useState, useEffect, useCallback } from "react";
import { Th, Td, Loader, BadgeGreen, BadgeRed } from "../components/AdminTable";
import { adminApi } from "../../../api/adminApi";
import styles from "../admin.module.css";

export default function OrganizationsPanel() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    adminApi.getOrganizations()
      .then((r) => setOrganizations(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Видалити організацію?")) return;
    await adminApi.deleteOrganization(id);
    load();
  };

  const handleToggleStatus = async (id, current) => {
    await adminApi.updateOrgStatus(id, !current);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className={styles.panelTitle}>Організації</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Назва</Th>
            <Th>Тип</Th>
            <Th>Місто</Th>
            <Th>Телефон</Th>
            <Th>Email</Th>
            <Th>Статус</Th>
            <Th>Дії</Th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((o) => (
            <tr key={o.organization_id} className={styles.tr}>
              <Td>{o.organization_id}</Td>
              <Td>{o.name}</Td>
              <Td>{o.type ?? "—"}</Td>
              <Td>{o.city ?? "—"}</Td>
              <Td>{o.phone_number ?? "—"}</Td>
              <Td>{o.email}</Td>
              <Td>
                {o.status
                  ? <BadgeGreen>Активна</BadgeGreen>
                  : <BadgeRed>Заблокована</BadgeRed>}
              </Td>
              <Td>
                <div className={styles.actions}>
                  <button
                    className={o.status ? styles.btnWarning : styles.btnPrimary}
                    onClick={() => handleToggleStatus(o.organization_id, o.status)}
                  >
                    {o.status ? "Заблокувати" : "Активувати"}
                  </button>
                  <button
                    className={styles.btnDanger}
                    onClick={() => handleDelete(o.organization_id)}
                  >
                    Видалити
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}