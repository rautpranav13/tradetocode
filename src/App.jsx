import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddTeam from "./pages/AddTeam";
import UpdateTeam from "./pages/UpdateTeam";
import ParticipantLogin from "./pages/ParticipantLogin";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/add-team" element={<AddTeam />} />
        <Route path="/admin/update-team" element={<UpdateTeam />} />
        <Route path="/participant" element={<ParticipantLogin />} />
        <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
