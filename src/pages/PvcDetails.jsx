import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PvcDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pvcData, setPvcData] = useState(null);

  // Fetch PVC details from backend
  useEffect(() => {
    const fetchPvcDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-pvc/${id}`);
        const data = await response.json();
        setPvcData(data);
      } catch (error) {
        console.error("Failed to fetch PVC details:", error);
      }
    };

    fetchPvcDetails();
  }, [id]);

  if (!pvcData) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>PVC Cover Information</h1>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Length:</strong> {pvcData.length}m</p>
      <p><strong>Width:</strong> {pvcData.width}m</p>
      <p><strong>Condition:</strong> {pvcData.condition || "Not Set"}</p>

      {/* Display Damages */}
      <h2>Damages:</h2>
      {pvcData.damages && pvcData.damages.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {pvcData.damages.map((damage, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>Type:</strong> {damage.type} | 
              <strong> Repaired:</strong> {damage.repaired ? "✅ Yes" : "❌ No"}
              {damage.image && (
  <div>
    <img
      src={damage.image.startsWith("data:image") ? damage.image : ""}
      alt="Damage"
      onError={(e) => (e.target.style.display = "none")} // Hide broken images
      style={{
        width: "100px",
        height: "100px",
        border: "2px solid red",
        marginTop: "5px",
        display: damage.image.startsWith("data:image") ? "block" : "none"
      }}
    />
    {!damage.image.startsWith("data:image") && <p>[Image not available]</p>}
  </div>
)}


            </li>
          ))}
        </ul>
      ) : (
        <p>No damages recorded.</p>
      )}

      {/* Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ padding: "10px 15px", fontSize: "16px", marginRight: "10px" }}
        >
          Go Back
        </button>
        <button 
          onClick={() => navigate(`/add-condition/${id}`)} 
          style={{ padding: "10px 15px", fontSize: "16px", background: "blue", color: "white", border: "none", cursor: "pointer" }}
        >
          Modify
        </button>
      </div>
    </div>
  );
};

export default PvcDetails;
