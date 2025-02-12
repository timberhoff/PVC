import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ConditionPage = () => {
  const { pvcId } = useParams();
  const navigate = useNavigate();
  const [condition, setCondition] = useState("");
  const [damages, setDamages] = useState([]);
  const [newDamage, setNewDamage] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  // ✅ Fetch Stored Data on Page Load
  useEffect(() => {
    const fetchConditionData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-pvc/${pvcId}`);
        const data = await response.json();
        setCondition(data.condition || "");
        setDamages(data.damages || []);
      } catch (error) {
        console.error("Error fetching PVC data:", error);
      }
    };

    fetchConditionData();
  }, [pvcId]);

  // ✅ Handle Clicking on the Rectangle (New Damage Popup)
  const handleAddDamage = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNewDamage({ x, y, type: null, repaired: false, image: null });
  };

  // ✅ Handle Selecting Damage Type (Cut or Hole)
  const handleSelectType = (type) => {
    setNewDamage((prev) => ({ ...prev, type }));
  };

  // ✅ Handle File Upload (Convert Image to Base64)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setNewDamage((prev) => ({ ...prev, image: reader.result }));
      };
    }
  };
  

  // ✅ Save Damage to List (Add Red Marker & Image)
  const handleSaveDamage = () => {
    if (newDamage && newDamage.type) {
      setDamages([...damages, newDamage]);
      setNewDamage(null);
    }
  };

  // ✅ Cancel New Damage Entry
  const handleCancelDamage = () => {
    setNewDamage(null);
  };

  // ✅ Toggle "Repaired" (Red → Green)
  const handleMarkRepaired = (index) => {
    setDamages((prev) =>
      prev.map((damage, i) =>
        i === index ? { ...damage, repaired: !damage.repaired } : damage
      )
    );
  };

  // ✅ Expand Image on Click
  const handleExpandImage = (index) => {
    setExpandedImage(index);
  };

  // ✅ Close Expanded Image
  const handleCloseImage = () => {
    setExpandedImage(null);
  };

  // ✅ Submit Data to Backend
  const handleSubmit = async () => {
    if (!condition.trim()) {
        alert("Please select a condition before submitting!");
        return;
    }

    console.log("Submitting Data:", { pvcId, condition, damages }); // Debugging

    try {
        const response = await fetch(`http://localhost:5000/save-condition/${pvcId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ condition, damages }),
        });

        if (!response.ok) {
            throw new Error("Server response was not OK");
        }

        const data = await response.json();
        console.log("Server Response:", data);

    } catch (error) {
        console.error("Failed to save condition:", error);
        alert("Failed to save condition. Check console for details.");
    }
};

  return (
    <div style={{ textAlign: "center", marginTop: "10vh" }}>
      <h1>PVC Condition - ID: {pvcId}</h1>

      {/* ✅ Restore Previously Selected Condition */}
      <select value={condition} onChange={(e) => setCondition(e.target.value)}>
        <option value="">Select Condition</option>
        <option value="Very Good">Very Good</option>
        <option value="Okay">Okay</option>
        <option value="Bad">Bad</option>
        <option value="Rubbish">Rubbish</option>
      </select>

      {/* ✅ Clickable Damage Area */}
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
        {/* ✅ Show Previously Saved Damage Marks */}
        {damages.map((damage, index) => (
          <React.Fragment key={index}>
            {/* Damage Marker */}
            <div
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
            />
            {/* Repair Button */}
            <button
              onClick={() => handleMarkRepaired(index)}
              style={{
                position: "absolute",
                left: `${damage.x + 15}px`,
                top: `${damage.y - 5}px`,
                fontSize: "10px",
                backgroundColor: damage.repaired ? "green" : "blue",
                color: "white",
                border: "none",
                padding: "2px 5px",
                cursor: "pointer",
              }}
            >
              {damage.repaired ? "Repaired" : "Repair"}
            </button>

            {/* ✅ Show Image */}
            {damage.image && (
              <img
                src={damage.image.startsWith("data:image") ? damage.image : ""}
                alt="Damage"
                onClick={() => handleExpandImage(index)}
                style={{
                  position: "absolute",
                  left: damage.x < 150 ? "320px" : "-120px",
                  top: `${damage.y}px`,
                  width: "100px",
                  height: "100px",
                  border: `3px solid ${damage.repaired ? "green" : "red"}`,
                  cursor: "pointer",
                  zIndex: expandedImage === index ? 10 : index,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ✅ Damage Popup for New Damage Entry */}
      {newDamage && (
        <div
          style={{
            position: "absolute",
            left: `${newDamage.x + 30}px`,
            top: `${newDamage.y}px`,
            background: "white",
            padding: "10px",
            border: "1px solid black",
            boxShadow: "3px 3px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <button onClick={() => handleSelectType("Cut")}>Cut</button>
          <button onClick={() => handleSelectType("Hole")}>Hole</button>

          {/* Show Image Upload if Type is Selected */}
          {newDamage.type && (
            <>
              <input type="file" onChange={handleFileUpload} />
              <button onClick={handleSaveDamage}>OK</button>
              <button onClick={handleCancelDamage} style={{ marginLeft: "5px" }}>
                Cancel
              </button>
            </>
          )}
        </div>
      )}

      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>SUBMIT</button>
    </div>
  );
};

export default ConditionPage;
