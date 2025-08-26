import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import CoachRegister from "./pages/CoachRegister";
import AthleteRegister from "./pages/AthleteRegister";
import Login from "./pages/Login";
import Home from "./pages/Home";
import DashboardCoach from "./pages/DashboardCoach";
import DashboardAthlete from "./pages/DashboardAthlete";
import ProtectedRoute from "./components/ProtectedROute";

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
            <Route path="/register/coach" element={<CoachRegister />} />
            <Route path="/register/athlete" element={<AthleteRegister />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />

            {/* Athlete Dashboard */}
            <Route element={<ProtectedRoute allowedRole="athlete" />}>
              <Route path="/dashboard/athlete" element={<DashboardAthlete />} />
            </Route>

            {/* Coach Dashboard */}
            <Route element={<ProtectedRoute allowedRole="coach" />}>
              <Route path="/dashboard/coach" element={<DashboardCoach />} />
            </Route>
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
