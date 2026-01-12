// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Signup() {
//   const [fullName, setFullName] = useState(""); // NOT `name`
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     const res = await fetch("http://localhost:5000/api/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: fullName, // backend expects `name`
//         email,
//         password
//       })
//     });

//     const data = await res.json();

//     if (res.ok) {
//       navigate("/login");
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSignup}>
//       <input
//         placeholder="Full Name"
//         value={fullName}
//         onChange={(e) => setFullName(e.target.value)}
//       />
//       <input
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit">Signup</button>
//     </form>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  // concept same
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName, // backend expects `name`
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1620555791739-438a95e7ff65)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Signup Card */}
      <form
        onSubmit={handleSignup}
        className="relative z-10 w-full max-w-md bg-transparent/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account ✨
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">
            {error}
          </p>
        )}

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Full Name</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/40 border border-white/20 focus:outline-none focus:border-indigo-400"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/40 border border-white/20 focus:outline-none focus:border-indigo-400"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/40 border border-white/20 focus:outline-none focus:border-indigo-400"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 font-semibold transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-4 text-black-300">
          Already have an account?{" "}
          <span
            className="text-indigo-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}