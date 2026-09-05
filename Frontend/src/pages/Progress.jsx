import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

import Layout from "../components/Layout";
import { getMoods } from "../api/moodApi";
import { getCompletedExercises } from "../api/exerciseApi";


// ============================================================
// MOOD CONFIGURATION
// ============================================================

const moodValues = {
  sad: 1,
  unhappy: 2,
  neutral: 3,
  happy: 4,
  great: 5,
};

const moodLabels = {
  sad: "Low",
  unhappy: "Down",
  neutral: "Neutral",
  happy: "Good",
  great: "Radiant",
};

const moodColors = {
  sad: "bg-blue-300",
  unhappy: "bg-cyan-300",
  neutral: "bg-gray-300",
  happy: "bg-violet-300",
  great: "bg-amber-300",
};


// ============================================================
// DATE HELPERS
// ============================================================

const getDateValue = (item) => {
  return new Date(item.createdAt || item.date);
};


const startOfDay = (date) => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
};


const endOfDay = (date) => {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
};


// ============================================================
// PROGRESS PAGE
// ============================================================

export default function Progress() {
  const [reflections, setReflections] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        setLoading(true);
        setError("");

        // -------------------------------
        // LOAD MOODS
        // -------------------------------

        const moodResponse = await getMoods();

        console.log("Progress moods:", moodResponse);

        setReflections(moodResponse.data || []);


        // -------------------------------
        // LOAD EXERCISES
        // -------------------------------

        const exerciseResponse =
          await getCompletedExercises();

        console.log(
          "Progress exercises:",
          exerciseResponse
        );

        setCompletedExercises(
          exerciseResponse.data || []
        );

      } catch (error) {
        console.error(
          "Progress loading error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your wellness progress."
        );

      } finally {
        setLoading(false);
      }
    };


    loadProgressData();
  }, []);


  // ==========================================================
  // CURRENT MONTH INFORMATION
  // ==========================================================

  const currentMonthInfo = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();
    const currentDay = now.getDate();

    // Last day of current month
    const lastDay = new Date(
      year,
      month + 1,
      0
    ).getDate();

    return {
      year,
      month,
      currentDay,
      lastDay,
    };
  }, []);


  // ==========================================================
  // MONTHLY ACTIVITY
  //
  // IMPORTANT:
  //
  // Week 1 = 1-7
  // Week 2 = 8-14
  // Week 3 = 15-21
  // Week 4 = 22-28
  // Week 5 = 29-end of month
  //
  // Week 5 only appears when:
  // 1. The month has at least 29 days
  // 2. We have actually reached day 29
  //
  // This works for:
  // February
  // Leap years
  // April / June / September / November
  // January / March / May / July etc.
  // ==========================================================

  const monthlyWeeks = useMemo(() => {
    const {
      year,
      month,
      currentDay,
      lastDay,
    } = currentMonthInfo;


    const weeks = [];


    // --------------------------------------------------------
    // Create first four 7-day weeks
    // --------------------------------------------------------

    const fixedWeeks = [
      {
        week: 1,
        startDay: 1,
        endDay: 7,
      },
      {
        week: 2,
        startDay: 8,
        endDay: 14,
      },
      {
        week: 3,
        startDay: 15,
        endDay: 21,
      },
      {
        week: 4,
        startDay: 22,
        endDay: 28,
      },
    ];


    fixedWeeks.forEach((week) => {

      // ------------------------------------------------------
      // Don't show a future week.
      //
      // Example:
      // Today = 10
      //
      // Week 1 -> shown
      // Week 2 -> shown
      // Week 3 -> hidden
      // Week 4 -> hidden
      // ------------------------------------------------------

      if (currentDay < week.startDay) {
        return;
      }


      const actualEndDay = Math.min(
        week.endDay,
        lastDay
      );


      // ------------------------------------------------------
      // Count reflections inside this week
      // ------------------------------------------------------

      const count = reflections.filter((item) => {

        const itemDate = getDateValue(item);

        return (
          itemDate.getFullYear() === year &&
          itemDate.getMonth() === month &&
          itemDate.getDate() >= week.startDay &&
          itemDate.getDate() <= actualEndDay
        );

      }).length;


      weeks.push({
        week: week.week,
        startDay: week.startDay,
        endDay: actualEndDay,
        count,
      });

    });


    // --------------------------------------------------------
    // WEEK 5
    //
    // Days 29 -> end of month
    //
    // Only exists for months with 29, 30 or 31 days.
    // --------------------------------------------------------

    if (
      lastDay >= 29 &&
      currentDay >= 29
    ) {

      const count = reflections.filter((item) => {

        const itemDate = getDateValue(item);

        return (
          itemDate.getFullYear() === year &&
          itemDate.getMonth() === month &&
          itemDate.getDate() >= 29 &&
          itemDate.getDate() <= lastDay
        );

      }).length;


      weeks.push({
        week: 5,
        startDay: 29,
        endDay: lastDay,
        count,
      });

    }


    return weeks;

  }, [
    reflections,
    currentMonthInfo,
  ]);


  // ==========================================================
  // MONTHLY REFLECTION COUNT
  // ==========================================================

  const monthlyReflectionCount = useMemo(() => {

    const {
      year,
      month,
    } = currentMonthInfo;


    return reflections.filter((item) => {

      const date = getDateValue(item);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month
      );

    }).length;

  }, [
    reflections,
    currentMonthInfo,
  ]);


  // ==========================================================
  // BASIC STATISTICS
  // ==========================================================

  const totalReflections =
    reflections.length;


  const totalExercises =
    completedExercises.length;


  // ==========================================================
  // AVERAGE WELLNESS SCORE
  // ==========================================================

  const averageScore = useMemo(() => {

    if (!reflections.length) {
      return 0;
    }


    const total = reflections.reduce(
      (sum, item) => {

        return (
          sum +
          (moodValues[item.mood] || 0)
        );

      },
      0
    );


    return Math.round(
      (total / reflections.length) * 20
    );

  }, [reflections]);


  // ==========================================================
  // AVERAGE INTENSITY
  // ==========================================================

  const averageIntensity = useMemo(() => {

    if (!reflections.length) {
      return 0;
    }


    const total = reflections.reduce(
      (sum, item) => {

        return (
          sum +
          Number(item.intensity || 0)
        );

      },
      0
    );


    return Number(
      (
        total /
        reflections.length
      ).toFixed(1)
    );

  }, [reflections]);


  // ==========================================================
  // CURRENT STREAK
  // ==========================================================

  const currentStreak = useMemo(() => {

    if (!reflections.length) {
      return 0;
    }


    const uniqueDates = [
      ...new Set(
        reflections.map((item) => {

          const date = getDateValue(item);

          return startOfDay(date)
            .toDateString();

        })
      ),
    ];


    const sortedDates =
      uniqueDates
        .map(
          (date) =>
            startOfDay(
              new Date(date)
            )
        )
        .sort(
          (a, b) => b - a
        );


    if (!sortedDates.length) {
      return 0;
    }


    const today =
      startOfDay(new Date());


    const firstDate =
      sortedDates[0];


    const daysFromToday =
      Math.floor(
        (
          today -
          firstDate
        ) /
        (1000 * 60 * 60 * 24)
      );


    if (daysFromToday > 1) {
      return 0;
    }


    let streak = 0;

    let currentDate =
      firstDate;


    for (
      let i = 0;
      i < sortedDates.length;
      i++
    ) {

      const date =
        sortedDates[i];


      const difference =
        Math.floor(
          (
            currentDate -
            date
          ) /
          (1000 * 60 * 60 * 24)
        );


      if (i === 0) {

        streak = 1;

        currentDate = date;

        continue;
      }


      if (difference === 1) {

        streak++;

        currentDate = date;

      } else if (difference === 0) {

        continue;

      } else {

        break;

      }

    }


    return streak;

  }, [reflections]);


  // ==========================================================
  // LAST 7 DAYS
  // ==========================================================

  const weeklyData = useMemo(() => {

    const result = [];


    for (
      let i = 6;
      i >= 0;
      i--
    ) {

      const date =
        startOfDay(new Date());


      date.setDate(
        date.getDate() - i
      );


      const dayName =
        date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        );


      const matching =
        reflections.filter(
          (item) => {

            const itemDate =
              startOfDay(
                getDateValue(item)
              );


            return (
              itemDate.toDateString() ===
              date.toDateString()
            );

          }
        );


      const average =
        matching.length > 0
          ? matching.reduce(
              (sum, item) =>
                sum +
                (
                  moodValues[
                    item.mood
                  ] || 0
                ),
              0
            ) /
            matching.length
          : 0;


      result.push({
        day: dayName,
        score: average,
      });

    }


    return result;

  }, [reflections]);


  // ==========================================================
  // LATEST REFLECTION
  // ==========================================================

  const latestReflection =
    useMemo(() => {

      if (!reflections.length) {
        return null;
      }


      return [
        ...reflections,
      ].sort(
        (a, b) =>
          getDateValue(b) -
          getDateValue(a)
      )[0];

    }, [reflections]);


  // ==========================================================
  // MOOD SUMMARY
  // ==========================================================

  const moodCounts =
    useMemo(() => {

      return reflections.reduce(
        (result, item) => {

          if (!result[item.mood]) {
            result[item.mood] = 0;
          }


          result[item.mood]++;


          return result;

        },
        {}
      );

    }, [reflections]);


  // ==========================================================
  // MOST COMMON MOOD
  // ==========================================================

  const mostCommonMood =
    useMemo(() => {

      if (!reflections.length) {
        return "neutral";
      }


      return Object.entries(
        moodCounts
      ).sort(
        (a, b) =>
          b[1] - a[1]
      )[0][0];

    }, [
      reflections,
      moodCounts,
    ]);


  // ==========================================================
  // GENERATE 7-DAY WELLNESS REPORT
  // ==========================================================

  const handleGenerateReport = () => {

    if (!reflections.length) {

      alert(
        "No mood reflections available yet."
      );

      return;
    }


    const last7Days =
      weeklyData.filter(
        (item) =>
          item.score > 0
      );


    if (!last7Days.length) {

      alert(
        "No mood activity found in the last 7 days."
      );

      return;
    }


    const firstScore =
      last7Days[0].score;


    const lastScore =
      last7Days[
        last7Days.length - 1
      ].score;


    let improvement = 0;


    if (firstScore > 0) {

      improvement =
        Math.round(
          (
            (
              lastScore -
              firstScore
            ) /
            firstScore
          ) *
          100
        );

    }


    const weeklyAverage =
      last7Days.reduce(
        (sum, item) =>
          sum + item.score,
        0
      ) /
      last7Days.length;


    const weeklyAveragePercentage =
      Math.round(
        weeklyAverage * 20
      );


    const sevenDaysAgo =
      startOfDay(new Date());


    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 6
    );


    const now =
      endOfDay(new Date());


    const last7DayReflections =
      reflections.filter(
        (item) => {

          const itemDate =
            getDateValue(item);


          return (
            itemDate >=
              sevenDaysAgo &&
            itemDate <= now
          );

        }
      );


    const weeklyMoodCounts =
      last7DayReflections.reduce(
        (result, item) => {

          if (!result[item.mood]) {
            result[item.mood] = 0;
          }


          result[item.mood]++;


          return result;

        },
        {}
      );


    const weeklyMostCommonMood =
      Object.keys(
        weeklyMoodCounts
      ).sort(
        (a, b) =>
          weeklyMoodCounts[b] -
          weeklyMoodCounts[a]
      )[0];


    const formatDate =
      (date) => {

        return date.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

      };


    // --------------------------------------------------------
    // CREATE PDF
    // --------------------------------------------------------

    const pdf =
      new jsPDF();


    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(24);

    pdf.text(
      "MANNOVA",
      20,
      25
    );


    pdf.setFontSize(17);

    pdf.text(
      "7-Day Wellness Report",
      20,
      36
    );


    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(10);

    pdf.text(
      `Period: ${formatDate(
        sevenDaysAgo
      )} - ${formatDate(now)}`,
      20,
      44
    );


    pdf.line(
      20,
      50,
      190,
      50
    );


    // --------------------------------------------------------
    // WELLNESS SUMMARY
    // --------------------------------------------------------

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(15);

    pdf.text(
      "Wellness Summary",
      20,
      63
    );


    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(11);


    let y = 74;


    pdf.text(
      `Mood Check-ins: ${
        last7DayReflections.length
      }`,
      25,
      y
    );

    y += 8;


    pdf.text(
      `Average Wellness Score: ${
        weeklyAveragePercentage
      }%`,
      25,
      y
    );

    y += 8;


    pdf.text(
      `Average Intensity: ${
        averageIntensity
      }/10`,
      25,
      y
    );

    y += 8;


    pdf.text(
      `Current Streak: ${
        currentStreak
      } days`,
      25,
      y
    );

    y += 8;


    pdf.text(
      `Most Common Mood: ${
        moodLabels[
          weeklyMostCommonMood
        ] || "Unknown"
      }`,
      25,
      y
    );


    // --------------------------------------------------------
    // IMPROVEMENT
    // --------------------------------------------------------

    y += 15;


    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(15);

    pdf.text(
      "7-Day Improvement",
      20,
      y
    );


    y += 10;


    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(11);


    pdf.text(
      `Starting Mood Score: ${
        Math.round(
          firstScore * 20
        )
      }%`,
      25,
      y
    );


    y += 8;


    pdf.text(
      `Latest Mood Score: ${
        Math.round(
          lastScore * 20
        )
      }%`,
      25,
      y
    );


    y += 8;


    pdf.text(
      `Recorded Change: ${
        improvement >= 0
          ? "+"
          : ""
      }${improvement}%`,
      25,
      y
    );


    y += 15;


    // --------------------------------------------------------
    // DAILY MOOD TREND
    // --------------------------------------------------------

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(15);

    pdf.text(
      "7-Day Mood Trend",
      20,
      y
    );


    y += 10;


    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(10);


    weeklyData.forEach(
      (item) => {

        const score =
          item.score > 0
            ? `${Math.round(
                item.score * 20
              )}%`
            : "No check-in";


        pdf.text(
          `${item.day}: ${score}`,
          25,
          y
        );


        y += 7;

      }
    );


    // --------------------------------------------------------
    // RECENT REFLECTIONS
    // --------------------------------------------------------

    y += 8;


    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(15);

    pdf.text(
      "Recent Reflections",
      20,
      y
    );


    y += 10;


    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(10);


    const recentReflections =
      last7DayReflections
        .filter(
          (item) =>
            item.note &&
            item.note.trim()
        )
        .slice(-3);


    if (
      recentReflections.length
    ) {

      recentReflections.forEach(
        (item) => {

          const date =
            getDateValue(item);


          const reflectionText =
            `${formatDate(
              date
            )}: ${item.note}`;


          const lines =
            pdf.splitTextToSize(
              reflectionText,
              165
            );


          pdf.text(
            lines,
            25,
            y
          );


          y +=
            lines.length * 5 +
            4;

        }
      );

    } else {

      pdf.text(
        "No written reflections recorded during the last 7 days.",
        25,
        y
      );

    }


    // --------------------------------------------------------
    // FOOTER
    // --------------------------------------------------------

    pdf.setFont(
      "helvetica",
      "italic"
    );

    pdf.setFontSize(9);

    pdf.text(
      "Generated by Mannova",
      20,
      285
    );


    pdf.save(
      "Mannova-7-Day-Wellness-Report.pdf"
    );


    alert(
      "Your 7-day wellness report has been generated successfully."
    );

  };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <Layout>

        <main className="min-h-screen flex items-center justify-center px-6">

          <div className="text-center">

            <div className="text-5xl mb-4">
              🌿
            </div>

            <p className="text-violet-700 text-lg font-medium">
              Loading your wellness progress...
            </p>

          </div>

        </main>

      </Layout>
    );

  }


  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <Layout>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-28 md:pb-24">


        {/* ==================================================
            TITLE
        ================================================== */}

        <section className="mb-8 sm:mb-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

            <div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2">
                Your Wellness Journey
              </h2>

              <p className="text-gray-500 text-xs sm:text-sm md:text-base max-w-2xl">
                Reflect on your progress and celebrate
                your commitment to mental tranquility.
                Your consistency is building a stronger
                foundation for peace.
              </p>

            </div>


            <button
              onClick={handleGenerateReport}
              className="w-full sm:w-auto bg-violet-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition cursor-pointer font-semibold text-sm"
            >
              Generate Report
            </button>

          </div>


          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl">
              {error}
            </div>
          )}

        </section>


        {/* ==================================================
            STATS
        ================================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">


          {/* STREAK */}
          <div className="glass-card rounded-2xl p-4 sm:p-6 flex items-center gap-4 sm:gap-5 hover:-translate-y-1 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/10">
              <span
                className="material-symbols-outlined text-4xl text-amber-500 dark:text-amber-400 drop-shadow-sm"
                style={{
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                local_fire_department
              </span>
            </div>

            <div>
              <p className="uppercase text-xs tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                Current Streak
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {currentStreak} Day{currentStreak !== 1 ? "s" : ""}
              </h3>
            </div>
          </div>

          {/* REFLECTIONS / ACTIVITY LOG */}
          <div className="glass-card rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-1 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/15 dark:bg-blue-500/20 border border-blue-500/30 dark:border-blue-500/40 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/10">
              <span className="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400 drop-shadow-sm">
                task_alt
              </span>
            </div>

            <div>
              <p className="uppercase text-xs tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                Activity Log
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalReflections} Reflection{totalReflections !== 1 ? "s" : ""}
              </h3>
            </div>
          </div>

          {/* EXERCISES */}
          <div className="glass-card rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-1 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/10">
              <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
                self_improvement
              </span>
            </div>

            <div>
              <p className="uppercase text-xs tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                Exercises
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalExercises} Completed
              </h3>
            </div>
          </div>

          {/* WELLNESS SCORE */}
          <div className="glass-card rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-1 transition-all">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  className="stroke-gray-200 dark:stroke-slate-700"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="6"
                  strokeDasharray="175"
                  strokeDashoffset={175 - (175 * averageScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-sm text-violet-700 dark:text-violet-300">
                {averageScore}%
              </span>
            </div>

            <div>
              <p className="uppercase text-xs tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                Avg Wellness Score
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {averageScore >= 70
                  ? "Great Growth"
                  : averageScore >= 40
                  ? "Steady Progress"
                  : "Getting Started"}
              </h3>
            </div>
          </div>

        </section>


        {/* ==================================================
            CHARTS
        ================================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">


          {/* =================================================
              WEEKLY MOOD
          ================================================= */}

          <div className="lg:col-span-8 glass-card rounded-xl p-6 flex flex-col min-h-[400px]">

            <div className="flex justify-between items-start mb-6">

              <div>

                <h3 className="text-2xl font-semibold">
                  Weekly Mood Fluctuations
                </h3>

                <p className="text-gray-500">
                  Mood activity across the last 7 days
                </p>

              </div>


              <span className="px-3 py-1 rounded-full bg-purple-100 text-violet-700">
                {averageScore >= 70
                  ? "High : Tranquil"
                  : "Building : Wellness"}
              </span>

            </div>


            <div className="flex-1 relative min-h-[240px]">

              <svg
                viewBox="0 0 800 220"
                className="absolute inset-0 w-full h-full"
              >

                <defs>

                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    x2="100%"
                    y1="0%"
                    y2="0%"
                  >

                    <stop
                      offset="0%"
                      stopColor="#a78bfa"
                    />

                    <stop
                      offset="100%"
                      stopColor="#674bb5"
                    />

                  </linearGradient>

                </defs>


                {weeklyData.length > 1 && (

                  <polyline
                    points={weeklyData
                      .map(
                        (item, index) => {

                          const x =
                            (index / 6) *
                            800;


                          const y =
                            item.score > 0
                              ? 200 -
                                (
                                  item.score /
                                  5
                                ) *
                                160
                              : 200;


                          return `${x},${y}`;

                        }
                      )
                      .join(" ")}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                )}


                {weeklyData.map(
                  (item, index) => {

                    const x =
                      (index / 6) *
                      800;


                    const y =
                      item.score > 0
                        ? 200 -
                          (
                            item.score /
                            5
                          ) *
                            160
                        : 200;


                    return (

                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#674bb5"
                      />

                    );

                  }
                )}

              </svg>


              {totalReflections === 0 && (

                <div className="absolute inset-0 flex items-center justify-center">

                  <div className="text-center">

                    <div className="text-4xl mb-3">
                      🌱
                    </div>

                    <p className="text-gray-500">
                      Start recording your moods
                      to see your weekly progress.
                    </p>

                  </div>

                </div>

              )}

            </div>


            <div className="flex justify-between mt-4 text-gray-500 text-sm">

              {weeklyData.map(
                (item) => (

                  <span key={item.day}>
                    {item.day}
                  </span>

                )
              )}

            </div>

          </div>


          {/* =================================================
              MONTHLY ACTIVITY
          ================================================= */}

          <div className="lg:col-span-4 glass-card rounded-xl p-6">

            <h3 className="text-2xl font-semibold mb-2">
              Monthly Activity
            </h3>


            <p className="text-gray-500 mb-8">
              Your wellness activity this month
            </p>


            {monthlyWeeks.length === 0 ? (

              <div className="text-center py-6 text-gray-500">
                No activity yet.
              </div>

            ) : (

              monthlyWeeks.map(
                (week) => {

                  /*
                   * IMPORTANT:
                   *
                   * Maximum expected reflections
                   * is not fixed.
                   *
                   * The bar represents activity
                   * based on 7 days.
                   *
                   * 4 reflections = 100%.
                   *
                   * This prevents the progress bar
                   * from becoming too large just
                   * because multiple reflections
                   * were recorded on the same day.
                   */

                  const activity =
                    Math.min(
                      week.count * 25,
                      100
                    );


                  return (

                    <div
                      key={week.week}
                      className="mb-6"
                    >

                      <div className="flex justify-between mb-2">

                        <span className="font-medium">

                          Week {week.week}

                          <span className="ml-2 text-xs text-gray-400">

                            (
                            {week.startDay}
                            -
                            {week.endDay}
                            )

                          </span>

                        </span>


                        <span className="text-sm">

                          {week.count}{" "}

                          {week.count === 1
                            ? "reflection"
                            : "reflections"}

                        </span>

                      </div>


                      <div className="w-full h-3 rounded-full bg-gray-200">

                        <div
                          className="h-3 rounded-full bg-violet-600 transition-all duration-700"
                          style={{
                            width:
                              `${activity}%`,
                          }}
                        />

                      </div>

                    </div>

                  );

                }
              )

            )}


            <div className="mt-8 border-t pt-5">

              <p className="text-gray-500">

                You've recorded{" "}

                <span className="text-violet-700 font-bold">

                  {monthlyReflectionCount}

                </span>{" "}

                reflection
                {monthlyReflectionCount !==
                1
                  ? "s"
                  : ""}{" "}
                this month.

              </p>

            </div>

          </div>


          {/* =================================================
              MOOD BREAKDOWN
          ================================================= */}

          <div className="lg:col-span-4 glass-card rounded-xl p-6">

            <h3 className="text-2xl font-semibold mb-2">
              Mood Breakdown
            </h3>


            <p className="text-gray-500 mb-8">
              Your recorded emotions
            </p>


            {Object.keys(
              moodLabels
            ).map((mood) => {

              const count =
                moodCounts[mood] ||
                0;


              const percentage =
                totalReflections > 0
                  ? Math.round(
                      (
                        count /
                        totalReflections
                      ) *
                        100
                    )
                  : 0;


              return (

                <div
                  key={mood}
                  className="mb-6"
                >

                  <div className="flex justify-between mb-2">

                    <span>
                      {moodLabels[mood]}
                    </span>

                    <span>
                      {percentage}%
                    </span>

                  </div>


                  <div className="w-full h-3 rounded-full bg-gray-200">

                    <div
                      className={`h-3 rounded-full ${moodColors[mood]} transition-all duration-700`}
                      style={{
                        width:
                          `${percentage}%`,
                      }}
                    />

                  </div>

                </div>

              );

            })}

          </div>


          {/* =================================================
              EXERCISE ACTIVITY
          ================================================= */}

          <div className="lg:col-span-8 glass-card rounded-xl p-6">

            <div className="flex justify-between items-start mb-6">

              <div>

                <h3 className="text-2xl font-semibold">
                  Exercise Activity
                </h3>

                <p className="text-gray-500">
                  Your completed wellness exercises
                </p>

              </div>


              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
                {totalExercises} Completed
              </span>

            </div>


            {completedExercises.length === 0 ? (

              <div className="text-center py-10">

                <div className="text-4xl mb-3">
                  🌱
                </div>

                <p className="text-gray-500">
                  Complete an exercise to see
                  your activity here.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {completedExercises
                  .slice(0, 5)
                  .map(
                    (exercise) => (

                      <div
                        key={exercise._id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#162238] border border-gray-100 dark:border-slate-800 transition"
                      >

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center justify-center flex-shrink-0">

                            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">
                              check_circle
                            </span>

                          </div>


                          <div>

                            <h4 className="font-semibold">
                              {exercise.title}
                            </h4>

                            <p className="text-sm text-gray-500">
                              {exercise.category ||
                                "Wellness Exercise"}
                            </p>

                          </div>

                        </div>


                        <div className="text-right">

                          <p className="font-medium text-violet-700">
                            {exercise.duration ||
                              0}{" "}
                            min
                          </p>


                          <p className="text-xs text-gray-400">

                            {exercise.completedAt
                              ? new Date(
                                  exercise.completedAt
                                ).toLocaleDateString()
                              : ""}

                          </p>

                        </div>

                      </div>

                    )
                  )}

              </div>

            )}

          </div>

        </section>


        {/* ==================================================
            LATEST REFLECTION
        ================================================== */}

        <section className="glass-card rounded-2xl p-5 sm:p-8 relative overflow-hidden mb-12 sm:mb-20">

          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">

            <div className="flex-shrink-0">

              <div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-cover bg-center shadow-xl"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIGbLseHJkfpSPAP1kILoAtNHnZ_vpRWiTFu3J0wTlQU9anoICpGxtdTiY08Ewn5clrA7MA_LdTd1XdfbW0vWwB-jH1dd7KseqWBOI6ba40sAW0rcBi13cAO2VrfEhh4JxQ_56trw6z8nYOwxOSUKkMZJEzNKESH_G5EQ4QdZ7qN819TXkNgr7RzHA90EqC2An9yYi2dT0N_Gkva7qVuGswS7R4Bs4xZvv3sraPnRxM2nlYYeXvuuZ5g')",
                }}
              />

            </div>


            <div>

              <h3 className="text-2xl sm:text-3xl font-semibold mb-3">

                {latestReflection
                  ? "Your Latest Reflection"
                  : "Deep Insights Waiting"}

              </h3>


              <p className="text-gray-500 mb-6 max-w-2xl text-xs sm:text-sm md:text-base">

                {latestReflection
                  ? latestReflection.note ||
                    `You recorded your mood as ${
                      moodLabels[
                        latestReflection.mood
                      ]
                    }. Keep checking in with yourself.`

                  : "Start recording your moods to unlock personalized wellness insights."}

              </p>


              {latestReflection && (

                <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-5 text-xs sm:text-sm">

                  <span className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-violet-100 text-violet-700">

                    Mood:{" "}

                    {
                      moodLabels[
                        latestReflection.mood
                      ]
                    }

                  </span>


                  <span className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-100 text-blue-700">

                    Intensity:{" "}

                    {latestReflection.intensity}/10

                  </span>

                </div>

              )}


              <div className="flex flex-wrap gap-3 sm:gap-4">

                <button
                  onClick={() => {

                    alert(
                      latestReflection
                        ? "Your latest reflection is already included in your progress."
                        : "Record a mood first to unlock insights."
                    );

                  }}
                  className="bg-violet-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:shadow-lg transition cursor-pointer text-xs sm:text-sm font-semibold"
                >
                  View Insights
                </button>


                <button
                  onClick={() => {

                    alert(
                      "Exercise scheduling will be connected later."
                    );

                  }}
                  className="border border-gray-300 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer text-xs sm:text-sm font-semibold"
                >
                  Schedule Exercise
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            ACHIEVEMENTS
        ================================================== */}

        <section className="mb-12">

          <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
            Milestones & Achievements
          </h3>


          <div className="flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-8">

            {/* CALM SEEKER */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink-100 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/40 flex items-center justify-center shadow-lg shadow-pink-500/10">
                <span
                  className="material-symbols-outlined text-4xl text-pink-600 dark:text-pink-400"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  self_care
                </span>
              </div>
              <h4 className="mt-3 font-semibold text-slate-800 dark:text-white">
                Calm Seeker
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                7 Days of Zen
              </p>
            </div>

            {/* CONSISTENT BREATH */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-cyan-100 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <span
                  className="material-symbols-outlined text-4xl text-cyan-600 dark:text-cyan-400"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  air
                </span>
              </div>
              <h4 className="mt-3 font-semibold text-slate-800 dark:text-white">
                Consistent Breath
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Morning Flow Master
              </p>
            </div>

            {/* DAWN RISING (STREAK MILESTONE) */}
            <div
              className={`flex flex-col items-center ${
                currentStreak >= 7 ? "" : "opacity-60"
              }`}
            >
              <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-600/50 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="material-symbols-outlined text-4xl text-amber-500 dark:text-amber-400 drop-shadow-sm">
                  light_mode
                </span>
              </div>
              <h4 className="mt-3 font-semibold text-slate-800 dark:text-white">
                Dawn Rising
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {currentStreak >= 7
                  ? "Achievement Unlocked"
                  : "Next : 7 Day Streak"}
              </p>
            </div>

            {/* EXERCISE ACHIEVEMENT */}
            <div
              className={`flex flex-col items-center ${
                totalExercises >= 5 ? "" : "opacity-60"
              }`}
            >
              <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-emerald-400">
                  fitness_center
                </span>
              </div>
              <h4 className="mt-3 font-semibold text-slate-800 dark:text-white">
                Mindful Mover
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {totalExercises >= 5
                  ? "Achievement Unlocked"
                  : `Next : ${totalExercises} / 5 Exercises`}
              </p>
            </div>

          </div>

        </section>

      </main>

    </Layout>
  );
}