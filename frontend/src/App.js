import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import VoiceInterview from "./pages/VoiceInterview";
import Feedback from "./pages/feedback";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/interview" element={<VoiceInterview />} />
        <Route path="/feedback/:id" element={ <ProtectedRoute>
      <Feedback />
    </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={ <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
