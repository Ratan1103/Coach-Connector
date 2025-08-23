import React, { useState } from "react";
import axios from "axios";

const RegisterCoach = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    experience: "",
    sport: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register/coach/", formData);
      alert("Coach registered successfully ✅");
      console.log(res.data);
    } catch (err) {
      alert("Error registering coach ❌");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg shadow-lg">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="experience"
        placeholder="Experience (e.g. 5 years)"
        value={formData.experience}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="sport"
        placeholder="Sport (e.g. Cricket, Football)"
        value={formData.sport}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Register Coach
      </button>
    </form>
  );
};

export default RegisterCoach;
