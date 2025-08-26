import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { LogOut, User, Trophy, Star } from "lucide-react";

export default function DashboardCoach() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    axios.get("http://localhost:8000/api/coach/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })

      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    // remove token from localStorage
    localStorage.removeItem("access");
  localStorage.removeItem("refresh");
    navigate("/login", { replace: true });
  };
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile) return <p className="text-center mt-10">Error fetching profile</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Coach Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            Welcome, <b>{profile.user?.name}</b>
          </span>
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-center text-blue-600 mb-6">
          Coach Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-500" />
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {profile.user?.name || "N/A"}
            </p>
          </div>

          {/* Sport */}
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-orange-500" />
            <p>
              <span className="font-semibold">Sport:</span>{" "}
              {profile.sport || "N/A"}
            </p>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500" />
            <p>
              <span className="font-semibold">Experience:</span>{" "}
              {profile.experience || "0"} years
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
