function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <p>
        {role === "coach"
          ? "🎯 You are a Coach!"
          : role === "athlete"
          ? "🏃 You are an Athlete!"
          : "👤 Role not found"}
      </p>
    </div>
  );
}

export default Dashboard;
