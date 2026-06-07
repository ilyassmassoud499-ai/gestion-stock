import axios from "axios";
import { useCallback, useEffect, useState } from "react"; // Ajout de useCallback
import { AnimatePresence, motion } from "framer-motion";
import Toast from "../components/Toast";

export default function Utilisateur() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    email: "",
    nom: "",
    service: ""
  });

  const API = "http://localhost:8081/gestion-stock/utilisateur/utilisateur.php";

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, visible: true });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = "Veuillez remplir tous les champs correctement !";
    if (!form.email.trim()) {
      newErrors.email = "L'email est obligatoire !";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Format d'email invalide !";
    }
    if (!form.service.trim()) newErrors.service = "Le service est obligatoire !";

    setErrors(newErrors);
    return newErrors; // Retourne l'objet d'erreurs
  };

  // La fonction loadUtilisateurs est maintenant mémorisée avec useCallback
  const loadUtilisateurs = useCallback(async () => {
    try {
      const res = await axios.get(API);
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setUtilisateurs(data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setUtilisateurs([]);
      showToast("Erreur lors du chargement des données", "error");
    }
  }, [API, setUtilisateurs, showToast]);

  useEffect(() => {
    loadUtilisateurs();
  }, [loadUtilisateurs]); // Ajout de loadUtilisateurs aux dépendances de useEffect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const resetForm = () => {
    setForm({ email: "", nom: "", service: "" });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
    setErrors({});
  };

  // Ajouter un utilisateur
  const addUtilisateur = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      showToast(Object.values(validationErrors)[0], "error");
      return;
    }
    try {
      const res = await axios.post(API, form);
      if (res.data.success !== false) {
        setForm({ email: "", nom: "", service: "" });
        setErrors({});
        setShowForm(false);
        showToast("Données ajoutées avec succès.", "success");
        loadUtilisateurs();
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.error("Erreur ajout utilisateur:", error);
      showToast("Échec de l'ajout des données.", "error");
    }
  };

  // Modifier un utilisateur
  const handleEdit = (u) => {
    setEditMode(true);
    setEditId(u.id_utilisateur);
    setForm({
      email: u.email || "",
      nom: u.nom || "",
      service: u.service || ""
    });
    setErrors({});
    setShowForm(true);
  };

  const updateUtilisateur = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      showToast(Object.values(validationErrors)[0], "error");
      return;
    }
    try {
      const res = await axios.put(API, { id_utilisateur: editId, ...form });
      if (res.data.success !== false) {
        setForm({ email: "", nom: "", service: "" });
        setErrors({});
        setEditMode(false);
        setEditId(null);
        setShowForm(false);
        showToast("Données mises à jour avec succès.", "success");
        loadUtilisateurs();
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.error("Erreur modification utilisateur:", error);
      showToast("Échec de la mise à jour des données.", "error");
    }
  };

  // Supprimer un utilisateur
  const deleteUtilisateur = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (!confirmDelete) return;
    try {
      const res = await axios.delete(API, { data: { id_utilisateur: id } });
      if (res.data.success !== false) {
        showToast("Données supprimées avec succès.", "success");
        loadUtilisateurs();
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.error("Erreur suppression utilisateur:", error);
      showToast("Échec de la suppression des données.", "error");
    }
  };

  // Filter un utilisateur
  const filteredUtilisateur = utilisateurs.filter((u) =>
    Object.values(u)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <motion.div 
      className="dashboard-panel container py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary m-0">Gestion des Utilisateurs</h2>
        <button 
          className={`btn ${showForm ? "btn-secondary" : "btn-success"}`} 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Fermer" : "Nouvel Utilisateur"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form 
              className="card shadow-sm border-0 bg-light p-4 mb-4" 
              onSubmit={editMode ? updateUtilisateur : addUtilisateur}
            >
              <h4 className="mb-3">{editMode ? "Modifier" : "Ajouter"} un collaborateur</h4>
              
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nom complet</label>
                  <input 
                    type="text" 
                    name="nom" 
                    placeholder="Ex: Jean Dupont" 
                    value={form.nom} 
                    className={`form-control ${errors.nom ? "is-invalid" : ""}`} 
                    onChange={handleChange} 
                  />
                  {errors.nom && <div className="text-danger small mt-1">{errors.nom}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email professionnel</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="email@entreprise.com" 
                    value={form.email} 
                    className={`form-control ${errors.email ? "is-invalid" : ""}`} 
                    onChange={handleChange} 
                  />
                  {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Service / Département</label>
                  <input 
                    type="text" 
                    name="service" 
                    placeholder="Ex: Informatique" 
                    value={form.service} 
                    className={`form-control ${errors.service ? "is-invalid" : ""}`} 
                    onChange={handleChange} 
                  />
                  {errors.service && <div className="text-danger small mt-1">{errors.service}</div>}
                </div>
              </div>

              <div className="mt-4">
                <button className="btn btn-primary px-4 me-2" type="submit">
                  {editMode ? "Mettre à jour" : "Enregistrer"}
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={resetForm}> {/* Correction: Appel de resetForm */}
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
            type="text"
            placeholder="Rechercher un utilisateur (nom, email, service...)"
            className="form-control border-start-0 ps-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead className="table-light">
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Service</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUtilisateur.map((u) => (
                <motion.tr layout key={u.id_utilisateur}>
                  <td className="fw-bold">{u.nom}</td>
                  <td>{u.email}</td>
                  <td><span className="badge bg-info text-dark">{u.service || "Non défini"}</span></td>
                  <td>
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-outline-warning btn-sm" onClick={() => handleEdit(u)}>Modifier</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => deleteUtilisateur(u.id_utilisateur)}>Supprimer</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
            {filteredUtilisateur.length === 0 && ( // Affichage du message si la liste est vide
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">Aucun utilisateur trouvé</td>
              </tr>
            )}
          </table>
        </div>
      </div>

      <Toast 
        {...toast} 
        onClose={() => setToast({ ...toast, visible: false })} 
      />
    </motion.div>
  );
}
