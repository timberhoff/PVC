import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchId.trim() && !isNaN(searchId)) {
      navigate(`/pvc/${searchId}`);
    } else {
      alert("Please enter a valid number");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Welcome to PVC Tracker</h1>

      <input
        type="text"
        placeholder="Enter PVC Cover ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
      />
      <button onClick={handleSearch} style={{ padding: "10px 15px", fontSize: "16px" }}>
        Search
      </button>

      <br /><br />

      <button 
        onClick={() => navigate("/add-pvc")} 
        style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "green", color: "white" }}
      >
        Add New PVC
      </button>
    </div>
  );
};

export default Home;
