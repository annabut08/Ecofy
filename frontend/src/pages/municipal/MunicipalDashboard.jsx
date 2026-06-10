import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import OverviewPanel from "./panels/OverviewPanel";
import PickupsPanel from "./panels/PickupsPanel";
import StatisticsPanel from "./panels/StatisticsPanel";
import styles from "./municipal.module.css";

export default function MunicipalDashboard() {
  const [active, setActive] = useState("overview");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const panels = {
    overview: <OverviewPanel />,
    pickups: <PickupsPanel />,
    stats: <StatisticsPanel />,
  };

  return (
    <div className={styles.root}>
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} />
      <main className={styles.main}>{panels[active]}</main>
    </div>
  );
}