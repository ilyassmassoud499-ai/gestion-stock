import axios from "axios";
import { useCallback, useEffect, useState } from "react"; // Ajout de useCallback
import { AnimatePresence, motion } from "framer-motion";
import Toast from "../components/Toast";

export default function Depot() {
  const [depots, setDepots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nom: "", adresse: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });

  const API = "http://localhost:8081/gestion-stock/Depot/depot.php";

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, visible: true });
  }, []);

  // La fonction loadData est maintenant mémorisée avec useCallback
  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(API);
      setDepots(Array.isArray(res.data) ? res.data : (res.data?.data || []));
      // Pas besoin de toast de succès pour le chargement initial
    } catch (error) {
      console.error("Erreur lors du chargement des dépôts:", error);
      setDepots([]);
      showToast("Échec du chargement des données.", "error");
    }
  }, [API, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]); // Ajout de loadData aux dépendances de useEffect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = "Veuillez remplir tous les champs correctement !";
    if (!form.adresse.trim()) newErrors.adresse = "L'adresse du dépôt est obligatoire !";
    setErrors(newErrors);
    return newErrors; // Retourne l'objet d'erreurs
  };

  const resetForm = () => {
    setForm({ nom: "", adresse: "" });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
    setErrors({});
  };

  const submit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // Affiche le message d'erreur spécifique du premier champ vide dans le Toast
      showToast(Object.values(validationErrors)[0], "error");
      return;
    }

    try {
      console.log("Envoi des données:", form); // Pour débogage
      const res = editMode 
        ? await axios.put(API, { id_depot: editId, ...form })
        : await axios.post(API, form);

      if (res.data.success !== false) {
        showToast(editMode ? "Données mises à jour avec succès." : "Données ajoutées avec succès.", "success");
        resetForm();
        loadData();
      } else {
        showToast(res.data.message || "Erreur lors de l'enregistrement", "error");
      }
    } catch (error) {
      console.error("Erreur API:", error);
      const serverMessage = error.response?.data?.message;
      showToast(serverMessage || (editMode ? "Échec de la mise à jour des données." : "Échec de l'ajout des données."), "error");
    }
  };

  const deleteDepot = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce dépôt ?")) return;
    try {
      const res = await axios.delete(API, { data: { id_depot: id } });
      if (res.data.success !== false) {
        showToast("Données supprimées avec succès.", "success");
        loadData();
      } else {
        showToast(res.data.message || "Erreur de suppression", "error");
      }
    } catch (error) {
      showToast("Échec de la suppression des données.", "error");
    }
  };

  const filtered = depots.filter(d => Object.values(d).join(" ").toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div 
      className="dashboard-panel container py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary m-0">Gestion des Dépôts</h2>
        <button className={`btn ${showForm ? "btn-secondary" : "btn-success"}`} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Fermer" : "Nouveau Dépôt"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <form className="card shadow-sm border-0 bg-light p-4 mb-4" onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nom du Dépôt</label>
                  <input 
                    type="text"
                    className={`form-control ${errors.nom ? "is-invalid" : ""}`}
                    name="nom" 
                    value={form.nom} 
                    onChange={handleChange}
                  />
                  {errors.nom && <div className="text-danger small mt-1">{errors.nom}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    className={`form-control ${errors.adresse ? "is-invalid" : ""}`}
                    name="adresse"
                    value={form.adresse}
                    onChange={handleChange}
                  />
                  {errors.adresse && <div className="text-danger small mt-1">{errors.adresse}</div>}
                </div>
              </div>
              <div className="mt-4">
                <button className="btn btn-primary btn-sm px-3 me-2" type="submit">
                  {editMode ? "Mettre à jour" : "Enregistrer"}
                </button>
                <button className="btn btn-outline-secondary btn-sm" type="button" onClick={resetForm}>
                  Annuler
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card border-0 shadow-sm p-3">
        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input 
            className="form-control border-start-0 ps-0" 
            placeholder="Rechercher un dépôt..." 
            value={search}
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr><th>Nom</th><th>Adresse</th><th className="text-end">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((d) => (
                <motion.tr layout key={d.id_depot}>
                  <td className="fw-bold">{d.nom}</td>
                  <td>{d.adresse}</td>
                  <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button 
                          className="btn btn-outline-warning btn-sm" 
                          onClick={() => { 
                            setForm({ nom: d.nom, adresse: d.adresse }); 
                            setEditId(d.id_depot);
                            setEditMode(true); 
                            setShowForm(true); 
                          }}
                        >
                          Modifier
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteDepot(d.id_depot)}>
                          Supprimer
                        </button>
                      </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted py-4">Aucun dépôt trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Toast 
        {...toast} 
        onClose={() => setToast({ ...toast, visible: false })} 
      />
    </motion.div>
  );
}