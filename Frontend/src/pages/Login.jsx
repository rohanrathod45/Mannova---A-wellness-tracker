import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import loginLogo from "../assets/login_logo.jpeg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Temporary frontend login
  // Backend/JWT will be connected after the UI is confirmed working.
  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (!email.trim() || !password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    const response = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });

    console.log("Login successful:", response);

    // Save JWT token
    localStorage.setItem("token", response.token);

    // Save logged-in user
    localStorage.setItem(
      "mannovaCurrentUser",
      JSON.stringify(response.user)
    );

    // Continue to application
    navigate("/onboarding");

  } catch (error) {
    console.error("Login error:", error);

    setError(
      error.response?.data?.message ||
      "Invalid email or password."
    );
  }
};

  return (
    <>
      {/* =========================================================
          LOGIN PAGE STYLES
          These styles are kept inside Login.jsx so the page does
          not depend on App.css or index.css for the card.
      ========================================================= */}
      <style>{`
        .mannova-login-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          position: relative;
          overflow: hidden;

          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(224, 213, 255, 0.55),
              transparent 35%
            ),
            radial-gradient(
              circle at 85% 80%,
              rgba(244, 218, 255, 0.55),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #f8f5ff 0%,
              #fdfaff 50%,
              #f5f0ff 100%
            );

          box-sizing: border-box;
        }

        .mannova-login-page *,
        .mannova-login-page *::before,
        .mannova-login-page *::after {
          box-sizing: border-box;
        }

        .mannova-login-container {
          width: 100%;
          max-width: 448px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .mannova-login-card {
          width: 100%;
          overflow: hidden;
          border-radius: 32px;

          background: rgba(255, 255, 255, 0.78);

          border: 1px solid rgba(255, 255, 255, 0.75);

          box-shadow:
            0 24px 60px rgba(92, 67, 140, 0.14),
            0 8px 24px rgba(92, 67, 140, 0.08);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .mannova-login-content {
          padding: 40px;
        }

        .mannova-logo-wrapper {
          width: 96px;
          height: 96px;
          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background: rgba(255, 255, 255, 0.9);

          box-shadow:
            0 10px 30px rgba(92, 67, 140, 0.12);

          margin: 0 auto;
        }

        .mannova-logo {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 50%;
        }

        .mannova-brand {
          margin-top: 16px;
          text-align: center;
        }

        .mannova-title {
          margin: 0;

          font-size: 48px;
          line-height: 1.1;
          font-weight: 600;
          letter-spacing: -1.5px;

          color: #7255a8;
        }

        .mannova-subtitle {
          margin: 8px 0 0;

          font-size: 17px;
          line-height: 1.65;

          color: #6d6878;
        }

        .mannova-login-form {
          margin-top: 32px;

          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mannova-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mannova-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .mannova-label {
          display: block;

          font-size: 14px;
          line-height: 1.4;
          font-weight: 500;

          color: #686372;
        }

        .mannova-forgot {
          border: none;
          background: transparent;
          padding: 0;

          font-size: 14px;
          font-weight: 500;

          color: #7255a8;

          cursor: pointer;
          white-space: nowrap;

          transition: color 0.2s ease;
        }

        .mannova-forgot:hover {
          color: #59418a;
        }

        .mannova-input-wrapper {
          position: relative;
          width: 100%;
        }

        .mannova-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;

          transform: translateY(-50%);

          color: #8b8793;

          font-size: 20px;

          pointer-events: none;
          user-select: none;
        }

        .mannova-input {
          width: 100%;
          height: 50px;

          border: 1px solid transparent;
          border-radius: 24px;

          background: #f1f5f9;

          padding: 0 16px 0 48px;

          font-size: 15px;
          color: #37333d;

          outline: none;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .mannova-input::placeholder {
          color: #92909a;
        }

        .mannova-input:hover {
          background: #edf1f6;
        }

        .mannova-input:focus {
          background: #ffffff;
          border-color: #7255a8;

          box-shadow:
            0 0 0 3px rgba(114, 85, 168, 0.12);
        }

        .mannova-password-input {
          padding-right: 50px;
        }

        .mannova-password-button {
          position: absolute;

          right: 14px;
          top: 50%;

          transform: translateY(-50%);

          border: none;
          background: transparent;

          padding: 6px;

          color: #8b8793;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          transition: color 0.2s ease;
        }

        .mannova-password-button:hover {
          color: #7255a8;
        }

        .mannova-login-button {
          width: 100%;
          height: 50px;

          border: none;
          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              #7255a8 0%,
              #9270c4 100%
            );

          color: white;

          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.3px;

          cursor: pointer;

          box-shadow:
            0 10px 24px rgba(114, 85, 168, 0.22);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .mannova-login-button:hover {
          transform: scale(1.02);

          box-shadow:
            0 14px 30px rgba(114, 85, 168, 0.28);
        }

        .mannova-login-button:active {
          transform: scale(0.97);
        }

        .mannova-login-button-content {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .mannova-login-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.7);

          background: rgba(255, 255, 255, 0.72);

          padding: 16px 24px;

          text-align: center;
        }

        .mannova-footer-text {
          margin: 0;

          font-size: 14px;

          color: #6d6878;
        }

        .mannova-signup-link {
          display: inline-block;

          margin-top: 8px;

          font-size: 14px;
          font-weight: 600;

          color: #7255a8;

          text-decoration: none;

          transition: color 0.2s ease;
        }

        .mannova-signup-link:hover {
          color: #59418a;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .mannova-login-page {
            padding: 20px 14px;
          }

          .mannova-login-content {
            padding: 28px 22px;
          }

          .mannova-logo-wrapper {
            width: 82px;
            height: 82px;
          }

          .mannova-logo {
            width: 56px;
            height: 56px;
          }

          .mannova-title {
            font-size: 40px;
          }

          .mannova-subtitle {
            font-size: 15px;
          }

          .mannova-login-card {
            border-radius: 28px;
          }
        }

        @media (max-width: 380px) {
          .mannova-login-content {
            padding: 24px 18px;
          }

          .mannova-title {
            font-size: 36px;
          }

          .mannova-label-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .mannova-forgot {
            margin-top: 2px;
          }
        }
      `}</style>

      {/* =========================================================
          LOGIN PAGE
      ========================================================= */}
      <div className="mannova-login-page">

        <main className="mannova-login-container">

          <div className="mannova-login-card">

            {/* =========================
                LOGIN CONTENT
            ========================= */}
            <div className="mannova-login-content">

              {/* Logo + Heading */}
              <div>

                <div className="mannova-logo-wrapper">
  <img
    src={loginLogo}
    alt="Mannova Logo"
    className="mannova-logo"
  />
</div>

                <div className="mannova-brand">

                  <h1 className="mannova-title">
                    Mannova
                  </h1>

                  <p className="mannova-subtitle">
                    Welcome back to your space of calm.
                  </p>

                </div>

              </div>

              {/* =========================
                  LOGIN FORM
              ========================= */}
              <form
                className="mannova-login-form"
                onSubmit={handleSubmit}
              >

                {/* Email */}
                <div className="mannova-field">

                  <label
                    htmlFor="email"
                    className="mannova-label"
                  >
                    Email
                  </label>

                  <div className="mannova-input-wrapper">

                    <span className="material-symbols-outlined mannova-input-icon">
                      mail
                    </span>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="mannova-input"
                    />

                  </div>

                </div>

                {/* Password */}
                <div className="mannova-field">

                  <div className="mannova-label-row">

                    <label
                      htmlFor="password"
                      className="mannova-label"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="mannova-forgot"
                      onClick={() => {
                        alert(
                          "Forgot Password functionality will be added later."
                        );
                      }}
                    >
                      Forgot Password?
                    </button>

                  </div>

                  <div className="mannova-input-wrapper">

                    <span className="material-symbols-outlined mannova-input-icon">
                      lock
                    </span>

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="mannova-input mannova-password-input"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="mannova-password-button"
                    >
                      <span className="material-symbols-outlined">
                        {showPassword
                          ? "visibility"
                          : "visibility_off"}
                      </span>
                    </button>

                  </div>

                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="mannova-login-button"
                >
                  <span className="mannova-login-button-content">

                    Login

                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>

                  </span>
                </button>

              </form>

            </div>

            {/* =========================
                SIGNUP FOOTER
            ========================= */}
            <div className="mannova-login-footer">

              <p className="mannova-footer-text">
                Don't have an account?
              </p>

              <Link
                to="/signup"
                className="mannova-signup-link"
              >
                Sign Up
              </Link>

            </div>

          </div>

        </main>

      </div>
    </>
  );
}