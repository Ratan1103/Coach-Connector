import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CoachRegister from "./pages/CoachRegister";
import AthleteRegister from "./pages/AthleteRegister";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/register/coach">Coach Register</Link> |{" "}
        <Link to="/register/athlete">Athlete Register</Link> |{" "}
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/register/coach" element={<CoachRegister />} />
        <Route path="/register/athlete" element={<AthleteRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
