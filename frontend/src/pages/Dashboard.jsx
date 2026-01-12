import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteInterview = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this interview history?"
  );

  if (!confirmDelete) return;

  try {
    await fetch(`http://localhost:5000/api/interviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    // 🔥 Update state (important)
    setInterviews((prev) =>
      prev.filter((interview) => interview._id !== id)
    );
  } catch (err) {
    console.error("Failed to delete interview", err);
    alert("Failed to delete interview");
  }
};


  // 🔐 Logout
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   navigate("/login");
  // };

  const handleLogout = () => {
  localStorage.clear(); // 💣 sab clear
  navigate("/login", { replace: true });
};


  // 📡 Fetch interviews from backend
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/interviews", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();

if (res.ok && Array.isArray(data.interviews)) {
  setInterviews(data.interviews);
} else {
  console.error("Invalid interviews response:", data);
  setInterviews([]); // 💥 CRASH PREVENTION
}

      } catch (err) {
        console.error("Failed to fetch interviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return <p className="p-10 text-slate-500">Loading dashboard...</p>;
  }

  return (
    // <div className="min-h-screen bg-slate-50 text-slate-900">
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">
      {/* Background texture */}
<div
  className="absolute inset-0 opacity-10 z-0"
  style={{
    backgroundImage:
      "url(https://images.unsplash.com/photo-1620555791739-438a95e7ff65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBtZXNoJTIwbmV0d29yayUyMGJsdWV8ZW58MHx8fHwxNzY4MTM4Njc3fDA&ixlib=rb-4.1.0&q=85)",
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}
/>
      {/* Navbar */}
      <div className="relative z-10 flex items-center justify-between px-8 py-5 bg-white border-b">

        <h1 className="text-xl font-bold">VokMock</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 font-medium hover:text-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* <div className="max-w-6xl mx-auto px-6 py-10"> */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
      

        <h2 className="text-3xl font-bold mb-8">Your Dashboard</h2>

        {/* Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* <div className="bg-white rounded-xl p-6 border-2 border-slate-300/30"> */}
          <div className="bg-white/4 border border-white/8 rounded-3xl p-7 backdrop-blur-[12px]">
            <p className="text-sm text-slate-500">Total Interviews</p>
            <h3 className="text-3xl font-bold mt-2">
              {interviews?.length||0}
            </h3>
          </div>
{/* 
          <div className="bg-white rounded-xl p-6 border-2 border-slate-300/30"> */}
          <div className="bg-white/4 border border-white/8 rounded-3xl p-7 backdrop-blur-[12px]">
            <p className="text-sm text-slate-500">Average Score</p>
            <h3 className="text-3xl font-bold mt-2">
              {interviews.length
                ? (
                    interviews.reduce(
                      (sum, i) => sum + (i.feedback?.score || 0),
                      0
                    ) / interviews.length
                  ).toFixed(1)
                : "—"}
            </h3>
          </div>

          {/* <div className="bg-white rounded-xl p-6 border-2 border-slate-300/30"> */}
          <div className="bg-white/4 border border-white/8 rounded-3xl p-7 backdrop-blur-[12px]">
            <p className="text-sm text-slate-500">Last Interview</p>
            <h3 className="text-lg font-semibold mt-2">
              {interviews[0]
                ? new Date(interviews[0].createdAt).toDateString()
                : "—"}
            </h3>
          </div>
        </div>

        {/* Interview History */}
        <h3 className="text-2xl font-semibold mb-6">
          Interview History
        </h3>

        {interviews?.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border text-center">
            <p className="text-slate-500 mb-4">
              You haven’t taken any interviews yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(interviews) && interviews?.map((interview) => (
              <div
                key={interview._id}
                // className="bg-white rounded-xl p-6 border"
          // className="bg-white rounded-xl p-6 border-2 border-slate-300/30"

           className="bg-white/4 border border-white/8 rounded-3xl p-7 backdrop-blur-[12px]"
              >
                {/* <div className="flex justify-between"> */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold">
                      {interview.interviewTitle}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {new Date(interview.createdAt).toDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
    <span className="font-bold text-indigo-600">
      Score: {interview.feedback?.score || 0}/10
    </span>

    {/* 🗑️ Delete button */}
    <button
      onClick={() => handleDeleteInterview(interview._id)}
      className="text-sm text-red-500 hover:text-red-600 transition"
    >
      Delete
    </button>
  </div>
                  {/* <div className="font-bold text-indigo-600">
                    Score: {interview.feedback?.score || 0}/10
                  </div> */}
                </div>

                <p className="text-slate-600 mt-4">
                  {interview.feedback?.strengths?.[0] ||
                    "No summary available"}
                </p>

                <button
                  onClick={() =>
                    navigate(`/feedback/${interview._id}`)
                  }
                  className="mt-4 text-sm text-indigo-600"
                >
                  View Full Feedback →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;