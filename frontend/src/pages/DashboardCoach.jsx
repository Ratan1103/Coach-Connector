// src/pages/DashboardCoach.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { LogOut, User, Trophy, Star } from "lucide-react";

export default function DashboardCoach() {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Fetch coach profile
    axios
      .get("http://localhost:8000/api/coach/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));

    // Fetch athlete requests
    axios
      .get("http://localhost:8000/api/requests/my/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login", { replace: true });
  };

  const handleRequestUpdate = async (id, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/requests/update/${id}/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: res.data.status } : req))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating request");
    }
  };

  const handleRequestDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/requests/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error deleting request");
    }
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
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl mx-auto mb-8">
        <h2 className="text-xl font-bold text-center text-blue-600 mb-6">
          Coach Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-500" />
            <p>
              <span className="font-semibold">Name:</span> {profile.user?.name || "N/A"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-orange-500" />
            <p>
              <span className="font-semibold">Sport:</span> {profile.sport || "N/A"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500" />
            <p>
              <span className="font-semibold">Experience:</span> {profile.experience || 0} years
            </p>
          </div>
        </div>
      </div>

      {/* Athlete Requests */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-center text-green-600 mb-6">
          Athlete Requests
        </h2>
        {requests.length === 0 ? (
          <p className="text-center text-gray-500">No requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => {
              const status = (req.status || "").toLowerCase();
              const isApproved = status === "approved";
              const isRejected = status === "rejected";

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 relative"
                >
                  {/* Status icons */}
                  {isApproved && (
                    <div className="absolute top-3 right-3 bg-green-500 w-8 h-8 flex items-center justify-center rounded-full text-white text-lg font-bold">
                      ✓
                    </div>
                  )}
                  {isRejected && (
                    <div className="absolute top-3 right-3 bg-red-500 w-8 h-8 flex items-center justify-center rounded-full text-white text-lg font-bold">
                      ✗
                    </div>
                  )}

                  <p>
                    <span className="font-semibold">Athlete Name:</span> {req.athlete.user.name}
                  </p>
                  <p>
                    <span className="font-semibold">Sport:</span> {req.athlete.sport}
                  </p>
                  <p>
                    <span className="font-semibold">Age:</span> {req.athlete.age || "N/A"}
                  </p>

                  <div className="flex gap-4 mt-4">
                    <Button
                      onClick={() => handleRequestUpdate(req.id, "approved")}
                      disabled={isApproved || isRejected}
                      className={`text-white ${
                        isApproved
                          ? "bg-green-500 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRequestUpdate(req.id, "rejected")}
                      disabled={isApproved || isRejected}
                      className={`text-white ${
                        isRejected
                          ? "bg-red-500 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleRequestDelete(req.id)}
                      className="bg-gray-400 hover:bg-gray-500 text-white"
                    >
                      Delete
                    </Button>
                  </div>

                  <p className="mt-2">
                    <span className="font-semibold">Status:</span>{" "}
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
