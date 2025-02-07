import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ConfirmPvc = () => {
  const { state } = useLocation();
  const { pvcId } = useParams();
  const navigate = useNavigate();

  if (!state) return <p>Error: No data found.</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "10vh" }}>
      <h1>Confirm PVC Cover Information</h1>
      <p><strong>ID:</strong> {pvcId}</p>
      <p><strong>Length:</strong> {state.length} cm</p>
      <p><strong>Width:</strong> {state.width} cm</p>
      <p><strong>Condition:</strong> {state.condition}</p>

      <button onClick={() => navigate("/")} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Go Home
      </button>
    </div>
  );
};

export default ConfirmPvc;
