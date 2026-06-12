import { useState, useEffect, useCallback } from "react";
import { Th, Td, Loader } from "../components/MunicipalTable";
import { requestsApi } from "../../../api/requestApi";
import RequestStatusBadge from "../components/RequestStatusBadge";
import styles from "../municipal.module.css";

export default function RequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(() => {
    requestsApi.getAll()
      .then((r) => setRequests(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id, status) => {
    setError("");
    setUpdatingId(id);
    try {
      await requestsApi.updateStatus(id, status);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Помилка оновлення статусу");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити заявку?")) return;
    try {
      await requestsApi.delete(id);
      load();
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Помилка видалення");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Заявки від компаній</h2>
      </div>

      {error && <div className={styles.formError}>{error}</div>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Компанія</Th>
              <Th>Тип відходів</Th>
              <Th>Опис</Th>
              <Th>Кількість (кг)</Th>
              <Th>Дата</Th>
              <Th>Статус</Th>
              <Th>Дії</Th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.td} style={{ textAlign: "center", color: "#9CA3AF" }}>
                  Заявок немає
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.request_id} className={styles.tr}>
                  <Td>{r.request_id}</Td>
                  <Td>{r.client_id ?? "—"}</Td>
                  <Td>{r.waste_type}</Td>
                  <Td>{r.waste_description ?? "—"}</Td>
                  <Td>{r.amount_kg ?? "—"}</Td>
                  <Td>{new Date(r.created_at).toLocaleDateString("uk-UA")}</Td>
                  <Td><RequestStatusBadge status={r.status} /></Td>
                  <Td>
                    <div className={styles.actions}>
                      {r.status === "pending" && (
                        <>
                          <button
                            className={styles.btnSuccess}
                            disabled={updatingId === r.request_id}
                            onClick={() => handleStatusChange(r.request_id, "approved")}
                          >
                            Схвалити
                          </button>
                          <button
                            className={styles.btnWarning}
                            disabled={updatingId === r.request_id}
                            onClick={() => handleStatusChange(r.request_id, "rejected")}
                          >
                            Відхилити
                          </button>
                        </>
                      )}
                      {r.status === "approved" && (
                        <button
                          className={styles.btnSuccess}
                          disabled={updatingId === r.request_id}
                          onClick={() => handleStatusChange(r.request_id, "completed")}
                        >
                          ✓ Виконано
                        </button>
                      )}
                      <button
                        className={styles.btnDanger}
                        onClick={() => handleDelete(r.request_id)}
                      >
                        Видалити
                      </button>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}