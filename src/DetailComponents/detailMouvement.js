import axios from "axios";
import { useState } from "react";

const detailMouvement = () => {
  const [materiels,setMateriels]=useState([]);

  const recupere = async()=>{
    axios.get("http://localhost:8081/gestion-stock/Materiels/Materiel.php")
    .then((Response)=>{
      setMateriels(Response.data)
    })
    .catch(error=>{
      console.error("materiel non envoyer", error)
    })

  }

  return ( 
    <div>
     <table className="table table-striped table-hover shadow rounded">
      <thead>
        <tr>
          <th>id_materiel</th>
          <th>marque</th>
          <th>modele</th>
          <th>numero_serie</th>
          <th>Date achat</th>
          <th>id_depot</th>
        </tr>
      </thead>
     {materiels.map((m)=>(
      <tbody key={m.id_materiel}>
        <tr>
          <td>{m.id_materiel}</td>
          <td>{m.marque}</td>
          <td>{m.modele}</td>
          <td>{m.numero_serie}</td>
          <td>{m.date_achat}</td>
          <td>{m.id_depot}</td>
        </tr>
        

      </tbody>
     ))}
     </table>
      

    </div>
   );
}
 
export default detailMouvement;