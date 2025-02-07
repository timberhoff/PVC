import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PvcDetails from "./pages/PvcDetails";
import AddPvc from "./pages/AddPvc";
import ConfirmPvc from "./pages/ConfirmPvc";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pvc/:id" element={<PvcDetails />} />
      <Route path="/add-pvc" element={<AddPvc />} />
      <Route path="/confirm-pvc/:pvcId" element={<ConfirmPvc />} />
    </Routes>
  );
};

export default App;
