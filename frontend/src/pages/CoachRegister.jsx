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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 px-6">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register as a <span className="text-blue-600">Coach</span>
        </h2>

        {/* Input Fields */}
        <div className="space-y-4">
          {[
            { type: "text", name: "name", placeholder: "Full Name" },
            { type: "email", name: "email", placeholder: "Email" },
            { type: "password", name: "password", placeholder: "Password" },
            { type: "text", name: "phone", placeholder: "Phone Number" },
            { type: "text", name: "experience", placeholder: "Experience (e.g. 5 years)" },
            { type: "text", name: "sport", placeholder: "Sport (e.g. Cricket, Football)" },
          ].map((field, idx) => (
            <input
              key={idx}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:opacity-90 transition"
        >
          Register Coach
        </button>

        {/* Extra Links */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterCoach;
