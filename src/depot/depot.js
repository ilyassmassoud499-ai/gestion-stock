import axios from "axios";
import { useEffect, useState } from "react";

export default function Depot() {


  const [depot, setdepot] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const[search,setSearch]=useState("");
  
  const [form, setForm] = useState({
        nom:"",
        adress:""
  });

  const API = "http://localhost:8081/gestion-stock/Depot/depot.php";

 
  const loadDepot = async () => {
    try {
      const res = await axios.get(API);
      setdepot(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDepot();
  }, []);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

 
  const adddepot = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API, form);

      setForm({
        nom: "",
        adress: "",
       
      });

      setShowForm(false);
      loadDepot();

    } catch (error) {
      console.error(error);
    }
  };

  // Modifier un utilisateur
  const handleEdit = (u) => {
    setEditMode(true);
    setEditId(u.id_depot);
    setForm({
      nom: u.nom,
      adress: u.adress, 
     
    });
    setShowForm(true);
  };


  const updateUtilisateur = async (e) => {
    e.preventDefault();
    try {
      await axios.put(API, { id_depot: editId, ...form });
      setForm({ nom: "", adress: "" });
      setEditMode(false);
      setEditId(null);
      setShowForm(false);
      loadDepot();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // Supprimer depot
  // =========================
  const deleteMateriel = async (id) => {
      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce depot ?");
  if (!confirmDelete) return; // 
    try {
      await axios.delete(API, {
        data: { id_depot: id }
      });

      loadDepot();
    } catch (error) {
      console.error(error);
    }
  };

  const filtredDepot=depot.filter((d)=>
    Object.values(d)
    .join("")
    .toLowerCase()
    .includes(search.toLowerCase())
    

 
  )

  return (
    <div style={{ width: "800px", margin: "40px auto" }}>
     

      <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
       {showForm ? "Fermer" : editMode ? "Modifier un depot" : "Ajouter un depot"}
      </button>

      {showForm && (
         <form className="container shadow bg-light" style={{ marginTop: "20px" }} onSubmit={editMode ? updateUtilisateur : adddepot}>
            <h2>{editMode ? "Modifier un depot" : "Ajouter un depot"}</h2>
          <input
            type="text"
            name="nom"
            placeholder="nom"
            value={form.nom}
               className="form-control"
            onChange={handleChange}
            required
          /><br /><br />

          <input
            type="text"
            name="adress"
            placeholder="Adress"
              className="form-control"
            value={form.adress}
            onChange={handleChange}
            required
          /><br /><br />

          <button className="btn btn-success mb-3" type="submit">{editMode ? "Modifier" : "Enregistrer"}</button>
        </form>
      )}

      <hr />
       <h2>Liste des depots</h2>

       {/* input de filter */}
       <input 
       placeholder="Filtrer tous les champs..."
       value={search}
       className="form-control mb-3"
       onChange={(e)=>setSearch(e.target.value)}
       />
       

      <table className="table table-striped table-hover " border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>ID_depot</th>
            <th>nom</th>
            <th>Adress</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtredDepot.map((m) => (
            <tr key={m.id_depot}>
              <td>{m.id_depot}</td>
              <td>{m.nom}</td>
              <td>{m.adress}</td>
           
              <td>
                <button className="btn btn-danger me-2" onClick={() => deleteMateriel(m.id_depot)}>
                  Supprimer
                </button>
                 <button className="btn btn-warning" onClick={() => handleEdit(m)}>Modifier</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
