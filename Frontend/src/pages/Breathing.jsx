import Layout from "../components/Layout";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle,
} from "lucide-react";

// =========================================================
// BREATHING TECHNIQUES (3-PHASE SEQUENCE: IN -> HOLD -> OUT -> IN)
// =========================================================
const techniques = {
  Box: {
    name: "Box Breathing",
    description: "Equal 4-4-4 rhythm for focus and calming the nervous system",
    in: 4,
    hold: 4,
    out: 4,
  },
  "478": {
    name: "4-7-8 Relaxation",
    description: "Deep parasympathetic activation for sleep and high anxiety",
    in: 4,
    hold: 7,
    out: 8,
  },
  Calm: {
    name: "Calm Resonance",
    description: "Gentle 5-5-5 flow to restore balance and emotional clarity",
    in: 5,
    hold: 5,
    out: 5,
  },
};

// =========================================================
// SYNTHESIZED ORGANIC BREATHING SOUND ENGINE (Web Audio API)
// =========================================================
class BreathingSoundEngine {
  constructor() {
    this.ctx = null;
    this.activeNodes = [];
    this.muted = false;
    this.volume = 0.5;
    this.noiseBuffer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  createNoiseBuffer() {
    if (!this.ctx) return null;
    if (this.noiseBuffer) return this.noiseBuffer;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    // Gentle pink/warm noise filter
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = lastOut * 0.95 + white * 0.05;
      data[i] = lastOut * 3;
    }

    this.noiseBuffer = buffer;
    return buffer;
  }

  playInhale(duration) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.stop();

    try {
      const now = this.ctx.currentTime;
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer();
      noise.loop = true;

      // Filter sweeping upward (air entering lungs)
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(
        540,
        now + duration * 0.85
      );
      filter.Q.value = 1.6;

      // Smooth ascending gain envelope
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(
        0.32 * this.volume,
        now + duration * 0.8
      );
      gain.gain.linearRampToValueAtTime(0.001, now + duration);

      // Deep harmonic undertone for grounding
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(140, now + duration);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(
        0.06 * this.volume,
        now + duration * 0.7
      );
      oscGain.gain.linearRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(now);
      osc.start(now);
      noise.stop(now + duration);
      osc.stop(now + duration);

      this.activeNodes.push(noise, osc);
    } catch (e) {
      console.warn("Inhale sound error:", e);
    }
  }

  playHold(duration) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.stop();

    try {
      const now = this.ctx.currentTime;
      // Serene Tibetan singing bowl harmonic chime (528 Hz Solfeggio Love frequency)
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, now);

      const oscSub = this.ctx.createOscillator();
      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(264, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18 * this.volume, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + Math.min(duration, 3.2)
      );

      osc.connect(gain);
      oscSub.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      oscSub.start(now);
      osc.stop(now + duration);
      oscSub.stop(now + duration);

      this.activeNodes.push(osc, oscSub);
    } catch (e) {
      console.warn("Hold sound error:", e);
    }
  }

  playExhale(duration) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.stop();

    try {
      const now = this.ctx.currentTime;
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer();
      noise.loop = true;

      // Filter sweeping downward (releasing air and tension)
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + duration);
      filter.Q.value = 1.3;

      // Smooth release gain envelope
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3 * this.volume, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);

      this.activeNodes.push(noise);
    } catch (e) {
      console.warn("Exhale sound error:", e);
    }
  }

  stop() {
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch {}
    });
    this.activeNodes = [];
  }
}

// Singleton sound engine
const soundEngine = new BreathingSoundEngine();

