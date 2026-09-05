import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function App() {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Layout>
      <main className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">

        {/* Background Blur */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-100 rounded-full blur-[100px]"></div>

        <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-pink-100 rounded-full blur-[120px]"></div>

        {/* ===================== HERO SECTION ===================== */}

        <section className="relative pt-4 pb-20 md:pt-6 md:pb-32 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div className="space-y-6 z-10">

              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-container/10 border border-primary-container/20">
                <span className="text-purple-700 uppercase tracking-widest text-sm">
                  New: Guided Breathwork
                </span>
              </div>

              <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight">
                Understand Your Mind.
                <br />
                <span className="text-purple-700">
                  Improve Your Life.
                </span>
              </h1>

              <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] text-gray-600 max-w-lg leading-relaxed">
                Mannova provides a digital sanctuary where science-backed
                mindfulness meets empathetic AI support. Start your journey to
                emotional clarity today.
              </p>

              {/* TOP BUTTONS
                  Visible only when user is NOT logged in
              */}
              {!isLoggedIn && (
                <div className="flex flex-wrap gap-4">

                  <button
                    onClick={() => navigate("/login")}
                    className="bg-gradient-to-r from-purple-400 to-purple-700 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2"
                  >
                    Get Started

                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="border border-primary text-purple-700 px-8 py-4 rounded-full"
                  >
                    Login
                  </button>

                </div>
              )}

              {/* Trusted Members */}
              <div className="flex items-center gap-4 pt-6">

                <div className="flex -space-x-3">

                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBytgOdL6WCmOxakC1qPBQs1yswiuQl3N3CcfG9cgFB4ExWvdWmZWiqNPXKfxbWBsJsX6rZD7sXjc-AUxLjaZ1HDsE8F72gy479DXUCIggy69W3hVsc4Byuamw_ITpKVct2bk7Zdeb4FaHM5A0SL2I-9qbIVV33coV4pP32BuxRuuGe0MuVSd3CTyoJuweEi7hexVLAKQiO6biRZP-ceFgzpLQpkGxBTYEv8hRaLjW7Yjq5w14K6GzJTw"
                    alt=""
                  />

                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLZqSideQSr5VRzxZ0U-UI6hsEvaEtZeruh3OD3eUJI0ccwk6mpZGMShGXcMhQ4XF4RoHg7a4_l0wi5lNqXe4B8t9Fo-Cj05mQjKWU9zn8NZ7G3o8MtavkyvmQ8sYfPEEtQFhyURjuZTnLui2GlPqSuIH3s3rVDiAvwhia7SLUpYuxY5fC2Fo-41ZNUorawFDHsCF2ychLqOfPyrJ39fk_l_dP0G2J6sNV-QbfKWSDmHcwxVQROPjywA"
                    alt=""
                  />

                </div>

                <span className="text-sm text-gray-600">
                  Trusted by 12,000+ members
                </span>

              </div>

            </div>

            {/* Right */}
            <div className="relative flex justify-center">

              <div className="relative w-full max-w-lg h-[340px] sm:h-[440px] lg:h-[520px] flex items-center justify-center">

                <div className="absolute inset-0 bg-primary/5 rounded-[64px] rotate-6"></div>

                <img
                  src="/logo.jpeg"
                  alt="Meditation"
                  className="relative z-10 w-full h-full object-contain rounded-[40px]"
                />

                {/* Mood Boosted */}
                <div className="absolute top-4 right-0 bg-white px-3 py-2 rounded-xl shadow-lg z-30 text-center animate-floating">

                  <h4 className="font-semibold text-sm">
                    😊 Mood Boosted
                  </h4>

                  <p className="text-xs text-gray-500">
                    Keep it up!
                  </p>

                </div>

                {/* Daily Streak */}
                <div className="absolute bottom-2 left-2 sm:bottom-5 sm:left-4 bg-white/90 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl shadow-2xl z-20">

                  <p className="text-xs sm:text-sm mb-1.5 sm:mb-2 font-medium">
                    Daily Streak
                  </p>

                  <div className="flex gap-1">

                    <div className="w-3.5 sm:w-4 h-2 rounded-full bg-purple-300"></div>
                    <div className="w-3.5 sm:w-4 h-2 rounded-full bg-purple-300"></div>
                    <div className="w-3.5 sm:w-4 h-2 rounded-full bg-purple-300"></div>
                    <div className="w-3.5 sm:w-4 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-3.5 sm:w-4 h-2 rounded-full bg-gray-300"></div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================== FEATURES SECTION ===================== */}

        <section className="py-16 md:py-24 bg-purple-50 px-4 sm:px-6 md:px-10">

          <div className="max-w-7xl mx-auto">

            <div className="text-center max-w-2xl mx-auto mb-16">

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Empowering Tools for Inner Balance
              </h2>

              <p className="text-[clamp(0.875rem,1.2vw,1rem)] text-gray-600">
                Discover a suite of features designed to help you navigate
                life's challenges with grace and clarity.
              </p>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

              {/* Mood Tracking */}
              <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 transition">

                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex justify-center items-center mb-6">

                  <span className="material-symbols-outlined text-3xl">
                    mood
                  </span>

                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  Mood Tracking
                </h3>

                <p className="text-[clamp(0.875rem,1.2vw,1rem)] text-gray-600">
                  Log your emotions effortlessly and uncover hidden patterns
                  in your mental well-being over time.
                </p>

              </div>

              {/* Mindfulness */}
              <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 transition">

                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex justify-center items-center mb-6">

                  <span className="material-symbols-outlined text-3xl">
                    self_care
                  </span>

                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  Mindfulness
                </h3>

                <p className="text-[clamp(0.875rem,1.2vw,1rem)] text-gray-600">
                  Access a library of curated exercises designed to ground you
                  and reduce daily cognitive load.
                </p>

              </div>

              {/* AI Support */}
              <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 transition">

                <div className="w-14 h-14 rounded-2xl bg-sky-100 flex justify-center items-center mb-6">

                  <span className="material-symbols-outlined text-3xl">
                    psychology
                  </span>

                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  AI Support
                </h3>

                <p className="text-[clamp(0.875rem,1.2vw,1rem)] text-gray-600">
                  Chat with our empathetic AI companion for 24/7 support and
                  science-backed perspective shifts.
                </p>

              </div>

              {/* Progress Tracking */}
              <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 transition">

                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex justify-center items-center mb-6">

                  <span className="material-symbols-outlined text-3xl">
                    insights
                  </span>

                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  Progress Tracking
                </h3>

                <p className="text-[clamp(0.875rem,1.2vw,1rem)] text-gray-600">
                  Visualize your growth with deep analytics and personalized
                  insights for long-term health.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ===================== STORY SECTION ===================== */}

        <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10">

          <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-16 items-center">

            <div className="lg:col-span-3">

              <div className="relative rounded-3xl sm:rounded-[48px] overflow-hidden">

                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlDJVQoDEd85SvbuFgMsh0oAjZOnXzFkZMiFLzzOuqYjsMndaLeOOdMGa4eMGBlmn1w5bBXse0yqF0EUonMUC8hmO0klRxsb4RxL77SBkhCexxOD3MEHe-kBXsBt6-Nu-dSISzbuMJw_vNQIJubfO43ltOL9l4qNyHEeU0FjChjVzl5Fu_n-KeLeW6667da_jXH9ylfKiShEYeus5-x0OKWYPjLec1Mk55327UNxFY2I8P3VWI2Y9gpA"
                  className="w-full h-full object-cover"
                  alt=""
                />

                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg">

                  <p className="italic text-base sm:text-xl">
                    "Mannova changed how I perceive my stress.
                    It's not just an app; it's a companion on my journey."
                  </p>

                  <p className="mt-4 font-bold">
                    — Elena R., Design Director
                  </p>

                </div>

              </div>

            </div>

            <div className="lg:col-span-2">

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Experience Digital Serenity.
              </h2>

              <p className="text-gray-600 leading-8 mb-8">
                Our design philosophy focuses on Guided Tranquility. We believe
                mental wellness shouldn't feel like another task on your to-do
                list.
              </p>

              <div className="space-y-5">

                <div className="flex items-center gap-4">

                  <span className="material-symbols-outlined text-purple-700">
                    check_circle
                  </span>

                  <p>No clinical jargon, just empathy.</p>

                </div>

                <div className="flex items-center gap-4">

                  <span className="material-symbols-outlined text-purple-700">
                    check_circle
                  </span>

                  <p>Scientifically validated methodologies.</p>

                </div>

                <div className="flex items-center gap-4">

                  <span className="material-symbols-outlined text-purple-700">
                    check_circle
                  </span>

                  <p>Privacy-first data encryption.</p>

                </div>

              </div>

              <button className="mt-10 text-purple-700 font-bold flex items-center gap-2 hover:translate-x-2 transition">

                Explore our philosophy

                <span className="material-symbols-outlined">
                  arrow_forward
                </span>

              </button>

            </div>

          </div>

        </section>

        {/* ================= CTA SECTION ================= */}

        <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10">

          <div className="max-w-7xl mx-auto">

            <div className="relative bg-purple-900 rounded-3xl sm:rounded-[48px] p-6 sm:p-12 md:p-24 text-center overflow-hidden">

              <div className="absolute inset-0 bg-purple-500/10"></div>

              <div className="relative z-10 max-w-3xl mx-auto">

                <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold mb-6">
                  Your journey to calm starts now.
                </h2>

                <p className="text-purple-200 text-base sm:text-lg mb-8 sm:mb-10">
                  Join thousands who have rediscovered their balance with
                  Mannova.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5">

                  {/* KEEP THIS BUTTON STATIC */}
                  <button
                    type="button"
                    className="bg-white text-purple-700 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold hover:scale-105 transition"
                  >
                    Get Started for Free
                  </button>

                  <button
                    onClick={() => navigate("/about")}
                    className="border border-white text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full hover:bg-white hover:text-purple-700 transition"
                  >
                    View Pricing Plans
                  </button>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= FOOTER ================= */}

        <footer className="bg-slate-100 py-12 md:py-16 px-4 sm:px-6 md:px-10">

          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

            <div className="md:col-span-2">

              <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-5">
                Mannova
              </h2>

              <p className="text-gray-600 max-w-sm leading-7">
                Guided Tranquility for the modern mind.
                We help you heal, grow, and thrive in an ever-changing world.
              </p>

              <div className="flex gap-4 mt-8">

                <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">

                  <span className="material-symbols-outlined">
                    public
                  </span>

                </button>

                <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">

                  <span className="material-symbols-outlined">
                    alternate_email
                  </span>

                </button>

              </div>

            </div>

            <div>

              <h3 className="font-bold mb-6 uppercase">
                Product
              </h3>

              <ul className="space-y-4 text-gray-600">

                <li>
                  <a href="#">Features</a>
                </li>

                <li>
                  <a href="#">Methods</a>
                </li>

                <li>
                  <a href="#">AI Guide</a>
                </li>

                <li>
                  <a href="#">Support</a>
                </li>

              </ul>

            </div>

            <div>

              <h3 className="font-bold mb-6 uppercase">
                Company
              </h3>

              <ul className="space-y-4 text-gray-600">

                <li>
                  <a href="#">About Us</a>
                </li>

                <li>
                  <a href="#">Journal</a>
                </li>

                <li>
                  <a href="#">Privacy Policy</a>
                </li>

                <li>
                  <a href="#">Contact</a>
                </li>

              </ul>

            </div>

          </div>

          <div className="max-w-7xl mx-auto border-t mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">

            <p className="text-gray-500">
              © 2024 Mannova. All rights reserved.
            </p>

            <div className="flex gap-8 mt-4 md:mt-0">

              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Cookies</a>

            </div>

          </div>

        </footer>

      </main>
    </Layout>
  );
}

export default App;