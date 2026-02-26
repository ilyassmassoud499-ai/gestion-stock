import axios from "axios";
import { useEffect, useState } from "react";

export default function Mouvement() {
  const [mouvements, setMouvements] = useState([]);
  const [materiels, setMateriels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id_materiel: "",
    types_mouvement: "",
    date_mouvement: "",
  });

  const API_MOUVEMENT =
    "http://localhost:8081/gestion-stock/mouvement/mouvement.php";
  const API_MATERIEL =
    "http://localhost:8081/gestion-stock/Materiels/Materiel.php";

  useEffect(() => {
    loadMouvements();
    loadMateriels();
  }, []);

  const loadMouvements = async () => {
    const res = await axios.get(API_MOUVEMENT);
    setMouvements(res.data);
  };

  const loadMateriels = async () => {
    const res = await axios.get(API_MATERIEL);
    setMateriels(res.data);
  };

  const getMateriel = (id) =>
    materiels.find((m) => m.id_materiel === id);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

//modifier un mouvement   
  const handleEdit = (m) => {
    setEditMode(true);
    setEditId(m.id_mouvement);
    setForm({
      id_materiel: m.id_materiel,
      types_mouvement: m.types_mouvement,
      date_mouvement: m.date_mouvement,
    });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(API_MOUVEMENT, {
        id_mouvement: editId,
        ...form,
      });
    } else {
      await axios.post(API_MOUVEMENT, form);
    }

    resetForm();
    loadMouvements();
  };

  const resetForm = () => {
    setForm({
      id_materiel: "",
      types_mouvement: "",
      date_mouvement: "",
    });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
  };
//supprimer un mouvement
  const deleteMouvement = async (id) => {
    if (!window.confirm("Supprimer ce mouvement ?")) return;
    await axios.delete(API_MOUVEMENT, {
      data: { id_mouvement: id },
    });
    loadMouvements();
  };

  const filtered = mouvements.filter((m) => {
    const mat = getMateriel(m.id_materiel);

    const data = [
      m.id_mouvement,
      m.id_materiel,
      m.types_mouvement,
      m.date_mouvement,
      mat?.marque,
      mat?.numero_serie,
    ]
      .join(" ")
      .toLowerCase();

    return data.includes(search.toLowerCase());
  });

  return (
    <div style={{ width: "900px", margin: "40px auto" }}>
      <button
        className="btn btn-success"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Fermer" : "Ajouter Mouvement"}
      </button>

      {showForm && (
        <form className="shadow p-3 mt-3 bg-light" onSubmit={submit}>
          <select
            name="id_materiel"
            className="form-control mb-2"
            value={form.id_materiel}
            onChange={handleChange}
            required
          >
            <option value="">-- Choisir matériel --</option>
            {materiels.map((m) => (
              <option key={m.id_materiel} value={m.id_materiel}>
                {m.id_materiel} - {m.marque} ({m.numero_serie})
              </option>
            ))}
          </select>

          <select
            name="types_mouvement"
            className="form-control mb-2"
            value={form.types_mouvement}
            onChange={handleChange}
            required
          >
            <option value="">Type</option>
            <option value="entrer">Entrée</option>
            <option value="sortie">Sortie</option>
          </select>

          <input
            type="date"
            name="date_mouvement"
            className="form-control mb-2"
            value={form.date_mouvement}
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary">Enregistrer</button>
        </form>
      )}

      <hr />

      <input
        className="form-control mb-3"
        placeholder="Filtrer tous les champs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-striped table-hover shadow">
        <thead>
          <tr>
            <th>ID mouvement</th>
            <th>ID matériel</th>
            <th>Marque de Materiel</th>
            <th>Numéro série Materiel</th>
            <th>Type</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => {
            const mat = getMateriel(m.id_materiel);
            return (
              <tr  key={m.id_mouvement}>
                <td>{m.id_mouvement}</td>
                <td>{m.id_materiel}</td>
                <td>{mat?.marque || "—"}</td>
                <td>{mat?.numero_serie || "—"}</td>
                <td>{m.types_mouvement}</td>
                <td>{m.date_mouvement}</td>
                <td className=" d-flex gap-2 justify-content-between"  >
                  <button
                    className="btn btn-danger "
                    onClick={() => deleteMouvement(m.id_mouvement)}
                  >
                    Supprimer
                  </button>
                    <button
                    className="btn btn-warning  me-2"
                    onClick={() => handleEdit(m)}
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}