export default function Breathing() {
  // Session & Phase States
  const [timer, setTimer] = useState(300); // 5 min
  const [isRunning, setIsRunning] = useState(false);
  const [technique, setTechnique] = useState("Box");
  const [phase, setPhase] = useState("ready"); // "in" | "hold" | "out" | "ready"
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Sound States
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  const timerIntervalRef = useRef(null);
  const phaseTimeoutRef = useRef(null);
  const phaseCountIntervalRef = useRef(null);

  const currentConfig = techniques[technique] || techniques.Box;

  // Toggle sound
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.muted = !next;
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    soundEngine.volume = val;
  };

  // =========================================================
  // CORE 3-PHASE SEQUENCE: IN -> HOLD -> OUT -> IN
  // No hold after exhale!
  // =========================================================
  const runSequence = useCallback(
    (currentPhase = "in") => {
      clearTimeout(phaseTimeoutRef.current);
      clearInterval(phaseCountIntervalRef.current);

      const config = techniques[technique] || techniques.Box;

      if (currentPhase === "in") {
        setPhase("in");
        setPhaseSecondsLeft(config.in);
        soundEngine.playInhale(config.in);

        // Countdown ticks
        let seconds = config.in;
        phaseCountIntervalRef.current = setInterval(() => {
          seconds -= 1;
          if (seconds >= 0) {
            setPhaseSecondsLeft(seconds);
          }
        }, 1000);

        // Advance to HOLD after inhale completes
        phaseTimeoutRef.current = setTimeout(() => {
          runSequence("hold");
        }, config.in * 1000);
      } else if (currentPhase === "hold") {
        setPhase("hold");
        setPhaseSecondsLeft(config.hold);
        soundEngine.playHold(config.hold);

        // Countdown ticks
        let seconds = config.hold;
        phaseCountIntervalRef.current = setInterval(() => {
          seconds -= 1;
          if (seconds >= 0) {
            setPhaseSecondsLeft(seconds);
          }
        }, 1000);

        // Advance to OUT after hold completes
        phaseTimeoutRef.current = setTimeout(() => {
          runSequence("out");
        }, config.hold * 1000);
      } else if (currentPhase === "out") {
        setPhase("out");
        setPhaseSecondsLeft(config.out);
        soundEngine.playExhale(config.out);

        // Countdown ticks
        let seconds = config.out;
        phaseCountIntervalRef.current = setInterval(() => {
          seconds -= 1;
          if (seconds >= 0) {
            setPhaseSecondsLeft(seconds);
          }
        }, 1000);

        // Advance DIRECTLY TO IN after exhale completes (no hold after exhale!)
        phaseTimeoutRef.current = setTimeout(() => {
          setCyclesCompleted((prev) => prev + 1);
          runSequence("in");
        }, config.out * 1000);
      }
    },
    [technique]
  );

  // Overall session countdown timer
  useEffect(() => {
    if (!isRunning) return;

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stopExercise();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [isRunning]);

  // Start or stop sequence when isRunning changes
  useEffect(() => {
    if (isRunning) {
      soundEngine.init();
      soundEngine.muted = !soundEnabled;
      soundEngine.volume = volume;
      runSequence("in");
    } else {
      clearTimeout(phaseTimeoutRef.current);
      clearInterval(phaseCountIntervalRef.current);
      soundEngine.stop();
      setPhase("ready");
      setPhaseSecondsLeft(currentConfig.in);
    }

    return () => {
      clearTimeout(phaseTimeoutRef.current);
      clearInterval(phaseCountIntervalRef.current);
      soundEngine.stop();
    };
  }, [isRunning, runSequence, soundEnabled, volume, currentConfig.in]);

  const startExercise = () => {
    setIsRunning(true);
  };

  const pauseExercise = () => {
    setIsRunning(false);
  };

  const resetExercise = () => {
    setIsRunning(false);
    clearInterval(timerIntervalRef.current);
    clearTimeout(phaseTimeoutRef.current);
    clearInterval(phaseCountIntervalRef.current);
    soundEngine.stop();

    setTimer(300);
    setPhase("ready");
    setPhaseSecondsLeft(currentConfig.in);
    setCyclesCompleted(0);
  };

  const stopExercise = () => {
    resetExercise();
  };

  const toggleExercise = () => {
    if (isRunning) {
      pauseExercise();
    } else {
      startExercise();
    }
  };

  // Orb visual state & text
  const getOrbState = () => {
    if (phase === "in") {
      return {
        text: "Breathe In",
        instruction: "Fill your lungs smoothly",
        scale: "scale-125",
        duration: currentConfig.in,
        glowColor: "shadow-[0_0_80px_rgba(167,139,250,0.6)]",
        ringColor: "border-violet-400 dark:border-violet-400",
      };
    }
    if (phase === "hold") {
      return {
        text: "Hold",
        instruction: "Maintain peaceful stillness",
        scale: "scale-125",
        duration: currentConfig.hold,
        glowColor: "shadow-[0_0_90px_rgba(192,132,252,0.7)]",
        ringColor: "border-purple-400 dark:border-purple-400 animate-pulse",
      };
    }
    if (phase === "out") {
      return {
        text: "Breathe Out",
        instruction: "Slowly release all tension",
        scale: "scale-90",
        duration: currentConfig.out,
        glowColor: "shadow-[0_0_50px_rgba(139,92,246,0.3)]",
        ringColor: "border-indigo-300 dark:border-indigo-600",
      };
    }
    return {
      text: "Ready?",
      instruction: "Tap Play to begin your session",
      scale: "scale-100",
      duration: 1,
      glowColor: "shadow-2xl",
      ringColor: "border-violet-300 dark:border-slate-700",
    };
  };

  const orb = getOrbState();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] w-full bg-[#f8f9ff] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300 px-4 py-6 pb-28 md:py-10 md:pb-12">
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-300/25 dark:bg-violet-900/20 blur-[120px] animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-300/25 dark:bg-sky-900/15 blur-[120px] animate-pulse" />
        </div>

        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-5 sm:gap-8 text-center">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/40 mb-2 sm:mb-3">
              <Sparkles size={14} /> 3-Phase Continuous Flow
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Guided Breathing
            </h1>
            <p className="mt-1 text-xs sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Follow the natural rhythm: <strong className="text-violet-600 dark:text-violet-400">Breathe In → Hold → Breathe Out → Breathe In</strong>
            </p>
          </div>

          {/* =====================================================
              BREATHING ORB WITH COUNTDOWN & RHYTHMIC SOUND
          ===================================================== */}
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center my-1 sm:my-2">
            {/* Outer Ambient Rings */}
            <div
              className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${orb.ringColor}`}
              style={{
                transform:
                  phase === "in" || phase === "hold"
                    ? "scale(1.15)"
                    : "scale(0.95)",
              }}
            />

            <div
              className={`absolute -inset-4 rounded-full border border-violet-300/30 dark:border-violet-800/30 transition-all duration-1000 ${
                isRunning ? "opacity-100 scale-105" : "opacity-0"
              }`}
            />

            {/* Main Interactive Animated Orb */}
            <div
              className={`w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 dark:from-violet-500 dark:via-purple-600 dark:to-indigo-800 flex flex-col items-center justify-center text-white ${orb.scale} ${orb.glowColor} transition-transform ease-in-out cursor-pointer select-none`}
              style={{
                transitionDuration: `${orb.duration}s`,
              }}
              onClick={toggleExercise}
            >
              <span className="text-[10px] sm:text-xs uppercase tracking-[2px] sm:tracking-[3px] font-bold text-violet-200/90 mb-0.5 sm:mb-1">
                {isRunning ? currentConfig.name : "Tap Orb"}
              </span>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wide">
                {orb.text}
              </h2>

              {/* Live Phase Countdown */}
              {isRunning && (
                <div className="mt-2 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md shadow-inner text-xl font-bold text-white">
                  {phaseSecondsLeft}
                </div>
              )}

              <p className="text-[11px] text-violet-200/80 mt-2 px-4 font-medium text-center">
                {orb.instruction}
              </p>
            </div>
          </div>

          {/* =====================================================
              TIMER, CYCLES & AUDIO CONTROLS
          ===================================================== */}
          <div className="w-full flex flex-col items-center gap-4">
            {/* Stats Row */}
            <div className="flex items-center gap-3">
              <div className="bg-white/80 dark:bg-[#121b2d]/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-gray-200 dark:border-slate-800 shadow-sm">
                <span className="text-xl sm:text-2xl font-bold text-violet-600 dark:text-violet-400 font-mono">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
              </div>

              <div className="bg-white/80 dark:bg-[#121b2d]/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-gray-200 dark:border-slate-800 shadow-sm text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                <CheckCircle size={15} className="text-emerald-500" />
                {cyclesCompleted} Cycles
              </div>

              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleSound}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                  soundEnabled
                    ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-slate-700"
                }`}
                title={soundEnabled ? "Mute Breathing Sound" : "Enable Breathing Sound"}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>

            {/* Sound Volume Slider (when sound enabled) */}
            {soundEnabled && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Sound Level:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
              </div>
            )}

            {/* Technique Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {Object.keys(techniques).map((key) => {
                const item = techniques[key];
                const active = technique === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setTechnique(key);
                      resetExercise();
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-violet-600 text-white shadow-md shadow-violet-500/25 scale-105"
                        : "bg-white dark:bg-[#121b2d] border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.name} ({item.in}-{item.hold}-{item.out})
                  </button>
                );
              })}
            </div>
          </div>

          {/* =====================================================
              PRIMARY CONTROLS (STOP, PLAY/PAUSE, RESET)
          ===================================================== */}
          <div className="flex items-center justify-center gap-6 mt-2">
            {/* Stop */}
            <button
              type="button"
              onClick={stopExercise}
              disabled={!isRunning && timer === 300}
              className="w-12 h-12 rounded-full bg-white dark:bg-[#121b2d] border border-gray-200 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
              title="Stop exercise"
            >
              <Square size={18} />
            </button>

            {/* Main Play / Pause */}
            <button
              type="button"
              onClick={toggleExercise}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white flex items-center justify-center shadow-xl shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isRunning ? "Pause" : "Start"}
            >
              {isRunning ? (
                <Pause size={28} className="fill-current" />
              ) : (
                <Play size={28} className="fill-current translate-x-0.5" />
              )}
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={resetExercise}
              className="w-12 h-12 rounded-full bg-white dark:bg-[#121b2d] border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}