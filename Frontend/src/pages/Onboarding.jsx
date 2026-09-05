import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Onboarding() {

  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState(() => {
    return (
      localStorage.getItem("mannovaOnboardingMood") ||
      localStorage.getItem("mannovaCurrentMood") ||
      ""
    );
  });

  const moods = [
    {
      id: "sad",
      emoji: "😢",
      label: "Low",
    },
    {
      id: "unhappy",
      emoji: "🙁",
      label: "Down",
    },
    {
      id: "neutral",
      emoji: "😐",
      label: "Neutral",
    },
    {
      id: "happy",
      emoji: "🙂",
      label: "Good",
    },
    {
      id: "great",
      emoji: "✨",
      label: "Radiant",
    },
  ];

  const handleNext = () => {
    if (!selectedMood) return;

    localStorage.setItem(
      "mannovaOnboardingMood",
      selectedMood
    );

    localStorage.setItem(
      "mannovaCurrentMood",
      selectedMood
    );

    navigate("/mood");
  };

  const handleBack = () => {
  navigate(-1);
};

  return (
    <Layout>
      {/* Main */}
      <main
        className="
          min-h-[calc(100vh-80px)]
          flex
          items-center
          justify-center
          px-4
          sm:px-6
          py-8
          sm:py-12
          relative
          overflow-hidden
          bg-[linear-gradient(135deg,#f8f9ff_0%,#e8ddff_35%,#bee9ff_100%)]
        "
      >
        {/* Background decoration */}
        <div className="absolute top-20 left-0 w-64 h-64 bg-purple-300/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="absolute bottom-20 right-0 w-80 h-80 bg-pink-300/20 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Main Card */}
        <section
          className="
            relative
            z-10
            w-full
            max-w-[680px]
            bg-white/80
            backdrop-blur-xl
            rounded-3xl
            md:rounded-[32px]
            px-4
            sm:px-8
            md:px-10
            py-6
            sm:py-8
            border
            border-gray-200
            shadow-md
          "
        >
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center md:text-left mb-2 sm:mb-4">
            How are you feeling today?
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-gray-500 text-center md:text-left mb-6 sm:mb-10">
            Select the mood that best resonates with your current state of
            mind.
          </p>

          {/* Mood Selector */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 md:gap-6 mb-8 sm:mb-10">
            {moods.map((mood) => (
              <div
                key={mood.id}
                className="flex flex-col items-center min-w-0"
              >
                <input
                  type="radio"
                  id={mood.id}
                  name="mood"
                  className="hidden"
                  checked={selectedMood === mood.id}
                  onChange={() => setSelectedMood(mood.id)}
                />

                <label
                  htmlFor={mood.id}
                  className={`
                    flex
                    flex-col
                    items-center
                    justify-center
                    p-1.5
                    sm:p-3
                    md:p-6
                    rounded-xl
                    sm:rounded-2xl
                    md:rounded-[24px]
                    cursor-pointer
                    w-full
                    aspect-square
                    border
                    transition-all
                    duration-300

                    ${
                      selectedMood === mood.id
                        ? "bg-gradient-to-br from-[#7a1cff] to-[#b866ff] text-white scale-105 shadow-xl border-transparent"
                        : "bg-white hover:bg-purple-50 border-gray-200"
                    }
                  `}
                >
                  <span className="text-2xl sm:text-3xl md:text-5xl mb-1 sm:mb-2">
                    {mood.emoji}
                  </span>

                  <span className="hidden md:block uppercase text-xs font-semibold text-center">
                    {mood.label}
                  </span>
                </label>

                {/* Mobile mood name */}
                <span className="md:hidden mt-1.5 text-[10px] font-semibold text-gray-600 truncate max-w-full text-center">
                  {mood.label}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            {/* Back */}
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-700 transition"
            >
              <span className="material-symbols-outlined">
                arrow_back
              </span>

              Back
            </button>

            {/* Next */}
            <button
              type="button"
              disabled={!selectedMood}
              onClick={handleNext}
              className={`
                px-6 md:px-10
                py-3 md:py-4
                rounded-full
                font-semibold
                text-white
                transition-all

                ${
                  selectedMood
                    ? "bg-gradient-to-r from-purple-700 to-purple-400 hover:scale-105 shadow-lg"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span>Next</span>

                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </div>
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
}