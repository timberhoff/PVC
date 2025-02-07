import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPvc = () => {
  const [pvcId, setPvcId] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [condition, setCondition] = useState("good");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pvcId || !length || !width) {
      alert("Please fill in all fields!");
      return;
    }

    navigate(`/confirm-pvc/${pvcId}`, { state: { pvcId, length, width, condition } });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10vh" }}>
      <h1>Add New PVC Cover</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter PVC ID"
          value={pvcId}
          onChange={(e) => setPvcId(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", marginBottom: "10px" }}
        /><br />

        <input
          type="number"
          placeholder="Length (m)"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", marginBottom: "10px" }}
        /><br />

        <input
        type="text" // Using text to allow custom formatting
        placeholder="Width (m)"
        value={width}
        onChange={(e) => {
            let input = e.target.value.replace(/\./g, ""); // Remove existing dots

            if (input.length > 1) {
            input = input[0] + "." + input.slice(1); // Add dot after the first digit
            }

            setWidth(input);
        }}
        onBlur={() => {
            if (width.endsWith(".")) {
            setWidth(width.slice(0, -1)); // Remove trailing dot when leaving input
            }
        }}
        style={{ padding: "10px", fontSize: "16px", marginBottom: "10px" }}
        /><br />


        <label>Condition:</label><br />
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="very good">Very Good</option>
          <option value="good">Good</option>
          <option value="bad">Bad</option>
          <option value="rubbish">Rubbish</option>
        </select><br /><br />

        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPvc;
