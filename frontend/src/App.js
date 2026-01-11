import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import VoiceInterview from "./pages/VoiceInterview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/interview" element={<VoiceInterview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
