import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <header className="text-center mb-8 sm:mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 mb-3 sm:mb-4">
            About Mannova
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
            A Digital Sanctuary for Your Mind
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Mannova combines evidence-backed mindfulness, personalized AI reflection, and comprehensive wellness tracking to support your mental clarity and inner peace.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-[#121b2d] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">spa</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Mindful Exercises</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Guided soundscapes, box breathing, and focused meditations designed for any part of your day.
            </p>
          </div>

          <div className="bg-white dark:bg-[#121b2d] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Empathetic AI</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reflective conversational partner available 24/7 to help you untangle complex feelings and stress.
            </p>
          </div>

          <div className="bg-white dark:bg-[#121b2d] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">monitoring</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Progress Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clear visual logs of your emotional journey, habits, and mindfulness streaks over time.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}