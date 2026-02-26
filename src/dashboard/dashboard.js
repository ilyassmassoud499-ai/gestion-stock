import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const API = "http://localhost:8081/gestion-stock/Dashboard/dashboard.php";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get(API);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <h2>Chargement...</h2>;

  // Pie Entrée / Sortie
  const pieData = {
    labels: data.stat_mouvement.map(m => m.types_mouvement),
    datasets: [{
      data: data.stat_mouvement.map(m => m.total),
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      hoverOffset: 10
    }]
  };

  // Bar Matériel par direction
  const barData = {
    labels: data.materiel_par_direction.map(d => d.direction),
    datasets: [{
      label: "Nombre matériel",
      data: data.materiel_par_direction.map(d => d.total),
      backgroundColor: "#36A2EB"
    }]
  };

  return (
    <div className="container text-center" style={{ width: "1000px", margin: "40px auto" }}>
      <h1 className="bg-dark text-light p-2 rounded">Dashboard Gestion Stock</h1>

      {/* Stat Cards */}
      <div className="mt-3 d-flex justify-content-between gap-2">
        <div className="bg-info text-light" style={cardStyle}>
          <h3>Total Matériels</h3>
          <h2>{data.total_materiel}</h2>
        </div>

        <div className="bg-secondary text-light" style={cardStyle}>
          <h3>Total Mouvements</h3>
          <h2>{data.total_mouvement}</h2>
        </div>

        <div className="bg-success text-light" style={cardStyle}>
          <h3>Total Utilisateurs</h3>
          <h2>{data.total_utilisateur}</h2>
        </div>

        <div className="bg-warning text-dark" style={cardStyle}>
          <h3>Total Depots</h3>
          <h2>{data.total_depot}</h2> 
        </div>
      </div>

      <br />

      {/* Charts */}
      <div className="border border-1 rounded shadow d-flex justify-content-center gap-4 p-3">
        <div style={{ width: "400px" }}>
          <h3>Entrée / Sortie</h3>
          <Pie data={pieData} />
        </div>

        <div style={{ width: "500px" }}>
          <h3>Matériels par Depot</h3>
          <Bar data={barData} />
        </div>
      </div>

      <br />
      

      {/* Derniers mouvements */}
      <h3>Derniers mouvements</h3>
      <table className="table table-striped table-hover shadow border border-1">
        <thead>
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
              <td>{m.types_mouvement}</td>
              <td>{m.date_mouvement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  width: "200px",
  textAlign: "center",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)"
};
