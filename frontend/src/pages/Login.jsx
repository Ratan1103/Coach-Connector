import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/login/", {
      email,
      password,
    });
    console.log("✅ Logged in:", res.data);
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    localStorage.setItem("role", res.data.role);  // 👈 Save role
    alert("Login Successful!");
    window.location.href = "/dashboard"; // redirect
  } catch (err) {
    console.error("❌ Error:", err.response?.data);
    alert("Login Failed!");
  }
};

  return (
    <form onSubmit={handleLogin} className="p-4 space-y-2">
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
