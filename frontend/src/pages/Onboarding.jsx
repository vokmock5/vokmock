import { useState } from "react";

export default function Onboarding() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    domain: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const userProfile = {
    name: formData.name,
    email: formData.email,
    domain: formData.domain,
    resumeName: formData.resume?.name,
  };

  localStorage.setItem(
    "userProfile",
    JSON.stringify(userProfile)
  );

  console.log("Saved profile:", userProfile);

  // next step: VR
};

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Tell Us About Yourself
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        {/* Domain */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Domain</label>
          <select
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-pink-500"
            required
          >
            <option value="">Select your domain</option>
            <option value="Frontend">Frontend Development</option>
            <option value="Backend">Backend Development</option>
            <option value="Fullstack">Full Stack</option>
            <option value="ML">Machine Learning</option>
            <option value="Student">Student / Fresher</option>
          </select>
        </div>

        {/* Resume Upload */}
        <div className="mb-6">
          <label className="block mb-1 text-sm">Upload Resume (PDF)</label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleChange}
            className="w-full text-sm"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 transition py-3 rounded-lg font-semibold"
        >
          Continue to Interview →
        </button>
      </form>
    </div>
  );
}
