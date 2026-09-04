import React, { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import {
  Bed,
  Heart,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Clock,
  Filter,
  Focus,
  Trees,
  CheckCircle,
  X,
  Volume2,
  VolumeX,
  Wind,
  Sparkles,
} from "lucide-react";
import {
  completeExercise,
  getCompletedExercises,
} from "../api/exerciseApi";

export default function Exercises() {
  // =========================================================
  // AUDIO & PLAYER STATES
  // =========================================================
  const [audio, setAudio] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isMuted, setIsMuted] = useState(false);

  // Filter state
  const [activeCategory, setActiveCategory] = useState("All");

  // Completion states
  const [completedExercises, setCompletedExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // =========================================================
  // EXERCISE SESSIONS
  // =========================================================
  const sessions = useMemo(
    () => [
      {
        id: "night-sky-drift",
        title: "Night Sky Drift & Sleep",
        subtitle: "Gentle acoustic tones for deep slumber",
        duration: "25m",
        durationMinutes: 25,
        category: "Sleep",
        intensity: "Low",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
        audio: "/Sleep.mp3",
      },
      {
        id: "forest-rain",
        title: "Forest Rain Sanctuary",
        subtitle: "Immersive nature raindrops in deep woods",
        duration: "17m",
        durationMinutes: 17,
        category: "Stress Relief",
        intensity: "Low",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
        audio: "/Forest.mp3.mp3",
      },
      {
        id: "stress-dissolve",
        title: "Stress Dissolve & Calm",
        subtitle: "Release tension and soothe physical anxiety",
        duration: "15m",
        durationMinutes: 15,
        category: "Stress Relief",
        intensity: "Medium",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
        audio: "/Stress.mp3",
      },
      {
        id: "deep-mind-focus",
        title: "Deep Mind Clarity & Focus",
        subtitle: "Binaural frequencies for productive concentration",
        duration: "20m",
        durationMinutes: 20,
        category: "Focus",
        intensity: "High",
        image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600",
        audio: "/Focus.mp3",
      },
      {
        id: "anxiety-relief",
        title: "Anxiety Relief & Grounding",
        subtitle: "Emergency grounding anchor for overwhelming feelings",
        duration: "18m",
        durationMinutes: 18,
        category: "Anxiety",
        intensity: "Low",
        image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600",
        audio: "/Anxity.mp3",
      },
      {
        id: "morning-calm",
        title: "Morning Calm Visualization",
        subtitle: "Awaken peaceful awareness and mental clarity",
        duration: "56m",
        durationMinutes: 56,
        category: "Sleep",
        intensity: "Low",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
        audio: "/Calm.mp3.mp3",
      },
      {
        id: "deep-breaths",
        title: "Breathwork for Mental Focus",
        subtitle: "Rhythmic breathing to clear mental clutter",
        duration: "32m",
        durationMinutes: 32,
        category: "Focus",
        intensity: "Medium",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600",
        audio: "/Breaths.mp3.mp3",
      },
    ],
    []
  );

  // =========================================================
  // CATEGORIES
  // =========================================================
  const categories = [
    {
      title: "Sleep",
      sessionId: "night-sky-drift",
      icon: <Bed size={22} />,
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
      color: "text-violet-500 dark:text-violet-400",
      badgeColor: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300",
    },
    {
      title: "Stress Relief",
      sessionId: "forest-rain",
      icon: <Trees size={22} />,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
      color: "text-emerald-500 dark:text-emerald-400",
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    },
    {
      title: "Focus",
      sessionId: "deep-mind-focus",
      icon: <Focus size={22} />,
      image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600",
      color: "text-sky-500 dark:text-sky-400",
      badgeColor: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300",
    },
    {
      title: "Anxiety",
      sessionId: "anxiety-relief",
      icon: <Heart size={22} />,
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600",
      color: "text-rose-500 dark:text-rose-400",
      badgeColor: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
    },
  ];

  // =========================================================
  // LOAD COMPLETED EXERCISES
  // =========================================================
  useEffect(() => {
    const loadCompleted = async () => {
      try {
        setLoading(true);
        const res = await getCompletedExercises();
        if (res?.data) {
          setCompletedExercises(res.data);
        }
      } catch (err) {
        console.error("Error loading completed exercises:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCompleted();
  }, []);

  // Clean audio when unmounting
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  // Audio event listeners
  useEffect(() => {
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const startExercise = (exercise, index) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const newAudio = new Audio(exercise.audio);
    newAudio.preload = "metadata";

    setAudio(newAudio);
    setSelectedExercise(exercise);
    setCurrentIndex(
      index !== undefined
        ? index
        : sessions.findIndex((s) => s.id === exercise.id)
    );
    setCurrentTime(0);
    setDuration(0);
    setMessage("");

    newAudio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error("Audio playback error:", err);
        setIsPlaying(false);
      });
  };

  const handleCategoryClick = (cat) => {
    const matched = sessions.find((s) => s.id === cat.sessionId);
    if (matched) {
      startExercise(matched);
    }
  };

  const togglePlayPause = () => {
    if (!audio) return;
    if (audio.ended || (audio.duration && audio.currentTime >= audio.duration)) {
      audio.currentTime = 0;
      setCurrentTime(0);
      audio.play().then(() => setIsPlaying(true));
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true));
    }
  };

  const handleSeek = (e) => {
    if (!audio || !duration) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipBackward10 = () => {
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
    setCurrentTime(audio.currentTime);
  };

  const skipForward10 = () => {
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
    setCurrentTime(audio.currentTime);
  };

  const toggleMute = () => {
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCompleteExercise = async () => {
    if (!selectedExercise) return;
    try {
      setSaving(true);
      setMessage("");
      const exerciseData = {
        exerciseId: selectedExercise.id,
        title: selectedExercise.title,
        category: selectedExercise.category,
        duration: selectedExercise.durationMinutes,
      };

      const res = await completeExercise(exerciseData);
      setCompletedExercises((prev) => [res.data || exerciseData, ...prev]);
      setMessage("Exercise completed! Added to your progress.");
    } catch (err) {
      console.error("Error saving completed exercise:", err);
      setMessage("Completed locally.");
    } finally {
      setSaving(false);
    }
  };

  const closePlayer = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setSelectedExercise(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setCurrentIndex(-1);
    setMessage("");
  };

  const playNext = () => {
    if (sessions.length === 0) return;
    const nextIdx = (currentIndex + 1) % sessions.length;
    startExercise(sessions[nextIdx], nextIdx);
  };

  const playPrevious = () => {
    if (sessions.length === 0) return;
    const prevIdx = (currentIndex - 1 + sessions.length) % sessions.length;
    startExercise(sessions[prevIdx], prevIdx);
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Short (<20m)") return s.durationMinutes < 20;
    if (activeCategory === "Deep (20m+)") return s.durationMinutes >= 20;
    return s.category === activeCategory;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-32">
        {/* =====================================================
            HERO & WELCOME
        ===================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 mb-3 border border-violet-200/50 dark:border-violet-800/40">
                <Sparkles size={14} /> Guided Wellness Practice
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Mindful Exercises
              </h1>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-400 max-w-2xl">
                Listen to soundscapes, relieve stress, enhance concentration, and anchor your nervous system with sound healing.
              </p>
            </div>

            {/* Quick Link to Interactive Breathing */}
            <Link
              to="/breathing"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm shadow-md hover:shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all self-start md:self-auto"
            >
              <Wind size={18} />
              Open Breathing Orb
            </Link>
          </div>
        </section>

        {/* =====================================================
            CATEGORIES GRID
        ===================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            Browse by Focus Area
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleCategoryClick(item)}
                className="group relative h-40 sm:h-44 rounded-3xl overflow-hidden border border-gray-200/80 dark:border-slate-800/80 bg-white dark:bg-[#121b2d] cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-30 transition-all duration-700 group-hover:scale-110 group-hover:opacity-55 dark:group-hover:opacity-45"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                  <div className="w-10 h-10 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md flex items-center justify-center shadow mb-2 group-hover:scale-110 transition-transform">
                    <span className={item.color}>{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-gray-200 dark:text-gray-300 font-medium flex items-center gap-1 mt-0.5">
                    <Play size={10} className="fill-current" /> Tap to play
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* =====================================================
            FILTER TABS
        ===================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-200/60 dark:border-slate-800/80">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                "All",
                "Sleep",
                "Stress Relief",
                "Focus",
                "Anxiety",
                "Short (<20m)",
                "Deep (20m+)",
              ].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCategory(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeCategory === tab
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/20 scale-105"
                      : "bg-white dark:bg-[#121b2d] border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
              <Filter size={14} /> Showing {filteredSessions.length} sessions
            </div>
          </div>
        </section>

        {/* =====================================================
            SESSION CARDS
        ===================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSessions.map((session, idx) => {
              const isCurrent = selectedExercise?.id === session.id;

              return (
                <div
                  key={session.id}
                  className={`group rounded-3xl p-4 border transition-all duration-300 flex items-center gap-4 ${
                    isCurrent
                      ? "bg-violet-50/70 dark:bg-violet-950/20 border-violet-400 dark:border-violet-700 shadow-md ring-2 ring-violet-400/20"
                      : "bg-white dark:bg-[#121b2d] border-gray-200/80 dark:border-slate-800/80 hover:shadow-lg hover:border-violet-300 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Thumbnail with Play Hover */}
                  <div
                    onClick={() => startExercise(session, idx)}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
                  >
                    <img
                      src={session.image}
                      alt={session.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center transition">
                      <div className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-violet-700 dark:text-violet-300 flex items-center justify-center shadow">
                        {isCurrent && isPlaying ? (
                          <Pause size={14} className="fill-current" />
                        ) : (
                          <Play size={14} className="fill-current translate-x-0.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300">
                        {session.category}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                        {session.intensity} Intensity
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white truncate">
                      {session.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {session.subtitle}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-slate-800/60">
                      <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-1">
                        <Clock size={13} /> {session.duration}
                      </span>

                      <button
                        type="button"
                        onClick={() => startExercise(session, idx)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                          isCurrent && isPlaying
                            ? "bg-violet-600 text-white"
                            : "bg-violet-50 dark:bg-slate-800 text-violet-700 dark:text-violet-300 hover:bg-violet-600 hover:text-white"
                        }`}
                      >
                        {isCurrent && isPlaying ? "Playing" : "Listen"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            PROGRESS TRACKER
        ===================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
          <div className="bg-white dark:bg-[#121b2d] rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Completed Sessions
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Track your mindfulness milestones and daily relaxing routines.
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-violet-600 dark:text-violet-400">
                {loading ? "..." : completedExercises.length}
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Sessions Logged
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            FLOATING AUDIO PLAYER
        ===================================================== */}
        {selectedExercise && (
          <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[620px] z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="bg-white/95 dark:bg-[#121b2d]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700/80 p-5 relative">
              {/* Close button */}
              <button
                type="button"
                onClick={closePlayer}
                className="absolute right-4 top-4 w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 flex items-center justify-center transition cursor-pointer"
                title="Close player"
              >
                <X size={18} />
              </button>

              {/* Title & Track Info */}
              <div className="flex items-center gap-4 pr-10">
                <img
                  src={selectedExercise.image}
                  alt={selectedExercise.title}
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-purple-300/30"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    {selectedExercise.category}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                    {selectedExercise.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {selectedExercise.subtitle}
                  </p>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="mt-4">
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
                  />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between mt-3">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={playPrevious}
                    className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Previous Track"
                  >
                    <SkipBack size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={skipBackward10}
                    className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Rewind 10s"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause size={22} className="fill-current" />
                    ) : (
                      <Play size={22} className="fill-current translate-x-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={skipForward10}
                    className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Forward 10s"
                  >
                    <RotateCw size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={playNext}
                    className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Next Track"
                  >
                    <SkipForward size={18} />
                  </button>
                </div>

                {/* Mark as Completed Button */}
                <button
                  type="button"
                  onClick={handleCompleteExercise}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Mark Done"}
                </button>
              </div>

              {message && (
                <p className="text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center justify-center gap-1">
                  <CheckCircle size={14} /> {message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}