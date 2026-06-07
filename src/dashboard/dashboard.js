import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const API_DASHBOARD = "http://localhost:8081/gestion-stock/Dashboard/dashboard.php";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_DASHBOARD);
      setData(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement du dashboard:", error);
    }
  };

  if (!data) return <div className="container py-5 text-center"><h4>Chargement des statistiques...</h4></div>;

  // Configuration du graphique en camembert (Entrée / Sortie)
  const pieData = {
    labels: data.stat_mouvement.map(m => (m.type_mouvement || m.types_mouvement || "Inconnu").toUpperCase()),
    datasets: [{
      data: data.stat_mouvement.map(m => m.total),
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      hoverOffset: 10
    }]
  };

  // Configuration du graphique en barres (Matériels par Direction)
  const barData = {
    labels: data.materiel_par_direction.map(d => d.direction),
    datasets: [{
      label: "Nombre de matériels",
      data: data.materiel_par_direction.map(d => d.total),
      backgroundColor: "#36A2EB"
    }]
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
  };

  const summaryCards = [
    { label: "Matériels", count: data.total_materiel, color: "primary", icon: "📦" },
    { label: "Mouvements", count: data.total_mouvement, color: "secondary", icon: "🔄" },
    { label: "Utilisateurs", count: data.total_utilisateur, color: "success", icon: "👥" },
    { label: "Dépôts", count: data.total_depot, color: "warning", icon: "🏢" },
  ];

  return (
    <motion.div className="container py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-4">
        <h2 className="text-primary m-0">Tableau de Bord</h2>
        <p className="text-muted">Aperçu global de l'état du stock</p>
      </div>

      {/* Cartes de résumé */}
      <div className="row g-4">
        {summaryCards.map((item, i) => (
          <motion.div 
            className="col-md-3" 
            key={item.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={`card border-0 shadow-sm text-center p-2 h-100 border-bottom border-4 border-${item.color}`}>
              <div className="fs-1 mb-2">{item.icon}</div>
              <h6 className="text-muted text-uppercase small fw-bold">{item.label}</h6>
              <h2 className="fw-bold m-0">{item.count}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="row mt-4 g-3">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-3">
            <h5 className="mb-3 text-center">Flux de Mouvements</h5>
            <div style={{ height: "250px" }}>
              <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-3">
            <h5 className="mb-3 text-center">Matériels par Direction</h5>
            <div style={{ height: "250px" }}>
              <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      {/* Derniers mouvements */}
      <div className="card border-0 shadow-sm p-3 mt-4">
        <h5 className="mb-3">Derniers Mouvements</h5>
        <table className="table table-sm table-hover align-middle m-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>ID Matériel</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.last_mouvements.map(m => (
              <tr key={m.id_mouvement}>
                <td>{m.id_mouvement}</td>
                <td>{m.id_materiel}</td>
                <td>
                  <span className={`badge ${m.type_mouvement === 'entrer' || m.types_mouvement === 'entrer' ? 'bg-success' : 'bg-danger'}`}>
                    {(m.type_mouvement || m.types_mouvement || "—").toUpperCase()}
                  </span>
                </td>
                <td>{m.date_mouvement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}