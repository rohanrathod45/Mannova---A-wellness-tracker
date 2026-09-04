import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/authApi";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // TEMPORARY FRONTEND SIGNUP
  // Backend will be connected later.
  // ==========================================
  const handleSignup = async (e) => {
  e.preventDefault();

  setError("");

  // Check empty fields
  if (
    fullName.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    setError("Please fill in all fields.");
    return;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    setError("Please enter a valid email address.");
    return;
  }

  // Validate password
  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  try {
    const response = await signupUser({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    console.log("Signup successful:", response);

    localStorage.setItem(
      "mannovaCurrentUser",
      JSON.stringify(response.user)
    );

    navigate("/login");

  } catch (error) {
    console.error("Signup error:", error);

    setError(
      error.response?.data?.message ||
      "Unable to create account. Please try again."
    );
  }
};

  return (
    <>
      {/* =========================================
          SIGNUP PAGE STYLES
          ========================================= */}
      <style>{`
        .mannova-signup-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;

          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(103, 75, 181, 0.07),
              transparent 35%
            ),
            radial-gradient(
              circle at 10% 90%,
              rgba(167, 139, 250, 0.10),
              transparent 35%
            ),
            #f8f9ff;

          color: #121c2a;
        }

        .mannova-signup-page *,
        .mannova-signup-page *::before,
        .mannova-signup-page *::after {
          box-sizing: border-box;
        }

        .signup-main {
          flex: 1;

          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          position: relative;

          padding: 40px 24px;
        }

        .signup-background {
          position: absolute;
          inset: 0;

          overflow: hidden;

          pointer-events: none;
        }

        .signup-bg-circle-one {
          position: absolute;

          width: 400px;
          height: 400px;

          top: -10%;
          right: -5%;

          border-radius: 50%;

          background: rgba(103, 75, 181, 0.05);

          filter: blur(100px);
        }

        .signup-bg-circle-two {
          position: absolute;

          width: 300px;
          height: 300px;

          bottom: -10%;
          left: -5%;

          border-radius: 50%;

          background: rgba(196, 181, 253, 0.10);

          filter: blur(100px);
        }

        .signup-container {
          width: 100%;
          max-width: 448px;

          position: relative;
          z-index: 2;
        }

        .signup-card {
          width: 100%;

          border-radius: 32px;

          padding: 40px;

          display: flex;
          flex-direction: column;
          gap: 24px;

          background: #ffffff;

          box-shadow:
            0 24px 60px rgba(40, 30, 70, 0.12),
            0 8px 24px rgba(40, 30, 70, 0.06);
        }

        .signup-header {
          text-align: center;

          display: flex;
          flex-direction: column;

          gap: 8px;
        }

        .signup-logo-wrapper {
          display: flex;
          justify-content: center;

          margin-bottom: 16px;
        }

        .signup-logo {
          width: 64px;
          height: 64px;

          border-radius: 16px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #f0eafa;

          color: #674bb5;
        }

        .signup-title {
          margin: 0;

          font-size: 28px;
          line-height: 1.3;

          font-weight: 600;

          color: #121c2a;
        }

        .signup-subtitle {
          margin: 0;

          color: #6b7280;

          font-size: 15px;
          line-height: 1.5;
        }

        .signup-form {
          display: flex;
          flex-direction: column;

          gap: 16px;
        }

        .signup-field {
          display: flex;
          flex-direction: column;

          gap: 6px;
        }

        .signup-label {
          margin-left: 4px;

          font-size: 14px;

          color: #121c2a;
        }

        .signup-input-wrapper {
          position: relative;

          width: 100%;
        }

        .signup-input {
          width: 100%;
          height: 48px;

          padding: 0 48px 0 20px;

          border: 1px solid transparent;

          border-radius: 999px;

          background: #f1f5f9;

          color: #121c2a;

          font-size: 15px;

          outline: none;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .signup-input::placeholder {
          color: #9ca3af;
        }

        .signup-input:focus {
          background: #ffffff;

          border-color: #674bb5;

          box-shadow:
            0 0 0 3px rgba(103, 75, 181, 0.12);
        }

        .signup-input-icon {
          position: absolute;

          right: 16px;
          top: 50%;

          transform: translateY(-50%);

          color: #9ca3af;

          pointer-events: none;
        }

        .signup-password-button {
          position: absolute;

          right: 12px;
          top: 50%;

          transform: translateY(-50%);

          border: none;

          background: transparent;

          padding: 4px;

          cursor: pointer;

          color: #9ca3af;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signup-password-button:hover {
          color: #674bb5;
        }

        .signup-error {
          margin: 0;

          text-align: center;

          font-size: 14px;

          color: #ef4444;
        }

        .signup-button {
          width: 100%;
          height: 56px;

          margin-top: 8px;

          border: none;

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              #674bb5 0%,
              #a78bfa 100%
            );

          color: white;

          font-size: 18px;

          font-weight: 700;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          box-shadow:
            0 10px 24px rgba(103, 75, 181, 0.20);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .signup-button:hover {
          transform: scale(1.02);

          box-shadow:
            0 14px 30px rgba(103, 75, 181, 0.28);
        }

        .signup-button:active {
          transform: scale(0.97);
        }

        .signup-divider {
          display: flex;

          align-items: center;

          gap: 16px;
        }

        .signup-divider-line {
          flex: 1;

          height: 1px;

          background: #e5e7eb;
        }

        .signup-divider-text {
          color: #6b7280;

          font-size: 14px;
        }

        .google-button {
          width: 100%;
          height: 56px;

          border: 1px solid #cac4d4;

          border-radius: 999px;

          background: #ffffff;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 12px;

          cursor: pointer;

          color: #121c2a;

          transition: background 0.2s ease;
        }

        .google-button:hover {
          background: #f8fafc;
        }

        .google-icon {
          font-size: 18px;
        }

        .google-text {
          font-size: 14px;
        }

        .signup-login {
          text-align: center;

          margin-top: 4px;
        }

        .signup-login-text {
          margin: 0;

          color: #4b5563;

          font-size: 15px;
        }

        .signup-login-button {
          border: none;

          background: transparent;

          padding: 0;

          color: #674bb5;

          font-weight: 700;

          cursor: pointer;
        }

        .signup-login-button:hover {
          text-decoration: underline;
        }

        .trust-badges {
          margin-top: 16px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 32px;

          opacity: 0.4;
        }

        .trust-badge {
          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 4px;
        }

        .trust-badge-text {
          font-size: 10px;

          text-transform: uppercase;

          letter-spacing: 0.15em;

          font-weight: 700;
        }

        @media (max-width: 640px) {
          .signup-main {
            padding: 24px 14px;
          }

          .signup-card {
            padding: 28px 22px;

            border-radius: 28px;
          }

          .signup-title {
            font-size: 26px;
          }
        }

        @media (max-width: 380px) {
          .signup-card {
            padding: 24px 18px;
          }

          .trust-badges {
            gap: 20px;
          }
        }
      `}</style>

      {/* =========================================
          SIGNUP PAGE
          ========================================= */}
      <div className="mannova-signup-page">

        <main className="signup-main">

          {/* Background */}
          <div className="signup-background">

            <div className="signup-bg-circle-one" />

            <div className="signup-bg-circle-two" />

          </div>

          {/* Card */}
          <section className="signup-container">

            <div className="signup-card">

              {/* =========================
                  HEADER
              ========================= */}
              <div className="signup-header">

                <div className="signup-logo-wrapper">

                  <div className="signup-logo">

                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                        fontSize: "32px",
                      }}
                    >
                      spa
                    </span>

                  </div>

                </div>

                <h2 className="signup-title">
                  Create Account
                </h2>

                <p className="signup-subtitle">
                  Step into your digital sanctuary.
                </p>

              </div>

              {/* =========================
                  FORM
              ========================= */}
              <form
                className="signup-form"
                onSubmit={handleSignup}
              >

                {/* FULL NAME */}
                <div className="signup-field">

                  <label
                    htmlFor="full_name"
                    className="signup-label"
                  >
                    Full Name
                  </label>

                  <div className="signup-input-wrapper">

                    <input
                      id="full_name"
                      name="fullName"
                      type="text"
                      placeholder="Enter your Name"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      autoComplete="name"
                      className="signup-input"
                    />

                    <span className="material-symbols-outlined signup-input-icon">
                      person
                    </span>

                  </div>

                </div>

                {/* EMAIL */}
                <div className="signup-field">

                  <label
                    htmlFor="email"
                    className="signup-label"
                  >
                    Email Address
                  </label>

                  <div className="signup-input-wrapper">

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      autoComplete="email"
                      className="signup-input"
                    />

                    <span className="material-symbols-outlined signup-input-icon">
                      mail
                    </span>

                  </div>

                </div>

                {/* PASSWORD */}
                <div className="signup-field">

                  <label
                    htmlFor="password"
                    className="signup-label"
                  >
                    Password
                  </label>

                  <div className="signup-input-wrapper">

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      autoComplete="new-password"
                      className="signup-input"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="signup-password-button"
                    >
                      <span className="material-symbols-outlined">
                        {showPassword
                          ? "lock_open"
                          : "lock"}
                      </span>
                    </button>

                  </div>

                </div>

                {/* ERROR */}
                {error && (
                  <p className="signup-error">
                    {error}
                  </p>
                )}

                {/* GET STARTED */}
                <button
                  type="submit"
                  className="signup-button"
                >

                  Get Started

                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>

                </button>

              </form>

              {/* =========================
                  DIVIDER
              ========================= */}
              <div className="signup-divider">

                <div className="signup-divider-line" />

                <span className="signup-divider-text">
                  OR
                </span>

                <div className="signup-divider-line" />

              </div>

              {/* =========================
                  GOOGLE
              ========================= */}
              <button
                type="button"
                className="google-button"
                onClick={() => {
                  alert(
                    "Google Sign Up will be connected later."
                  );
                }}
              >

                <span className="google-icon">
                  🌐
                </span>

                <span className="google-text">
                  Continue with Google
                </span>

              </button>

              {/* =========================
                  LOGIN
              ========================= */}
              <div className="signup-login">

                <p className="signup-login-text">

                  Already have an account?{" "}

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/login")
                    }
                    className="signup-login-button"
                  >
                    Login
                  </button>

                </p>

              </div>

              {/* =========================
                  TRUST BADGES
              ========================= */}
              <div className="trust-badges">

                <div className="trust-badge">

                  <span className="material-symbols-outlined">
                    verified_user
                  </span>

                  <span className="trust-badge-text">
                    Secure
                  </span>

                </div>

                <div className="trust-badge">

                  <span className="material-symbols-outlined">
                    privacy_tip
                  </span>

                  <span className="trust-badge-text">
                    Private
                  </span>

                </div>

                <div className="trust-badge">

                  <span className="material-symbols-outlined">
                    cloud_done
                  </span>

                  <span className="trust-badge-text">
                    Synced
                  </span>

                </div>

              </div>

            </div>

          </section>

        </main>

      </div>
    </>
  );
}