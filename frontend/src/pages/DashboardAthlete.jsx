// src/pages/DashboardAthlete.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, MapPin, Dumbbell, Calendar, Trophy, Star, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AthleteDashboard() {
  const [profile, setProfile] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Fetch athlete profile
    axios
      .get("http://localhost:8000/api/athlete/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        return Promise.all([
          axios.get(`http://localhost:8000/api/coaches/${res.data.sport}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/requests/my/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
      })
      .then(([coachesRes, requestsRes]) => {
        // Map request status to coaches
        const requestMap = {};
        requestsRes.data.forEach((r) => {
          requestMap[r.coach] = r.status;
        });

        const coachesWithStatus = coachesRes.data.map((coach) => ({
          ...coach,
          requestStatus: requestMap[coach.id] || null,
        }));

        setCoaches(coachesWithStatus);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        handleLogout();
      });
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login", { replace: true });
  };

  const handleRequestCoach = async (coachId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/requests/create/",
        { coach: coachId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCoaches((prev) =>
        prev.map((c) =>
          c.id === coachId ? { ...c, requestStatus: "requested" } : c
        )
      );
      alert("Request sent! Status: Requested");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Error sending request");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!profile) return <p className="text-center mt-10 text-red-500">Error fetching profile</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 ">
      <header className="flex items-center justify-between px-10 py-4 shadow-sm bg-white sticky top-0 z-50">
        <h1 className="text-xl font-bold text-gray-900">🏅 Athlete Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Welcome, {profile.user?.name || profile.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </header>

      {/* Athlete Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl mx-auto mb-10 mt-10">
        <h2 className="text-xl font-bold text-center text-blue-600 mb-6">
          Athlete Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-500" />
            <p><span className="font-semibold">Name:</span> {profile.user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-orange-500" />
            <p><span className="font-semibold">Sport:</span> {profile.sport}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-green-500" />
            <p><span className="font-semibold">Age:</span> {profile.age} years</p>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-purple-500" />
            <p><span className="font-semibold">Location:</span> {profile.location}</p>
          </div>
        </div>
      </div>

      {/* Coaches List */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-center text-green-600 mb-6">
          Coaches for {profile.sport}
        </h2>
        {coaches.length === 0 ? (
          <p className="text-center text-gray-600">No coaches available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coaches.map((coach) => {
              const status = (coach.requestStatus || "").toString().toLowerCase();
              const isApproved = status === "approved";
              const isRejected = status === "rejected";
              const isRequested = status === "requested";

              return (
                <motion.div
                  key={coach.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
                >
                  {/* Tick icon for approved */}
                  {isApproved && (
                    <div className="absolute top-3 right-3 bg-green-500 w-8 h-8 flex items-center justify-center rounded-full text-white text-lg font-bold">
                      ✓
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <User className="w-10 h-10 text-blue-500" />
                    <h3 className="text-xl font-bold text-blue-700">{coach.user?.name}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <Dumbbell className="w-4 h-4" /> {coach.sport}
                    </span>
                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      <Star className="w-4 h-4" /> {coach.experience} yrs
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">
                    <MapPin className="inline w-5 h-5 mr-1 text-purple-500" />
                    {coach.location || "Location not specified"}
                  </p>

                  <button
                    onClick={() => handleRequestCoach(coach.id)}
                    disabled={isApproved || isRejected || isRequested}
                    className={`${
                      isApproved
                        ? "bg-green-500 cursor-not-allowed"
                        : isRequested
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : isRejected
                        ? "bg-red-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white font-semibold px-4 py-2 rounded-xl w-full transition-colors duration-300`}
                  >
                    {status
                      ? status.charAt(0).toUpperCase() + status.slice(1)
                      : "Contact Coach"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
