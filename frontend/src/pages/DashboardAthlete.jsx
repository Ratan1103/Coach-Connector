// src/pages/AthleteDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { User, MapPin, Dumbbell, Calendar, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AthleteDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");

    // If no token -> redirect to login
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    axios
      .get("http://localhost:8000/api/athlete/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        // Invalid/expired token -> force logout
        handleLogout();
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login", { replace: true }); // redirect to login
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!profile) return <p className="text-center mt-10 text-red-500">Error fetching profile</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Header with Logout */}
      <header className="flex items-center justify-between px-10 py-4 shadow-sm bg-white sticky top-0 z-50">
        <h1 className="text-xl font-bold text-gray-900">🏅 Athlete Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Welcome, {profile.name || profile.user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </header>

      {/* Profile Section */}
      <section className="px-6 py-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 shadow-lg rounded-2xl bg-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
              Athlete Profile
            </h2>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className="text-blue-600 w-6 h-6" />
                <p><b>Name:</b> {profile.name || profile.user?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <Dumbbell className="text-orange-500 w-6 h-6" />
                <p><b>Sport:</b> {profile.sport}</p>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-green-600 w-6 h-6" />
                <p><b>Age:</b> {profile.age} years</p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-purple-500 w-6 h-6" />
                <p><b>Location:</b> {profile.location}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
