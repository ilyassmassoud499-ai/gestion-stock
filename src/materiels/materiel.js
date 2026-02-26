import axios from "axios";
import { useEffect, useState } from "react";

export default function Materiel() {
  const [materiels, setMateriels] = useState([]);
  const [depot,setDepot]=useState([])
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState(""); 

 
  const [form, setForm] = useState({
    marque: "",
    modele: "",
    numero_serie: "",
    date_achat: "",
    etat: "",
    id_depot: "",
  });

  const API = "http://localhost:8081/gestion-stock/Materiels/Materiel.php";

 
  const loadMateriel = async () => {
    try {
      const res = await axios.get(API);
      setMateriels(res.data);
    } catch (error) {
      console.error(error);
    }
  };
   const loadDepot = async () => {
  try {
    const res = await axios.get("http://localhost:8081/gestion-stock/Depot/depot.php");
    setDepot(res.data);
  } catch (error) {
    console.error("Erreur lors du chargement des matériels :", error);
  }
};

  useEffect(() => {
    loadMateriel()
    loadDepot();
  }, []);

  // Changement des inputs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Ajouter materiel
  const addMateriel = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, form);
      setForm({
        marque: "",
        modele: "",
        numero_serie: "",
        date_achat: "",
        etat: "",
        id_depot: "",
      });
      setShowForm(false);
      loadMateriel();
  
    } catch (error) {
      console.error(error);
    }
    
  };

//praparer pour la modification
  const updateMateriel = async (e) => {
    e.preventDefault();
    try {
      await axios.put(API, { id_materiel: editId, ...form });
      setForm({
        marque: "",
        modele: "",
        numero_serie: "",
        date_achat: "",
        etat: "",
        id_depot: "",
      });
      setEditMode(false);
      setEditId(null);
      setShowForm(false);
      loadMateriel();
    } catch (error) {
      console.error("Erreur modification :", error);
    }
  };

  // Editer materiel
  const handleEdit = (m) => {
    setEditMode(true);
    setEditId(m.id_materiel);
    setForm({
      marque: m.marque,
      modele: m.modele,
      numero_serie: m.numero_serie,
      date_achat: m.date_achat,
      etat: m.etat,
      id_depot: m.id_depot,
    });
    setShowForm(true);
  };

  // Supprimer materiel avec confirmation
  const deleteMateriel = async (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce matériel ?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(API, { data: { id_materiel: id } });
      loadMateriel();
    } catch (error) {
      console.error(error);
    }
  };

  // Filtrer materiels
  const filteredMateriels = materiels.filter((m) =>
    Object.values(m)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ width: "900px", margin: "40px auto" }}>
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Fermer" : "Ajouter Matériel"}
      </button>


      {showForm && (
        <form
          className="container mt-3 shadow border border-1 bg-light p-3"
          onSubmit={editMode ? updateMateriel : addMateriel}
        >
          <h2>{editMode ? "Modifier un matériel" : "Ajouter un matériel"}</h2>
          <input
            type="text"
            name="marque"
            placeholder="Marque"
            value={form.marque}
            className="form-control mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="modele"
            placeholder="Modèle"
            value={form.modele}
            className="form-control mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="numero_serie"
            placeholder="Numéro série"
            value={form.numero_serie}
            className="form-control mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date_achat"
            value={form.date_achat}
            className="form-control mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="etat"
            placeholder="Etat"
            value={form.etat}
            className="form-control mb-2"
            onChange={handleChange}
            required
          />
         <select
  name="id_depot"
  className="form-control"
  value={form.id_depot}
  onChange={handleChange}
  required
>
  <option value="">-- Choisir un depot --</option>
  {depot.map((m) => (
    <option key={m.id_depot} value={m.id_depot}>
      {m.nom} {m.adress} 
    </option>
  ))}
</select>
          <button  className="btn btn-success" type="submit">    
            {editMode ? "Modifier" : "Enregistrer"}
            
          </button>
        </form>
      )}

      <hr />

      <h2>Liste des Matériels</h2>

      {/* Input de filtre */} 
      <input
        type="text"
        placeholder="Filtrer tous les champs..."
        className="form-control mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table
        border="1"
        width="100%"
        cellPadding="10"
        className="table table-striped table-hover shadow border border-1"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Numéro série</th>
            <th>Etat</th>
            <th>Date achat</th>
            <th>ID Dépôt</th>
            <th>Action</th>
          </tr>
        </thead> 
        <tbody>
          {filteredMateriels.map((m) => (
            <tr key={m.id_materiel}>
              <td>{m.id_materiel}</td>
              <td>{m.marque}</td>
              <td>{m.modele}</td>
              <td>{m.numero_serie}</td>
              <td>{m.etat}</td>
              <td>{m.date_achat}</td>
              <td>{m.id_depot}</td>
             
             
              <td>
                <button 
                  className="btn btn-danger me-1"
                  onClick={() => deleteMateriel(m.id_materiel)}
                >
                  Supprimer 
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(m)}
                >
                  Modifier
                </button>
              </td>
            </tr>
            


          ))}
        </tbody>
      </table>
    </div>
  );
}
