
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Tickets from "./pages/tickets";
import TicketDetailsPage from "./pages/ticket";
import AdminPanel from "./pages/admin";
import Navbar from "./components/navbar";
import CheckAuth from "./components/check-auth";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <CheckAuth protectedRoute>
              <Tickets />
            </CheckAuth>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <CheckAuth protectedRoute>
              <TicketDetailsPage />
            </CheckAuth>
          }
        />

        
       <Route
  path="/admin"
  element={
    <CheckAuth protectedRoute adminOnly>
      <AdminPanel />
    </CheckAuth>
  }
/>

      </Routes>
    </>
  );
}
