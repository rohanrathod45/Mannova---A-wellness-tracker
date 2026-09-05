import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { createMood, getMoods } from "../api/moodApi";

const Mood = () => {
  const [selectedMood, setSelectedMood] = useState(() => {
    return (
      localStorage.getItem("mannovaOnboardingMood") ||
      localStorage.getItem("mannovaCurrentMood") ||
      ""
    );
  });

  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Store mood for each calendar date
  const [moodCalendar, setMoodCalendar] = useState({});
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);

  const today = new Date();

  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const moodColors = {
    sad: "bg-blue-300 text-blue-950 dark:bg-blue-600/90 dark:text-blue-50",
    unhappy: "bg-cyan-300 text-cyan-950 dark:bg-cyan-600/90 dark:text-cyan-50",
    neutral: "bg-gray-300 text-gray-850 dark:bg-slate-600 dark:text-slate-100",
    happy: "bg-violet-300 text-violet-950 dark:bg-violet-600/90 dark:text-violet-50",
    great: "bg-pink-300 text-pink-950 dark:bg-pink-600/90 dark:text-pink-50",
  };

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

  const emotionTags = [
    "Happy",
    "Calm",
    "Stressed",
    "Anxious",
    "Grateful",
    "Productive",
    "Tired",
    "Inspired",
    "Social",
  ];

  const sanctuaryQuotes = [
    "Peace comes from within. Do not seek it without.",
    "You don't have to control your thoughts. You just have to stop letting them control you.",
    "Almost everything will work again if you unplug it for a few minutes, including you.",
    "Be gentle with yourself. You're doing the best you can.",
    "Your feelings are valid, and you deserve to give them space.",
    "Small steps every day lead to meaningful change.",
    "Take a deep breath. You are exactly where you need to be.",
    "Rest is not giving up. Rest is preparing to continue.",
    "You are allowed to have difficult days.",
    "Calmness is a superpower in a noisy world.",
  ];

  const [sanctuaryQuote] = useState(() => {
    const randomIndex = Math.floor(
      Math.random() * sanctuaryQuotes.length
    );

    return sanctuaryQuotes[randomIndex];
  });

  // ==========================================
  // LOAD MOODS FROM BACKEND
  // ==========================================

  useEffect(() => {
    const loadMoods = async () => {
      try {
        const response = await getMoods();

        console.log("Moods loaded:", response);

        const moodsFromBackend = response.data || [];

        const calendar = {};

        moodsFromBackend.forEach((item) => {
          const date = new Date(item.createdAt);

          const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

          calendar[dateKey] = {
            mood: item.mood,
            intensity: item.intensity,
            tags: item.tags || [],
            note: item.note || "",
            createdAt: item.createdAt,
          };
        });

        setMoodCalendar(calendar);
      } catch (error) {
        console.error("Load moods error:", error);

        // Don't crash the page if backend is unavailable
      }
    };

    loadMoods();
  }, []);

  // ==========================================
  // TOGGLE EMOTION TAG
  // ==========================================

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag]
    );
  };

  // ==========================================
  // SAVE MOOD TO BACKEND
  // ==========================================

  const handleSaveReflection = async () => {
    if (!selectedMood) {
      alert("Please select a mood first.");
      return;
    }

    try {
      setLoading(true);
      setSaved(false);

      const moodData = {
        mood: selectedMood,
        intensity: Number(intensity),
        tags: selectedTags,
        note: note.trim(),
      };

      console.log("Sending mood:", moodData);

      const response = await createMood(moodData);

      console.log("Mood saved:", response);

      // Keep your existing localStorage functionality
      localStorage.setItem(
        "mannovaCurrentMood",
        selectedMood
      );

      // Update calendar immediately
      setMoodCalendar((prev) => ({
        ...prev,
        [todayKey]: {
          mood: selectedMood,
          intensity: Number(intensity),
          tags: selectedTags,
          note: note.trim(),
          createdAt: new Date().toISOString(),
        },
      }));

      setSaved(true);

    } catch (error) {
      console.error("Mood save error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to save mood. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CALENDAR NAVIGATION & CALCULATIONS
  // ==========================================

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Check if viewing current running month
  const isCurrentMonth =
    viewYear === currentYear && viewMonth === currentMonth;

  // Allow browsing any past month
  const prevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  // Block browsing into the future beyond current running month
  const nextMonth = () => {
    if (isCurrentMonth) return;
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const monthName = viewDate.toLocaleString("default", {
    month: "long",
  });

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Calculate check-in count for the viewed month
  const monthCheckIns = Object.keys(moodCalendar).filter((key) =>
    key.startsWith(`${viewYear}-${viewMonth}-`)
  ).length;

  return (
    <Layout>

      <div className="min-h-screen bg-[#f8f9ff] text-slate-800 pb-24">

        {/* Main */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

          <header className="mb-6 sm:mb-10">

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
              How are you feeling today?
            </h2>

            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Guided tranquility begins with understanding your current state.
            </p>

          </header>

          <div className="grid lg:grid-cols-12 gap-6">

            {/* ==========================================
                LEFT SIDE
            ========================================== */}

            <div className="lg:col-span-8 space-y-6">

              {/* MOOD SELECTION */}

              <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">

                <h3 className="text-lg sm:text-xl font-semibold text-violet-700 mb-4 sm:mb-6">
                  Mood Selection
                </h3>

                <div className="flex flex-wrap justify-around gap-3 sm:gap-5">

                  {moods.map((mood) => (

                    <button
                      key={mood.id}
                      onClick={() => {
                        setSelectedMood(mood.id);

                        // Keep current selected mood
                        localStorage.setItem(
                          "mannovaCurrentMood",
                          mood.id
                        );

                        // Update today's calendar
                        setMoodCalendar((prev) => ({
                          ...prev,
                          [todayKey]: mood.id,
                        }));

                        // Hide previous success message
                        setSaved(false);
                      }}
                      className="flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer"
                    >

                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl md:text-4xl transition duration-300
                        ${
                          selectedMood === mood.id
                            ? "bg-violet-200 scale-110 shadow-lg"
                            : "bg-gray-100 hover:bg-violet-100"
                        }`}
                      >
                        {mood.emoji}
                      </div>

                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          selectedMood === mood.id
                            ? "text-violet-700 font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {mood.label}
                      </span>

                    </button>

                  ))}

                </div>

              </section>

              {/* INTENSITY */}

              <section className="bg-white rounded-2xl shadow-lg p-6">

                <div className="flex justify-between mb-5">

                  <h3 className="text-xl font-semibold text-violet-700">
                    Intensity Level
                  </h3>

                  <span className="text-2xl font-bold text-violet-700">
                    {intensity}
                  </span>

                </div>

                <input
                  type="range"
                  min={1}
                  max={10}
                  value={intensity}
                  onChange={(e) =>
                    setIntensity(Number(e.target.value))
                  }
                  className="w-full accent-violet-700"
                />

                <div className="flex justify-between mt-2 text-sm text-gray-500">

                  <span>Subtle</span>

                  <span>Overwhelming</span>

                </div>

              </section>

              {/* EMOTION TAGS */}

              <section className="bg-white rounded-2xl shadow-lg p-6">

                <h3 className="text-xl font-semibold text-violet-700 mb-5">
                  What's contributing to this?
                </h3>

                <div className="flex flex-wrap gap-3">

                  {emotionTags.map((tag) => (

                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-5 py-2 rounded-full border transition-all duration-300 ${
                        selectedTags.includes(tag)
                          ? "bg-violet-600 text-white border-violet-600 scale-105"
                          : "border-violet-400 hover:bg-violet-600 hover:text-white"
                      }`}
                    >
                      {tag}
                    </button>

                  ))}

                </div>

              </section>

              {/* NOTES */}

              <section className="bg-white rounded-2xl shadow-lg p-6">

                <h3 className="text-xl font-semibold text-violet-700 mb-4">
                  What's on your mind?
                </h3>

                <textarea
                  rows={6}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Reflect on your day..."
                  className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-violet-600"
                />

              </section>

              {/* SAVE BUTTON */}

              <div className="flex flex-col items-stretch sm:items-end mt-6">

                <button
                  onClick={handleSaveReflection}
                  disabled={loading}
                  className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-full shadow-lg hover:scale-105 transition cursor-pointer font-semibold ${
                    loading
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading ? "Saving..." : "Save Reflection"}
                </button>

                {saved && (
                  <div className="mt-4 bg-green-100 text-green-700 border border-green-200 px-5 py-3 rounded-xl text-sm font-medium text-center w-full sm:w-auto">
                    ✓ Reflection saved successfully!
                  </div>
                )}

              </div>

            </div>

            {/* ==========================================
                RIGHT SIDEBAR
            ========================================== */}

            <aside className="lg:col-span-4 space-y-6">

              {/* CALENDAR */}

              <section className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl shadow-lg p-6 transition-all duration-300">

                {/* Calendar Title */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-violet-700 dark:text-violet-400">
                      Wellness Journey
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Monthly emotional calendar
                    </p>
                  </div>
                </div>

                {/* Month Navigation Bar */}
                <div className="flex items-center justify-between bg-violet-50/70 dark:bg-slate-800/80 rounded-xl px-3 py-2 mb-4 border border-violet-100/70 dark:border-slate-700/60">
                  {/* Previous Month Button (Allows checking past months) */}
                  <button
                    onClick={prevMonth}
                    type="button"
                    aria-label="Previous month"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 hover:text-violet-700 dark:hover:text-violet-300 transition-all shadow-none hover:shadow-xs cursor-pointer"
                    title="Check Previous Month"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>

                  <div className="text-center flex items-center justify-center gap-2">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 tracking-wide">
                      {monthName} {viewYear}
                    </span>
                    {isCurrentMonth && (
                      <span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-100/80 dark:bg-violet-950/60 px-2 py-0.5 rounded-full border border-violet-200/50 dark:border-violet-800/40">
                        Current Month
                      </span>
                    )}
                  </div>

                  {/* Next Month Button (Disabled on current month so future months cannot be accessed) */}
                  <button
                    onClick={nextMonth}
                    disabled={isCurrentMonth}
                    type="button"
                    aria-label="Next month"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isCurrentMonth
                        ? "text-gray-300 dark:text-slate-600 cursor-not-allowed opacity-40"
                        : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 hover:text-violet-700 dark:hover:text-violet-300 shadow-none hover:shadow-xs cursor-pointer"
                    }`}
                    title={isCurrentMonth ? "Cannot browse future months" : "Next Month"}
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>

                {/* Day-of-week Headers */}
                <div className="grid grid-cols-7 gap-2 text-center text-gray-400 dark:text-gray-500 text-xs font-semibold mb-3">

                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>

                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">

                  {calendarDays.map((day, index) => {

                    if (!day) {

                      return (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square"
                        />
                      );

                    }

                    const dateKey = `${viewYear}-${viewMonth}-${day}`;

                    const moodData = moodCalendar[dateKey];
                    const moodForDay = typeof moodData === "object" ? moodData?.mood : moodData;

                    const isToday =
                      viewYear === currentYear &&
                      viewMonth === currentMonth &&
                      day === today.getDate();

                    return (

                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (moodData) {
                            setSelectedDayDetails({
                              day,
                              month: monthName,
                              year: viewYear,
                              ...(typeof moodData === "object" ? moodData : { mood: moodData }),
                            });
                          }
                        }}
                        className={`
                          aspect-square
                          rounded-lg
                          flex flex-col
                          items-center
                          justify-center
                          text-xs sm:text-sm
                          font-medium
                          transition-all
                          duration-200
                          relative
                          ${
                            moodForDay
                              ? `${moodColors[moodForDay] || "bg-violet-300 text-violet-900"} cursor-pointer hover:scale-105 shadow-xs`
                              : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                          }
                          ${
                            isToday
                              ? "ring-2 ring-violet-600 ring-offset-1 dark:ring-offset-slate-900 font-bold"
                              : ""
                          }
                        `}
                        title={
                          moodForDay
                            ? `${monthName} ${day}: ${moodForDay} (Click for details)`
                            : `${monthName} ${day}`
                        }
                      >
                        <span>{day}</span>
                        {moodForDay && (
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mt-0.5" />
                        )}
                      </button>

                    );

                  })}

                </div>

                {/* Month Check-in Summary */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Logged in {monthName}:</span>
                  <span className="font-semibold text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 px-2 py-0.5 rounded-full">
                    {monthCheckIns} {monthCheckIns === 1 ? "check-in" : "check-ins"}
                  </span>
                </div>

                {/* MOOD LEGEND */}

                <div className="mt-6">

                  <h4 className="font-semibold mb-3">
                    Mood Legend
                  </h4>

                  <div className="space-y-2">

                    <div className="flex items-center gap-2">

                      <div className="w-4 h-4 rounded-full bg-pink-300"></div>

                      <span>Radiant</span>

                    </div>

                    <div className="flex items-center gap-2">

                      <div className="w-4 h-4 rounded-full bg-violet-300"></div>

                      <span>Good</span>

                    </div>

                    <div className="flex items-center gap-2">

                      <div className="w-4 h-4 rounded-full bg-cyan-300"></div>

                      <span>Down</span>

                    </div>

                  </div>

                </div>

              </section>

              {/* DAILY SANCTUARY */}

              <section className="rounded-2xl p-6 bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-xl animate-float">

                <div className="text-5xl mb-4">
                  💡
                </div>

                <h2 className="text-2xl font-bold mb-3">
                  Daily Sanctuary
                </h2>

                <p className="italic leading-7 min-h-[84px] flex items-center">
                  "{sanctuaryQuote}"
                </p>

              </section>

            </aside>

          </div>

        </main>

        {/* ==========================================
            SELECTED DAY REFLECTION MODAL / DRAWER
        ========================================== */}
        {selectedDayDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-violet-100 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedDayDetails(null)}
                type="button"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close reflection details"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              {/* Date & Mood Title */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/50 flex items-center justify-center text-3xl shadow-inner">
                  {moods.find((m) => m.id === selectedDayDetails.mood)?.emoji || "✨"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 capitalize text-xl leading-tight">
                    {selectedDayDetails.mood} Mood
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {selectedDayDetails.month} {selectedDayDetails.day}, {selectedDayDetails.year}
                  </p>
                </div>
              </div>

              {/* Intensity */}
              {selectedDayDetails.intensity !== undefined && (
                <div className="mb-4 bg-violet-50/70 dark:bg-slate-800/80 rounded-2xl p-3 border border-violet-100/60 dark:border-slate-700/60">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-gray-600 dark:text-gray-300">Emotional Intensity</span>
                    <span className="text-violet-700 dark:text-violet-300 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs shadow-2xs">
                      {selectedDayDetails.intensity} / 10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, (selectedDayDetails.intensity / 10) * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedDayDetails.tags && selectedDayDetails.tags.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1.5 font-semibold uppercase tracking-wider">
                    Associated Feelings
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDayDetails.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {selectedDayDetails.note ? (
                <div className="mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-semibold uppercase tracking-wider">
                    Reflection Note
                  </span>
                  <p className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 leading-relaxed italic">
                    "{selectedDayDetails.note}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-2">
                  No note was written for this day.
                </p>
              )}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setSelectedDayDetails(null)}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </Layout>
  );
};

export default Mood;