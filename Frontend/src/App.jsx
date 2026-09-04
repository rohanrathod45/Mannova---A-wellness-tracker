import { BrowserRouter, Routes, Route } from "react-router-dom";

import Mood from "./pages/Mood";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Exercises from "./pages/Exercises";
import Progress from "./pages/Progress";
import Breathing from "./pages/Breathing";
import Onboarding from "./pages/Onboarding";

import ProtectedRoute from "./components/ProtectedRoute";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>

        {/* =====================================================
            PUBLIC ROUTES
            These can be accessed without login
        ===================================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/about" element={<About />} />


        {/* =====================================================
            PROTECTED ROUTES
            Login is required for everything below
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/mood"
            element={<Mood />}
          />

          <Route
            path="/exercises"
            element={<Exercises />}
          />

          <Route
            path="/chat"
            element={<Chat />}
          />

          <Route
            path="/progress"
            element={<Progress />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/breathing"
            element={<Breathing />}
          />

          <Route
            path="/onboarding"
            element={<Onboarding />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

        </Route>


        {/* =====================================================
            404
        ===================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
    </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;