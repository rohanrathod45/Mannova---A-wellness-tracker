import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import {
  Bed,
  Sparkles,
  Wind,
  Target,
  Heart,
  Trees,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  Filter,
  CheckCircle,
  X,
  Volume2,
  VolumeX,
  Music,
  Check,
  Sparkle,
} from "lucide-react";

import {
  completeExercise,
  getCompletedExercises,
} from "../api/exerciseApi";

export default function Exercises() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Backend state
  const [completedExercises, setCompletedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // HTML5 Audio Reference
  const audioRef = useRef(null);

  // ==========================================
  // CATEGORIES DATA
  // ==========================================
  const categories = [
    {
      name: "All",
      icon: <Music className="w-5 h-5" />,
      bgColor: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40",
    },
    {
      name: "Sleep",
      icon: <Bed className="w-5 h-5" />,
      bgColor: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40",
    },
    {
      name: "Meditation",
      icon: <Sparkles className="w-5 h-5" />,
      bgColor: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/40",
    },
    {
      name: "Breathing",
      icon: <Wind className="w-5 h-5" />,
      bgColor: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/40",
    },
    {
      name: "Focus",
      icon: <Target className="w-5 h-5" />,
      bgColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
    },
    {
      name: "Relaxation",
      icon: <Heart className="w-5 h-5" />,
      bgColor: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40",
    },
    {
      name: "Nature",
      icon: <Trees className="w-5 h-5" />,
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
    },
  ];

  // ==========================================
  // EXERCISE SESSIONS DATA (EXPANDED COLLECTION)
  // ==========================================
  const sessions = [
    {
      id: 1,
      title: "Forest Rain",
      category: "Sleep",
      duration: "10 min",
      durationMinutes: 10,
      image: "/forest-rain.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
      audio: "/Forest.mp3.mp3",
      description: "Soothing rain sounds deep inside a quiet forest to drift into peaceful sleep.",
    },
    {
      id: 2,
      title: "Morning Calm",
      category: "Meditation",
      duration: "8 min",
      durationMinutes: 8,
      image: "/morning-calm.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
      audio: "/Calm.mp3.mp3",
      description: "Start your day with gentle mindfulness and positive guided energy.",
    },
    {
      id: 3,
      title: "Deep Breaths",
      category: "Breathing",
      duration: "5 min",
      durationMinutes: 5,
      image: "/deep-breaths.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600",
      audio: "/Breaths.mp3.mp3",
      description: "Simple box breathing pattern to calm your nervous system instantly.",
    },
    {
      id: 4,
      title: "Focus Mind",
      category: "Focus",
      duration: "12 min",
      durationMinutes: 12,
      image: "/focus-mind.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600",
      audio: "/Focus.mp3",
      description: "Ambient binaural tones engineered to enhance concentration & work flow.",
    },
    {
      id: 5,
      title: "Serene Relaxation",
      category: "Relaxation",
      duration: "15 min",
      durationMinutes: 15,
      image: "/serene-relaxation.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600",
      audio: "/Stress.mp3",
      description: "Unwind body and mind after a long day with restorative relaxation frequency.",
    },
    {
      id: 6,
      title: "Acoustic guitar",
      category: "Nature",
      duration: "20 min",
      durationMinutes: 20,
      image: "/nature-sounds.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
      audio: "/Sleep.mp3",
      description: "A soothing melody blending earthy tones, gentle instrumentation, and a peaceful natural atmosphere.",
    },
    {
      id: 7,
      title: "Cosmic Dreams",
      category: "Sleep",
      duration: "15 min",
      durationMinutes: 15,
      image: "/cosmic-dreams.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600",
      audio: "/Sleep.mp3",
      description: "Ambient starlight frequencies for deep REM sleep and quiet thoughts.",
    },
    {
      id: 8,
      title: "Night Ocean Waves",
      category: "Sleep",
      duration: "25 min",
      durationMinutes: 25,
      image: "/ocean-waves.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
      audio: "/Forest.mp3.mp3",
      description: "Rhythmic shoreline ocean waves to wash away insomnia and stress.",
    },
    {
      id: 9,
      title: "Slumber Melody",
      category: "Sleep",
      duration: "12 min",
      durationMinutes: 12,
      image: "/slumber.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=600",
      audio: "/Sleep.mp3",
      description: "Warm lullaby acoustic tones for peaceful evening rest.",
    },
    {
      id: 10,
      title: "Inner Peace",
      category: "Meditation",
      duration: "10 min",
      durationMinutes: 10,
      image: "/inner-peace.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600",
      audio: "/Calm.mp3.mp3",
      description: "Centered mindfulness session for quiet self-awareness and healing.",
    },
    {
      id: 11,
      title: "Zen Garden",
      category: "Meditation",
      duration: "15 min",
      durationMinutes: 15,
      image: "/zen-garden.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600",
      audio: "/Calm.mp3.mp3",
      description: "Traditional singing bowls and soft chimes for deep tranquility.",
    },
    {
      id: 12,
      title: "Mindful Dawn",
      category: "Meditation",
      duration: "7 min",
      durationMinutes: 7,
      image: "/mindful-dawn.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600",
      audio: "/Calm.mp3.mp3",
      description: "Sunrise meditation session to start your morning with gratitude.",
    },
    {
      id: 13,
      title: "Calm Pulses",
      category: "Breathing",
      duration: "6 min",
      durationMinutes: 6,
      image: "/calm-pulses.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
      audio: "/Breaths.mp3.mp3",
      description: "Guided audio cues to slow down heart rate and relieve anxiety.",
    },
    {
      id: 14,
      title: "Rhythm of Life",
      category: "Breathing",
      duration: "8 min",
      durationMinutes: 8,
      image: "/rhythm-life.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600",
      audio: "/Breaths.mp3.mp3",
      description: "Diaphragmatic breathing harmony designed to balance your mind.",
    },
    {
      id: 15,
      title: "Deep Work Frequency",
      category: "Focus",
      duration: "30 min",
      durationMinutes: 30,
      image: "/deep-work.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600",
      audio: "/Focus.mp3",
      description: "432Hz deep focus audio track for intense studying and coding.",
    },
    {
      id: 16,
      title: "Alpha Waves Flow",
      category: "Focus",
      duration: "20 min",
      durationMinutes: 20,
      image: "/alpha-waves.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
      audio: "/Focus.mp3",
      description: "Isochronic brainwave pulses to eliminate mental fog and boost creativity.",
    },
    {
      id: 17,
      title: "Sunset Serenade",
      category: "Relaxation",
      duration: "18 min",
      durationMinutes: 18,
      image: "/sunset-serenade.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
      audio: "/Stress.mp3",
      description: "Golden hour soundscape to release muscle tension and ease stress.",
    },
    {
      id: 18,
      title: "Soft Piano Breeze",
      category: "Relaxation",
      duration: "10 min",
      durationMinutes: 10,
      image: "/piano-breeze.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600",
      audio: "/Calm.mp3.mp3",
      description: "Gentle solo piano composition paired with light ambient atmospheric noise.",
    },
    {
      id: 19,
      title: "Gentle Waterfall",
      category: "Nature",
      duration: "20 min",
      durationMinutes: 20,
      image: "/waterfall.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600",
      audio: "/Forest.mp3.mp3",
      description: "Fresh cascade stream water flowing over river pebbles.",
    },
    {
      id: 20,
      title: "Mountain Wind",
      category: "Nature",
      duration: "15 min",
      durationMinutes: 15,
      image: "/mountain-wind.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600",
      audio: "/Forest.mp3.mp3",
      description: "High elevation crisp mountain breeze with distant pine rustling.",
    },
  ];

  // Filtered Sessions List
  const filteredSessions = sessions.filter((session) => {
    if (activeFilter === "All") return true;
    return session.category === activeFilter;
  });

  // Fetch completed exercises from API
  useEffect(() => {
    const loadCompletedExercises = async () => {
      try {
        setLoading(true);
        const response = await getCompletedExercises();
        setCompletedExercises(response?.data || response || []);
      } catch (error) {
        console.error("Load exercises error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCompletedExercises();
  }, []);

  // ==========================================
  // AUDIO CONTROLS & EFFECTS (HTML5 Audio API)
  // ==========================================

  // Load and play selected track
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const audio = audioRef.current;
    audio.src = currentTrack.audio;
    audio.currentTime = 0;
    setCurrentTime(0);

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Autoplay blocked or playback error:", err);
        setIsPlaying(false);
      });
    }
  }, [currentTrack]);

  // Sync play/pause state with audio element
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Audio play error:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Sync volume state
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Select / Play Track
  const handleSelectTrack = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  // Play Next Track
  const handleNextTrack = () => {
    if (!currentTrack) return;
    const currentList = filteredSessions.length > 0 ? filteredSessions : sessions;
    const currentIndex = currentList.findIndex((s) => s.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentList.length;
    setCurrentTrack(currentList[nextIndex]);
    setIsPlaying(true);
  };

  // Play Previous Track
  const handlePreviousTrack = () => {
    if (!currentTrack) return;
    const currentList = filteredSessions.length > 0 ? filteredSessions : sessions;
    const currentIndex = currentList.findIndex((s) => s.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    setCurrentTrack(currentList[prevIndex]);
    setIsPlaying(true);
  };

  // Audio Event Handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
    setCurrentTime(seekTime);
  };

  const handleTrackEnded = () => {
    handleNextTrack();
  };

  // Graceful fallback if audio cannot be loaded
  const handleAudioError = () => {
    if (!audioRef.current || !currentTrack) return;
    const fallbackAudios = {
      Sleep: "/Sleep.mp3",
      Meditation: "/Calm.mp3.mp3",
      Breathing: "/Breaths.mp3.mp3",
      Focus: "/Focus.mp3",
      Relaxation: "/Stress.mp3",
      Nature: "/Forest.mp3.mp3",
    };
    const fallback = fallbackAudios[currentTrack.category] || "/Calm.mp3.mp3";
    if (!audioRef.current.src.endsWith(fallback)) {
      audioRef.current.src = fallback;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  // Format Seconds to MM:SS
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === null) return "0:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Mark exercise complete in backend
  const handleCompleteExercise = async (trackToComplete) => {
    const target = trackToComplete || currentTrack;
    if (!target) return;

    try {
      setSaving(true);
      setMessage("");

      const exerciseData = {
        exerciseId: target.id.toString(),
        title: target.title,
        category: target.category,
        duration: target.durationMinutes || 10,
      };

      const response = await completeExercise(exerciseData);
      const newCompleted = response?.data || response;

      setCompletedExercises((prev) => [newCompleted, ...prev]);
      setMessage(`"${target.title}" marked as completed!`);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Complete exercise error:", error);
    } finally {
      setSaving(false);
    }
  };

  const isExerciseCompleted = (exerciseId) => {
    return completedExercises.some(
      (item) => item.exerciseId === exerciseId.toString() || item.exerciseId === exerciseId
    );
  };

  return (
    <Layout>
      {/* Hidden Audio Element for HTML5 Audio API */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
        onError={handleAudioError}
        preload="metadata"
      />

      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFE] via-[#F3F0FA] to-[#F8F5FF] dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] text-gray-900 dark:text-gray-100 pb-36 transition-colors duration-300">
        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 dark:bg-[#121b2d]/80 backdrop-blur-xl border border-purple-100/70 dark:border-slate-800/80 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-violet-100/80 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-semibold tracking-wide uppercase mb-2 sm:mb-3 border border-violet-200/50 dark:border-violet-800/40">
                <Sparkle className="w-3.5 h-3.5" /> Mindful Wellness Sessions
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Wellness & Audio Exercises
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base mt-2 max-w-2xl">
                Immerse yourself in calm meditations, restorative rain ambient, breathing exercises, and focus frequencies designed for your mind.
              </p>
            </div>

            {/* ACTION BUTTONS: BREATHING BUTTON & STATS */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start md:self-center">
              {/* Preserved Breathing Orb Button */}
              <Link
                to="/breathing"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-teal-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
                Open Breathing Orb
              </Link>

              {completedExercises.length > 0 && (
                <div className="flex items-center gap-3.5 bg-violet-50 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-800/50 p-3 px-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {completedExercises.length}
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-none mb-1">Completed</div>
                    <div className="text-xs sm:text-sm font-bold text-violet-900 dark:text-violet-200 leading-none">Sessions Finished</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CATEGORIES GRID */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span>Explore Categories</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((cat) => {
              const isActive = activeFilter === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveFilter(cat.name)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 group cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-[#15213b] border-violet-400 dark:border-violet-500 shadow-md ring-2 ring-violet-500/20 scale-[1.02]"
                      : "bg-white/80 dark:bg-[#121b2d]/80 border-gray-200/80 dark:border-slate-800/80 hover:bg-white dark:hover:bg-[#15213b] hover:border-violet-200 dark:hover:border-slate-700 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 mb-2 ${
                      isActive ? "bg-violet-600 text-white shadow-sm" : cat.bgColor
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? "text-violet-900 dark:text-violet-300 font-bold" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FILTER PILLS */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Filter Sessions:</span>
            <span className="text-xs bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 font-semibold px-2.5 py-0.5 rounded-full border border-violet-200/40 dark:border-violet-800/40">
              {filteredSessions.length} {filteredSessions.length === 1 ? "Session" : "Sessions"}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveFilter(cat.name)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === cat.name
                    ? "bg-violet-700 text-white shadow-sm"
                    : "bg-white dark:bg-[#121b2d] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-800 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-700 dark:hover:text-violet-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* EXERCISE MUSIC CARDS GRID */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => {
              const isSelected = currentTrack?.id === session.id;
              const isCurrentPlaying = isSelected && isPlaying;
              const completed = isExerciseCompleted(session.id);

              return (
                <div
                  key={session.id}
                  onClick={() => handleSelectTrack(session)}
                  className={`group relative bg-white dark:bg-[#121b2d] rounded-3xl border overflow-hidden p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-violet-500 ring-2 ring-violet-500/20 shadow-lg bg-gradient-to-br from-white to-violet-50/30 dark:from-[#121b2d] dark:to-violet-950/20"
                      : "border-gray-200/80 dark:border-slate-800/80 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-md"
                  }`}
                >
                  {/* Card Top */}
                  <div>
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-slate-800">
                      <img
                        src={session.fallbackImage || session.image}
                        alt={session.title}
                        onError={(e) => {
                          if (e.currentTarget.src !== session.fallbackImage) {
                            e.currentTarget.src = session.fallbackImage;
                          }
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200 shadow-sm flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-violet-600 inline-block" />
                        {session.category}
                      </div>

                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {session.duration}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTrack(session);
                          }}
                          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform cursor-pointer ${
                            isCurrentPlaying
                              ? "bg-violet-600 text-white scale-110 ring-4 ring-white/50"
                              : "bg-white/95 text-violet-700 hover:bg-violet-600 hover:text-white hover:scale-110"
                          }`}
                        >
                          {isCurrentPlaying ? (
                            <Pause className="w-6 h-6 fill-current" />
                          ) : (
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          )}
                        </button>
                      </div>

                      {isCurrentPlaying && (
                        <div className="absolute bottom-3 left-3 bg-violet-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                          <span className="flex items-center gap-0.5 h-3">
                            <span className="w-1 bg-white animate-bounce h-full rounded-full" />
                            <span className="w-1 bg-white animate-bounce h-2 rounded-full delay-100" />
                            <span className="w-1 bg-white animate-bounce h-3.5 rounded-full delay-200" />
                          </span>
                          Now Playing
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
                        {session.title}
                      </h3>
                      {completed && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> Done
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {session.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Music className="w-3.5 h-3.5 text-violet-500" /> Audio Track
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTrack(session);
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCurrentPlaying
                          ? "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700"
                          : "bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
                      }`}
                    >
                      {isCurrentPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> Play Session
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FIXED MINI MUSIC PLAYER */}
        {currentTrack && (
          <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[520px] z-50 transition-all duration-300">
            <div className="bg-white/95 dark:bg-[#121b2d]/95 backdrop-blur-2xl border border-violet-200/80 dark:border-slate-700/80 rounded-3xl shadow-2xl p-4 md:p-5 relative overflow-hidden ring-1 ring-violet-500/10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentTrack(null);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Close Player"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 pr-6">
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-800 shadow-md">
                  <img
                    src={currentTrack.fallbackImage || currentTrack.image}
                    alt={currentTrack.title}
                    onError={(e) => {
                      if (e.currentTarget.src !== currentTrack.fallbackImage) {
                        e.currentTarget.src = currentTrack.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-violet-900/30 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-md">
                    {currentTrack.category}
                  </span>
                  <h4 className="text-sm md:text-base font-bold text-gray-900 dark:text-white truncate mt-0.5">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {isPlaying ? "Playing session..." : "Paused"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-3">
                <button
                  type="button"
                  onClick={handlePreviousTrack}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNextTrack}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 rounded-full transition cursor-pointer ml-2 hidden sm:block"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Dynamic Seek Progress Bar */}
              <div className="mt-3">
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime || 0}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between">
                {message ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {message}
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    Mannova Audio Player
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleCompleteExercise(currentTrack)}
                  disabled={saving}
                  className="px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                  {saving ? "Saving..." : "Mark Complete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}