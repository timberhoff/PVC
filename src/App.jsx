import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PvcDetails from "./pages/PvcDetails";
import AddPvc from "./pages/AddPvc";
import ConfirmPvc from "./pages/ConfirmPvc";
import ConditionPage from "./pages/ConditionPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pvc/:id" element={<PvcDetails />} />
      <Route path="/add-pvc" element={<AddPvc />} />
      <Route path="/confirm-pvc/:pvcId" element={<ConfirmPvc />} />
      <Route path="/add-condition/:pvcId" element={<ConditionPage />} />
    </Routes>
  );
};

export default App;
