import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ConditionPage = () => {
  const { pvcId } = useParams();
  const navigate = useNavigate();
  
  // PVC Condition State
  const [condition, setCondition] = useState("");
  
  // Damage Data State
  const [damages, setDamages] = useState([]);
  
  // Temporary Damage Input
  const [newDamage, setNewDamage] = useState(null);

  // Load Existing Data
  useEffect(() => {
    const fetchCondition = async () => {
      const response = await fetch(`http://localhost:5000/get-condition/${pvcId}`);
      const data = await response.json();
      if (data) {
        setCondition(data.condition);
        setDamages(data.damages || []);
      }
    };
    fetchCondition();
  }, [pvcId]);

  // Handle Adding a New Damage
  const handleAddDamage = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNewDamage({ x, y, type: null, repaired: false, image: null });
  };

  // Handle Selecting Damage Type
  const handleSelectType = (type) => {
    setNewDamage((prev) => ({ ...prev, type }));
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setNewDamage((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  // Save Damage to List
  const handleSaveDamage = () => {
    if (newDamage && newDamage.type) {
      setDamages([...damages, newDamage]);
      setNewDamage(null);
    }
  };

  // Handle Marking as Repaired
  const handleMarkRepaired = (index) => {
    setDamages((prev) =>
      prev.map((damage, i) =>
        i === index ? { ...damage, repaired: true } : damage
      )
    );
  };

  // Submit Data to Backend
  const handleSubmit = async () => {
    await fetch(`http://localhost:5000/save-condition/${pvcId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condition, damages }),
    });
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10vh" }}>
      <h1>PVC Condition - ID: {pvcId}</h1>

      {/* Condition Selector */}
      <select value={condition} onChange={(e) => setCondition(e.target.value)}>
        <option value="">Select Condition</option>
        <option value="Very Good">Very Good</option>
        <option value="Okay">Okay</option>
        <option value="Bad">Bad</option>
        <option value="Rubbish">Rubbish</option>
      </select>

      {/* Clickable Rectangle */}
      <div
        onClick={handleAddDamage}
        style={{
          width: "300px",
          height: "500px",
          margin: "20px auto",
          border: "2px solid black",
          position: "relative",
          backgroundColor: "#f8f8f8",
        }}
      >
        {/* Render Existing Damages */}
        {damages.map((damage, index) => (
          <div
            key={index}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              left: `${damage.x}px`,
              top: `${damage.y}px`,
              width: "10px",
              height: "10px",
              backgroundColor: damage.repaired ? "green" : "red",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onDoubleClick={() => handleMarkRepaired(index)}
          />
        ))}
      </div>

      {/* Damage Popup */}
      {newDamage && (
        <div
          style={{
            position: "absolute",
            left: `${newDamage.x + 20}px`,
            top: `${newDamage.y}px`,
            background: "white",
            padding: "10px",
            border: "1px solid black",
          }}
        >
          <button onClick={() => handleSelectType("Cut")}>Cut</button>
          <button onClick={() => handleSelectType("Hole")}>Hole</button>
          {newDamage.type && (
            <>
              <input type="file" onChange={handleFileUpload} />
              <button onClick={handleSaveDamage}>OK</button>
            </>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        SUBMIT
      </button>
    </div>
  );
};

export default ConditionPage;
