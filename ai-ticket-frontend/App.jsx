// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicketDetailsPage from "./src/pages/ticket"; // Make sure this file exists

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ticket/:id" element={<TicketDetailsPage />} />
        {/* Add more routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
