import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const PvcDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>PVC Cover Information</h1>
      <p>Showing details for PVC ID: <strong>{id}</strong></p>

      <button 
        onClick={() => navigate(-1)} 
        style={{ padding: "10px 15px", marginTop: "20px", fontSize: "16px" }}
      >
        Go Back
      </button>
    </div>
  );
};

export default PvcDetails;
