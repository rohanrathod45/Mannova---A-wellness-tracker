// import { useNavigate, useLocation } from "react-router-dom";

// export default function BottomNav() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const activeClass = "text-purple-700";
//   const normalClass = "text-gray-500 hover:text-purple-700 transition";

//   return (
//     <nav className="fixed bottom-0 left-0 w-full md:hidden bg-white border-t shadow-lg flex justify-around py-3 z-50">

//       <button
//         onClick={() => navigate("/")}
//         className={`flex flex-col items-center
//     justify-center
//     w-16 h-16
//     rounded-2xl
//     transition-all duration-300 ease-in-out
//     hover:bg-violet-100
//     hover:scale-110
//     active:scale-95
//     hover:shadow-lg
//             justify-center
//             w-16 h-16
//             rounded-2xl
//             transition-all duration-300 ease-in-out
//             hover:bg-violet-100
//             hover:scale-110
//             active:scale-95
//             hover:shadow-l${
//           location.pathname === "/" ? activeClass : normalClass
//         }`}
//       >
//         <span className="material-symbols-outlined">home</span>
//         <span className="text-xs">Home</span>
//       </button>

//       <button
//         onClick={() => navigate("/mood")}
//         className={`flex flex-col items-center
//     justify-center
//     w-16 h-16
//     rounded-2xl
//     transition-all duration-300 ease-in-out
//     hover:bg-violet-100
//     hover:scale-110
//     active:scale-95
//     hover:shadow-lg
//             justify-center
//             w-16 h-16
//             rounded-2xl
//             transition-all duration-300 ease-in-out
//             hover:bg-violet-100
//             hover:scale-110
//             active:scale-95
//             hover:shadow-l ${
//           location.pathname === "/mood" ? activeClass : normalClass
//         }`}
//       >
//         <span className="material-symbols-outlined">mood</span>
//         <span className="text-xs">Mood</span>
//       </button>

//       <button
//         onClick={() => navigate("/exercises")}
//         className={`flex flex-col items-center justify-center
//     flex-1 py-2 rounded-xl
//     transition-all duration-200
//     active:scale-90 ${
//           location.pathname === "/exercises" ? activeClass : normalClass
//         }`}
//       >
//         <span className="material-symbols-outlined">self_care</span>
//         <span className="text-xs">Exercises</span>
//       </button>

//       <button
//         onClick={() => navigate("/chat")}
//         className={`flex flex-col items-center justify-center
//     flex-1 py-2 rounded-xl
//     transition-all duration-200
//     active:scale-90 ${
//           location.pathname === "/chat" ? activeClass : normalClass
//         }`}
//       >
//         <span className="material-symbols-outlined">psychology</span>
//         <span className="text-xs">Support</span>
//       </button>

//       <button
//         onClick={() => navigate("/progress")}
//         className={`flex flex-col items-center justify-center
//     flex-1 py-2 rounded-xl
//     transition-all duration-200
//     active:scale-90 ${
//           location.pathname === "/progress" ? activeClass : normalClass
//         }`}
//       >
//         <span className="material-symbols-outlined">monitoring</span>
//         <span className="text-xs">Progress</span>
//       </button>
//     </nav>
//   );
// }

import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const getButtonClass = (path) =>
  `flex flex-col items-center justify-center
   w-14 h-14 rounded-xl
   transition-all duration-300 ease-in-out
   active:scale-95
   ${
     location.pathname === path
       ? "bg-violet-100 text-violet-700 scale-105 shadow"
       : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"
   }`;

  return (
<nav className="fixed bottom-0 left-0 w-full md:hidden bg-white border-t border-gray-200/50 shadow-md flex justify-around items-center py-1 z-50">

      <button onClick={() => navigate("/")} className={getButtonClass("/")}>
        <span className="material-symbols-outlined text-[24px]">home</span>
        <span className="text-[10px] mt-0.5 font-medium">{t("home")}</span>
      </button>

      <button onClick={() => navigate("/mood")} className={getButtonClass("/mood")}>
        <span className="material-symbols-outlined text-[24px]">mood</span>
        <span className="text-[10px] mt-0.5 font-medium">{t("mood")}</span>
      </button>

      <button onClick={() => navigate("/exercises")} className={getButtonClass("/exercises")}>
        <span className="material-symbols-outlined text-[24px]">self_care</span>
        <span className="text-[10px] mt-0.5 font-medium">{t("exercises")}</span>
      </button>

      <button onClick={() => navigate("/chat")} className={getButtonClass("/chat")}>
        <span className="material-symbols-outlined text-[24px]">psychology</span>
        <span className="text-[10px] mt-0.5 font-medium">{t("support")}</span>
      </button>

      <button onClick={() => navigate("/progress")} className={getButtonClass("/progress")}>
        <span className="material-symbols-outlined text-[24px]">monitoring</span>
        <span className="text-[10px] mt-0.5 font-medium">{t("progress")}</span>
      </button>

    </nav>
  );
}