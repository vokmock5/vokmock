import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import VoiceInterview from "./pages/VoiceInterview";
import VRRoom from "./pages/VRRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/interview" element={<VoiceInterview />} />
        <Route path="/vr" element={<VRRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
