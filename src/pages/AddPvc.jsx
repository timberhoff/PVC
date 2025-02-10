import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPvc = () => {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [pvcId, setPvcId] = useState(null);
  const navigate = useNavigate();

  const handleGenerateId = async () => {
    if (!length || !width) {
      alert("Please enter both length and width!");
      return;
    }

    const response = await fetch("http://localhost:5000/generate-pvc-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ length, width }),
    });

    const data = await response.json();
    console.log("Generated PVC ID:", data.pvc_id); // Debugging line
    setPvcId(data.pvc_id);
  };

  const handleSubmit = async () => {
    if (!pvcId) return;

    await fetch("http://localhost:5000/add-pvc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pvc_id: pvcId, length, width }),
    });

    navigate(`/add-condition/${pvcId}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10vh" }}>
      <h1>Add New PVC Cover</h1>

      {!pvcId ? (
        <>
          <input
            type="number"
            placeholder="Length (m)"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            style={{ padding: "10px", fontSize: "16px", marginBottom: "10px" }}
          /><br />

          <input
            type="number"
            placeholder="Width (m)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            style={{ padding: "10px", fontSize: "16px", marginBottom: "10px" }}
          /><br />

          <button 
            onClick={handleGenerateId}
            style={{ padding: "10px 20px", fontSize: "16px", marginTop: "10px" }}
          >
            Generate PVC ID
          </button>
        </>
      ) : (
        <>
          <h2>Your PVC ID: <strong>{pvcId}</strong></h2>
          <p style={{ color: "red", fontWeight: "bold" }}>
            Write this ID onto that PVC!!!
          </p>

          <button 
            onClick={handleSubmit}
            style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}
          >
            CONTINUE
          </button>
        </>
      )}
    </div>
  );
};

export default AddPvc;
