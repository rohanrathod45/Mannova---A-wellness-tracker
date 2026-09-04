// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Layout from "../components/Layout";
// import { getMyProfile } from "../api/profileApi";
// import { getMoods } from "../api/moodApi";
// import { getCompletedExercises } from "../api/exerciseApi";
// import { updateProfileImage } from "../api/profileApi";
// import defaultProfile from "../assets/default-profile.webp";

// export default function Profile() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [moods, setMoods] = useState([]);
// const [completedExercises, setCompletedExercises] =
//   useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [darkMode, setDarkMode] = useState(false);

//   const [uploadingImage, setUploadingImage] = useState(false);

// const fileInputRef = React.useRef(null);

//   const [showEditProfile, setShowEditProfile] =
//     useState(false);

//   const [editName, setEditName] = useState("");

//   // ==========================================
//   // LOAD LOGGED-IN USER PROFILE
//   // ==========================================

//   useEffect(() => {
//   const loadProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       // Load logged-in user
//       const profileResponse =
//         await getMyProfile();

//       console.log(
//         "Profile:",
//         profileResponse
//       );

//       const profileUser =
//         profileResponse?.user ||
//         profileResponse?.data ||
//         profileResponse;

//       setUser(profileUser);

//       setEditName(
//         profileUser?.fullName ||
//           profileUser?.name ||
//           ""
//       );

//       // Load moods
//       const moodResponse =
//         await getMoods();

//       console.log(
//         "Profile moods:",
//         moodResponse
//       );

//       setMoods(
//         moodResponse?.data || []
//       );

//       // Load completed exercises
//       const exerciseResponse =
//         await getCompletedExercises();

//       console.log(
//         "Profile exercises:",
//         exerciseResponse
//       );

//       setCompletedExercises(
//         exerciseResponse?.data || []
//       );

//     } catch (error) {
//       console.error(
//         "Profile error:",
//         error
//       );

//       if (
//         error.response?.status === 401 ||
//         error.response?.status === 403
//       ) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         navigate("/login", {
//           replace: true,
//         });

//         return;
//       }

//       setError(
//         error.response?.data?.message ||
//           "Unable to load your profile."
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   loadProfile();
// }, [navigate]);
// // ==========================================
// // PROFILE PROGRESS CALCULATIONS
// // ==========================================

// // Total sessions = mood reflections
// const totalSessions = moods.length;

// // Total exercise minutes
// const totalExerciseMinutes =
//   completedExercises.reduce(
//     (total, exercise) =>
//       total +
//       Number(exercise.duration || 0),
//     0
//   );

// // Calculate wellness streak
// const calculateStreak = () => {
//   if (!moods.length) return 0;

//   const dates = [
//     ...new Set(
//       moods.map((item) => {
//         const date = new Date(
//           item.createdAt || item.date
//         );

//         date.setHours(0, 0, 0, 0);

//         return date.toDateString();
//       })
//     ),
//   ]
//     .map((date) => new Date(date))
//     .sort((a, b) => b - a);

//   if (!dates.length) return 0;

//   const today = new Date();

//   today.setHours(0, 0, 0, 0);

//   const latestDate = new Date(
//     dates[0]
//   );

//   latestDate.setHours(0, 0, 0, 0);

//   const difference = Math.floor(
//     (today - latestDate) /
//       (1000 * 60 * 60 * 24)
//   );

//   // If last activity was more than
//   // one day ago, current streak is 0.
//   if (difference > 1) {
//     return 0;
//   }

//   let streak = 1;

//   for (let i = 1; i < dates.length; i++) {
//     const previousDate = dates[i - 1];
//     const currentDate = dates[i];

//     const dayDifference = Math.floor(
//       (previousDate - currentDate) /
//         (1000 * 60 * 60 * 24)
//     );

//     if (dayDifference === 1) {
//       streak++;
//     } else {
//       break;
//     }
//   }

//   return streak;
// };

// const wellnessStreak =
//   calculateStreak();
//   // ==========================================
//   // LOGOUT
//   // ==========================================

//   const handleLogout = () => {
//     const confirmed = window.confirm(
//       "Are you sure you want to logout?"
//     );

//     if (!confirmed) return;

//     // Remove authentication data
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     // Remove old temporary exercise data if present
//     localStorage.removeItem(
//       "completedExercises"
//     );

//     // Go to login page
//     navigate("/login", { replace: true });
//   };

//   // ==========================================
//   // EDIT PROFILE
//   // ==========================================

//   const handleEditProfile = () => {
//     setEditName(
//       user?.fullName ||
//         user?.name ||
//         ""
//     );

//     setShowEditProfile(true);
//   };

//   // ==========================================
//   // SAVE PROFILE
//   // ==========================================

//   const handleSaveProfile = async () => {
//     const trimmedName =
//       editName.trim();

//     if (!trimmedName) {
//       alert("Please enter your name.");
//       return;
//     }

//     /*
//       IMPORTANT:

//       We are not sending a PUT request yet because
//       your current profile API that we have already
//       connected is getMyProfile().

//       For now we update the displayed profile and
//       local user data.

//       Once we add the backend UPDATE profile endpoint,
//       this function will send the data to MongoDB.
//     */

//     const updatedUser = {
//       ...user,
//       fullName: trimmedName,
//       name: trimmedName,
//     };

//     setUser(updatedUser);

//     // Keep local user information synchronized
//     const storedUser =
//       localStorage.getItem("user");

//     if (storedUser) {
//       try {
//         const parsedUser =
//           JSON.parse(storedUser);

//         localStorage.setItem(
//           "user",
//           JSON.stringify({
//             ...parsedUser,
//             fullName: trimmedName,
//             name: trimmedName,
//           })
//         );
//       } catch (error) {
//         console.log(
//           "Could not update local user data."
//         );
//       }
//     }

//     setShowEditProfile(false);

//     alert(
//       "Profile updated on this page. Backend profile update will be connected next."
//     );
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading) {
//     return (
//       <Layout>
//         <div className="min-h-screen flex items-center justify-center px-6">

//           <div className="text-center">

//             <div className="text-5xl mb-4">
//               🌿
//             </div>

//             <p className="text-[#674bb5] text-lg font-medium">
//               Loading your profile...
//             </p>

//           </div>

//         </div>
//       </Layout>
//     );
//   }

//   const handleProfileImageChange = async (event) => {
//   const file = event.target.files?.[0];

//   if (!file) return;

//   if (!file.type.startsWith("image/")) {
//     alert("Please select an image file.");
//     return;
//   }

//   try {
//     setUploadingImage(true);

//     const reader = new FileReader();

//     reader.onload = async () => {
//       const image = new Image();

//       image.onload = async () => {
//         const canvas = document.createElement("canvas");

//         const MAX_SIZE = 300;

//         let width = image.width;
//         let height = image.height;

//         if (width > height) {
//           if (width > MAX_SIZE) {
//             height = (height / width) * MAX_SIZE;
//             width = MAX_SIZE;
//           }
//         } else {
//           if (height > MAX_SIZE) {
//             width = (width / height) * MAX_SIZE;
//             height = MAX_SIZE;
//           }
//         }

//         canvas.width = width;
//         canvas.height = height;

//         const ctx = canvas.getContext("2d");

//         ctx.drawImage(
//           image,
//           0,
//           0,
//           width,
//           height
//         );

//         const compressedImage =
//           canvas.toDataURL("image/jpeg", 0.8);

//         try {
//           const response =
//             await updateProfileImage(
//               compressedImage
//             );

//           console.log(
//             "Profile image updated:",
//             response
//           );

//           setUser(response.user);

//           localStorage.setItem(
//             "user",
//             JSON.stringify(response.user)
//           );

//           alert(
//             "Profile picture updated successfully!"
//           );

//         } catch (error) {
//           console.error(
//             "Profile image upload error:",
//             error
//           );

//           alert(
//             error.response?.data?.message ||
//               "Failed to update profile picture."
//           );
//         } finally {
//           setUploadingImage(false);
//         }
//       };

//       image.src = reader.result;
//     };

//     reader.readAsDataURL(file);

//   } catch (error) {
//     console.error(error);

//     setUploadingImage(false);

//     alert(
//       "Something went wrong while selecting the image."
//     );
//   }
// };

//   // ==========================================
//   // MAIN PROFILE
//   // ==========================================

//   return (
//     <Layout>

//       <div
//         className={`min-h-screen transition-colors duration-300 ${
//           darkMode
//             ? "bg-[#18202b] text-white"
//             : "bg-transparent text-[#494552]"
//         }`}
//       >

//         <main className="mx-auto max-w-7xl px-4 py-8 pb-32 md:px-10">

//           {/* ==========================================
//               ERROR
//           ========================================== */}

//           {error && (
//             <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
//               {error}
//             </div>
//           )}

//           {/* ==========================================
//               PROFILE HEADER
//           ========================================== */}

//           <section className="mb-12 flex flex-col items-center gap-8 md:flex-row">

//             <div className="relative">

//               <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl md:h-40 md:w-40">

//                 <img
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiynmP4b2gZmpkYOtAMDA6Ydq1kZnmowbu7bhMy5S6SOu0KEjD7pVXXBilfNjvyCPuW0MKXmyr4HIeJD1covT42RozFAAS6Gb-b8tKkLbuCHIQZynxvYjjVTq60ioSjKIarLgbzFEvlkImj6JAF9Be_1vOt3rgnsom-WkJkOFJhPB6zMB-1qhuLbxhK2A_c0KLe9f_CzbNiRKxa5NXnfhTdLQRUK13rl-gp49l6lEfulW9BO7vN8s9lPA"
//                   alt="Profile"
//                   className="h-full w-full object-cover"
//                 />

//               </div>

//               <button
//                 onClick={handleEditProfile}
//                 className="absolute bottom-1 right-1 rounded-full bg-[#674bb5] p-2 text-white shadow-lg hover:scale-105 transition"
//                 title="Edit profile"
//               >
//                 ✎
//               </button>

//             </div>

//             <div className="text-center md:text-left">

//               <h2 className="mb-2 text-3xl font-bold">

//                 {user?.fullName ||
//                   user?.name ||
//                   "User"}

//               </h2>

//               {/* EMAIL */}

//               <p
//                 className={`mb-3 text-sm ${
//                   darkMode
//                     ? "text-gray-300"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {user?.email ||
//                   "Email not available"}
//               </p>

//               <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">

//                 <span className="rounded-full bg-[#fdd0ea] px-3 py-1 text-sm font-medium text-[#79576c]">
//                   Member
//                 </span>

//                 <span className="flex items-center gap-1 font-medium text-[#674bb5]">

//                   <span
//                     className="material-symbols-outlined text-[16px]"
//                     style={{
//                       fontVariationSettings:
//                         "'FILL' 1",
//                     }}
//                   >
//                     verified
//                   </span>

//                   Verified

//                 </span>

//               </div>

//               <p
//                 className={`mt-3 max-w-md ${
//                   darkMode
//                     ? "text-gray-300"
//                     : "text-[#494552]"
//                 }`}
//               >
//                 "On a journey to find inner peace
//                 and mental clarity through guided
//                 tranquility."
//               </p>

//             </div>

//           </section>

//           {/* ==========================================
//               GRID
//           ========================================== */}

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-12">

//             {/* ==========================================
//                 SETTINGS
//             ========================================== */}

//             <div className="flex flex-col gap-4 md:col-span-8">

//               <div
//                 className={`rounded-xl border p-4 shadow-sm backdrop-blur-xl md:p-6 ${
//                   darkMode
//                     ? "border-white/10 bg-[#27313f]/80"
//                     : "border-white/30 bg-white/70"
//                 }`}
//               >

//                 <h3 className="mb-4 px-4 text-xl font-semibold text-[#674bb5]">
//                   Account Settings
//                 </h3>

//                 {/* ======================================
//                     EDIT PROFILE
//                 ====================================== */}

//                 <button
//                   onClick={handleEditProfile}
//                   className="group flex w-full items-center justify-between rounded-xl p-4 text-left transition hover:bg-[#a78bfa]/10"
//                 >

//                   <div className="flex items-center gap-4">

//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

//                       <span className="material-symbols-outlined">
//                         person
//                       </span>

//                     </div>

//                     <div>

//                       <p className="font-medium">
//                         Edit Profile
//                       </p>

//                       <p className="text-xs text-[#494552]">
//                         Update your personal information
//                       </p>

//                     </div>

//                   </div>

//                   <span className="text-xl text-gray-400">
//                     ›
//                   </span>

//                 </button>

//                 {/* ======================================
//                     NOTIFICATION
//                 ====================================== */}

//                 <button
//                   onClick={() =>
//                     alert(
//                       "Notification settings will be connected later."
//                     )
//                   }
//                   className="group flex w-full items-center justify-between rounded-xl p-4 text-left transition hover:bg-[#a78bfa]/10"
//                 >

//                   <div className="flex items-center gap-4">

//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

//                       <span className="material-symbols-outlined">
//                         notifications
//                       </span>

//                     </div>

//                     <div>

//                       <p className="font-medium">
//                         Notification Settings
//                       </p>

//                       <p className="text-xs text-[#494552]">
//                         Manage your alerts and reminders
//                       </p>

//                     </div>

//                   </div>

//                   <span className="text-xl text-gray-400">
//                     ›
//                   </span>

//                 </button>

//                 {/* ======================================
//                     PRIVACY
//                 ====================================== */}

//                 <button
//                   onClick={() =>
//                     alert(
//                       "Privacy controls will be connected later."
//                     )
//                   }
//                   className="group flex w-full items-center justify-between rounded-xl p-4 text-left transition hover:bg-[#a78bfa]/10"
//                 >

//                   <div className="flex items-center gap-4">

//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

//                       <span className="material-symbols-outlined">
//                         lock
//                       </span>

//                     </div>

//                     <div>

//                       <p className="font-medium">
//                         Privacy
//                       </p>

//                       <p className="text-xs text-[#494552]">
//                         Control your data and visibility
//                       </p>

//                     </div>

//                   </div>

//                   <span className="text-xl text-gray-400">
//                     ›
//                   </span>

//                 </button>

//                 {/* ======================================
//                     THEME
//                 ====================================== */}

//                 <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl p-4">

//                   <div className="flex items-center gap-4">

//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

//                       <span className="material-symbols-outlined">
//                         palette
//                       </span>

//                     </div>

//                     <div>

//                       <p className="font-medium">
//                         Theme
//                       </p>

//                       <p className="text-xs text-[#494552]">
//                         Switch between Light and Dark mode
//                       </p>

//                     </div>

//                   </div>

//                   <div className="flex rounded-full bg-[#e6eeff] p-1">

//                     <button
//                       onClick={() =>
//                         setDarkMode(false)
//                       }
//                       className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                         !darkMode
//                           ? "bg-[#674bb5] text-white"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       Light
//                     </button>

//                     <button
//                       onClick={() =>
//                         setDarkMode(true)
//                       }
//                       className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                         darkMode
//                           ? "bg-[#674bb5] text-white"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       Dark
//                     </button>

//                   </div>

//                 </div>

//                 {/* ======================================
//                     LANGUAGE
//                 ====================================== */}

//                 <button
//                   onClick={() =>
//                     alert(
//                       "Language settings will be connected later."
//                     )
//                   }
//                   className="flex w-full items-center justify-between rounded-xl p-4 text-left hover:bg-[#a78bfa]/10"
//                 >

//                   <div className="flex items-center gap-4">

//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

//                       <span className="material-symbols-outlined">
//                         language
//                       </span>

//                     </div>

//                     <div>

//                       <p className="font-medium">
//                         Language
//                       </p>

//                       <p className="text-xs text-[#494552]">
//                         English (US)
//                       </p>

//                     </div>

//                   </div>

//                   <span className="text-xl text-gray-400">
//                     ›
//                   </span>

//                 </button>

//                 {/* ======================================
//                     HELP
//                 ====================================== */}

//                 <button
//                   onClick={() =>
//                     alert(
//                       "Help & Support will be connected later."
//                     )
//                   }
//                   className="flex w-full items-center justify-between rounded-xl p-4 text-left hover:bg-[#a78bfa]/10"
//                 >

//                   <div className="flex items-center gap-4">

//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

//                       <span className="material-symbols-outlined">
//                         help
//                       </span>

//                     </div>

//                     <div>

//                       <p className="font-medium">
//                         Help & Support
//                       </p>

//                       <p className="text-xs text-[#494552]">
//                         FAQs, Contact us, and Feedback
//                       </p>

//                     </div>

//                   </div>

//                   <span className="material-symbols-outlined text-[20px] text-gray-400">
//                     chevron_right
//                   </span>

//                 </button>

//               </div>

//               {/* ==========================================
//                   LOGOUT
//               ========================================== */}

//               <button
//                 onClick={handleLogout}
//                 className="flex w-fit items-center gap-2 rounded-full border border-red-300 px-8 py-3 font-medium text-red-600 transition hover:bg-red-50"
//               >

//                 <span className="material-symbols-outlined text-[20px]">
//                   logout
//                 </span>

//                 Logout

//               </button>

//             </div>

//             {/* ==========================================
//                 RIGHT SIDE
//             ========================================== */}

//             <div className="flex flex-col gap-4 md:col-span-4">

//               {/* PROGRESS */}

//               <div
//                 className={`rounded-xl border p-6 shadow-sm ${
//                   darkMode
//                     ? "border-white/10 bg-[#27313f]/80"
//                     : "border-white/30 bg-white/70"
//                 }`}
//               >

//                 <h3 className="mb-5 text-xl font-semibold">
//                   Your Progress
//                 </h3>

//                 <div className="mb-6">

//                   <div className="mb-2 flex justify-between">

//                     <span className="text-sm text-gray-500">
//                       Wellness Streak
//                     </span>

//                     <span className="text-sm font-bold text-[#674bb5]">
//                       {wellnessStreak} Day
// {wellnessStreak !== 1 ? "s" : ""}
//                     </span>

//                   </div>

//                   <div className="h-2 w-full overflow-hidden rounded-full bg-[#dee9fc]">

//                     <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-[#396477] to-[#674bb5]" />

//                   </div>

//                 </div>

//                 <div className="grid grid-cols-2 gap-4">

//                   <div className="rounded-xl border border-white/40 bg-white/50 p-3">

//                     <p className="text-[10px] uppercase tracking-wider text-gray-500">
//                       Sessions
//                     </p>

//                     <p className="text-xl font-bold">
//                       {totalSessions}
//                     </p>

//                   </div>

//                   <div className="rounded-xl border border-white/40 bg-white/50 p-3">

//                     <p className="text-[10px] uppercase tracking-wider text-gray-500">
//                       Minutes
//                     </p>

//                     <p className="text-xl font-bold">
//                       {totalExerciseMinutes}
//                     </p>

//                   </div>

//                 </div>

//               </div>

//               {/* MEMBERSHIP */}

//               <div
//                 className={`rounded-xl border p-6 shadow-sm ${
//                   darkMode
//                     ? "border-white/10 bg-[#27313f]/80"
//                     : "border-white/30 bg-white/70"
//                 }`}
//               >

//                 <h3 className="mb-2 text-xl font-semibold">
//                   Membership
//                 </h3>

//                 <p className="mb-4 text-sm text-gray-500">
//                   Standard member account
//                 </p>

//                 <button
//                   onClick={() =>
//                     alert(
//                       "Membership management will be connected later."
//                     )
//                   }
//                   className="w-full rounded-full bg-[#674bb5] py-2 font-medium text-white transition hover:shadow-lg"
//                 >
//                   Manage Plan
//                 </button>

//               </div>

//               {/* IMAGE */}

//               <div className="aspect-video overflow-hidden rounded-xl shadow-lg">

//                 <img
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGLTgoEXOCF6HH_JiV6tK9WOVzkQaJ4qYuFKhMZIP9ZGZV9USte38XfbJ7pd1BC8v9H82pzL3tlFz9q_8V-fDmYKy14t-p7McxtbosWZzSx292-AJK3pNBmBIf0lLp3nmarqzIw1l-DcKSflGQ4CZ5ZBrzD_KGlKCAY2NoRbbstY0UPnGIlaxZyHfpc0-uWHWSPcVgU7R2j1MLx-uH12PAX76lsuqqKn_hc48xDhC1e_2YC-fFABv7kA"
//                   alt="Peaceful lake"
//                   className="h-full w-full object-cover"
//                 />

//               </div>

//             </div>

//           </div>

//         </main>

//         {/* ==========================================
//             EDIT PROFILE MODAL
//         ========================================== */}

//         {showEditProfile && (

//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

//             <div
//               className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
//                 darkMode
//                   ? "bg-[#27313f] text-white"
//                   : "bg-white text-gray-800"
//               }`}
//             >

//               <div className="flex items-center justify-between mb-6">

//                 <h3 className="text-2xl font-semibold text-[#674bb5]">
//                   Edit Profile
//                 </h3>

//                 <button
//                   onClick={() =>
//                     setShowEditProfile(false)
//                   }
//                   className="text-2xl text-gray-400 hover:text-gray-700"
//                 >
//                   ×
//                 </button>

//               </div>

//               <label className="block mb-2 font-medium">
//                 Full Name
//               </label>

//               <input
//                 type="text"
//                 value={editName}
//                 onChange={(e) =>
//                   setEditName(e.target.value)
//                 }
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#674bb5]"
//                 placeholder="Enter your full name"
//               />

//               <div className="mt-3 text-sm text-gray-500">

//                 Email:{" "}

//                 {user?.email ||
//                   "Not available"}

//               </div>

//               <div className="mt-6 flex gap-3">

//                 <button
//                   onClick={() =>
//                     setShowEditProfile(false)
//                   }
//                   className="flex-1 rounded-full border border-gray-300 py-3 font-medium"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={handleSaveProfile}
//                   className="flex-1 rounded-full bg-[#674bb5] py-3 font-medium text-white"
//                 >
//                   Save
//                 </button>

//               </div>

//             </div>

//           </div>

//         )}

//       </div>

//     </Layout>
//   );
// }

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import {
  getMyProfile,
  updateProfileImage,
  updateProfile,
} from "../api/profileApi";

import { getMoods } from "../api/moodApi";

import { getCompletedExercises } from "../api/exerciseApi";

import defaultProfile from "../assets/default-profile.webp";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";


export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { darkMode, setDarkMode } = useTheme();

  // ========================================
  // USER
  // ========================================

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ========================================
  // PROFILE IMAGE
  // ========================================

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const fileInputRef = useRef(null);

  // ========================================
  // THEME
  // ========================================
  // Theme state is now managed globally via useTheme()

  // ========================================
  // MODALS STATE
  // ========================================

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showMembershipSettings, setShowMembershipSettings] = useState(false);

  // ========================================
  // FORM EDIT STATES
  // ========================================

  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState("Male");
  const [editLanguage, setEditLanguage] = useState("English");
  const [editBio, setEditBio] = useState("");

  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [exerciseAlerts, setExerciseAlerts] = useState(true);

  const [shareProgressReport, setShareProgressReport] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [anonymousData, setAnonymousData] = useState(true);

  // ========================================
  // SYNC STATES WITH USER DATA
  // ========================================

  useEffect(() => {
    if (user) {
      setEditName(user.fullName || "");
      setEditAge(user.age || "");
      setEditGender(user.gender || "Male");
      setEditLanguage(user.language || "English");
      setEditBio(user.bio || "");

      setDailyReminder(user.notifications?.dailyReminder ?? true);
      setWeeklyReport(user.notifications?.weeklyReport ?? false);
      setExerciseAlerts(user.notifications?.exerciseAlerts ?? true);

      setShareProgressReport(user.privacy?.shareProgressReport ?? user.privacy?.shareWithTherapist ?? true);
      setPublicProfile(user.privacy?.publicProfile ?? false);
      setAnonymousData(user.privacy?.anonymousData ?? true);
    }
  }, [user]);

  // ========================================
  // PROGRESS DATA
  // ========================================

  const [reflections, setReflections] =
    useState([]);

  const [completedExercises, setCompletedExercises] =
    useState([]);


  // ========================================
  // LOAD PROFILE
  // ========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const response =
          await getMyProfile();

        console.log(
          "Profile:",
          response
        );

        const profile =
          response?.user || response;

        setUser(profile);

        // Keep local user data updated
        localStorage.setItem(
          "user",
          JSON.stringify(profile)
        );

      } catch (error) {
        console.error(
          "Profile error:",
          error
        );

        // If token is invalid,
        // send user back to login
        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
        }

      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);


  // ========================================
  // LOAD PROGRESS
  // ========================================

  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Load moods from backend
        const moodResponse =
          await getMoods();

        console.log(
          "Profile moods:",
          moodResponse
        );

        setReflections(
          moodResponse?.data || []
        );

      } catch (error) {
        console.error(
          "Profile mood loading error:",
          error
        );

        setReflections([]);
      }


      // Exercises
      try {
        const exerciseResponse =
          await getCompletedExercises();

        console.log(
          "Profile exercises:",
          exerciseResponse
        );

        if (
          Array.isArray(exerciseResponse)
        ) {
          setCompletedExercises(
            exerciseResponse
          );
        } else {
          setCompletedExercises(
            exerciseResponse?.data || []
          );
        }

      } catch (error) {
        console.error(
          "Profile exercise loading error:",
          error
        );

        // Fallback to local storage
        const storedExercises =
          JSON.parse(
            localStorage.getItem(
              "completedExercises"
            )
          ) || [];

        setCompletedExercises(
          storedExercises
        );
      }
    };

    loadProgress();
  }, []);


  // ========================================
  // CURRENT STREAK
  // ========================================

  const currentStreak = useMemo(() => {
    if (!reflections.length) {
      return 0;
    }

    const uniqueDates = [
      ...new Set(
        reflections.map((item) => {
          const date = new Date(
            item.createdAt ||
            item.date
          );

          return date.toDateString();
        })
      ),
    ];

    const sortedDates =
      uniqueDates
        .map(
          (date) =>
            new Date(date)
        )
        .sort(
          (a, b) => b - a
        );

    if (!sortedDates.length) {
      return 0;
    }

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const latestDate =
      new Date(
        sortedDates[0]
      );

    latestDate.setHours(
      0,
      0,
      0,
      0
    );

    const daysFromToday =
      Math.floor(
        (today - latestDate) /
          (1000 * 60 * 60 * 24)
      );

    // If latest activity is
    // older than yesterday
    if (daysFromToday > 1) {
      return 0;
    }

    let streak = 1;

    for (
      let i = 0;
      i < sortedDates.length - 1;
      i++
    ) {
      const current =
        new Date(
          sortedDates[i]
        );

      const previous =
        new Date(
          sortedDates[i + 1]
        );

      current.setHours(
        0,
        0,
        0,
        0
      );

      previous.setHours(
        0,
        0,
        0,
        0
      );

      const difference =
        Math.floor(
          (current - previous) /
            (1000 * 60 * 60 * 24)
        );

      if (difference === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [reflections]);


  // ========================================
  // TOTAL SESSIONS
  // ========================================

  const totalSessions =
    reflections.length +
    completedExercises.length;


  // ========================================
  // TOTAL MINUTES
  // ========================================

  const totalMinutes =
    useMemo(() => {
      let minutes = 0;

      completedExercises.forEach(
        (exercise) => {
          const duration =
            Number(
              exercise.duration ||
              exercise.minutes ||
              0
            );

          minutes += duration;
        }
      );

      // If exercises don't have
      // duration information,
      // give each completed exercise
      // a small default value.
      if (
        minutes === 0 &&
        completedExercises.length > 0
      ) {
        minutes =
          completedExercises.length * 5;
      }

      return minutes;
    }, [completedExercises]);


  // ========================================
  // WELLNESS PROGRESS
  // ========================================

  const wellnessProgress =
    useMemo(() => {
      /*
        30 consecutive days = 100%

        This makes the profile
        progress bar actually respond
        to the user's activity.
      */

      if (currentStreak <= 0) {
        return 0;
      }

      return Math.min(
        Math.round(
          (currentStreak / 30) *
            100
        ),
        100
      );
    }, [currentStreak]);


  // ========================================
  // PROFILE IMAGE
  // ========================================

  const profileImage =
    user?.profileImage ||
    defaultProfile;


  // ========================================
  // OPEN FILE SELECTOR
  // ========================================

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };


  // ========================================
  // PROFILE IMAGE CHANGE
  // ========================================

  const handleProfileImageChange =
    async (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      // Check file type
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        alert(
          "Please select an image file."
        );

        return;
      }


      // Limit file size
      if (
        file.size >
        5 * 1024 * 1024
      ) {
        alert(
          "Please select an image smaller than 5 MB."
        );

        return;
      }


      try {
        setUploadingImage(true);


        const reader =
          new FileReader();


        reader.onload = async () => {
          const image =
            new Image();


          image.onload =
            async () => {
              try {
                // ==================================
                // RESIZE IMAGE
                // ==================================

                const canvas =
                  document.createElement(
                    "canvas"
                  );

                const MAX_SIZE =
                  500;

                let width =
                  image.width;

                let height =
                  image.height;


                if (
                  width > height
                ) {
                  if (
                    width >
                    MAX_SIZE
                  ) {
                    height =
                      (height /
                        width) *
                      MAX_SIZE;

                    width =
                      MAX_SIZE;
                  }
                } else {
                  if (
                    height >
                    MAX_SIZE
                  ) {
                    width =
                      (width /
                        height) *
                      MAX_SIZE;

                    height =
                      MAX_SIZE;
                  }
                }


                canvas.width =
                  width;

                canvas.height =
                  height;


                const context =
                  canvas.getContext(
                    "2d"
                  );


                context.drawImage(
                  image,
                  0,
                  0,
                  width,
                  height
                );


                // Convert to Base64
                const compressedImage =
                  canvas.toDataURL(
                    "image/jpeg",
                    0.8
                  );


                console.log(
                  "Uploading profile image..."
                );


                // ==================================
                // SEND TO BACKEND
                // ==================================

                const response =
                  await updateProfileImage(
                    compressedImage
                  );


                console.log(
                  "Profile image updated:",
                  response
                );


                const updatedUser =
                  response?.user;


                if (updatedUser) {
                  setUser(
                    updatedUser
                  );


                  localStorage.setItem(
                    "user",
                    JSON.stringify(
                      updatedUser
                    )
                  );

                  window.dispatchEvent(
                    new CustomEvent("profileUpdated", {
                      detail: { user: updatedUser, profileImage: updatedUser.profileImage }
                    })
                  );
                }


                alert(
                  "Profile picture updated successfully!"
                );

              } catch (error) {
                console.error(
                  "Profile image upload error:",
                  error
                );

                alert(
                  error.response?.data
                    ?.message ||
                    "Failed to update profile picture."
                );

              } finally {
                setUploadingImage(
                  false
                );
              }
            };


          image.onerror = () => {
            setUploadingImage(
              false
            );

            alert(
              "Unable to read the selected image."
            );
          };


          image.src =
            reader.result;
        };


        reader.onerror = () => {
          setUploadingImage(
            false
          );

          alert(
            "Unable to read the selected file."
          );
        };


        reader.readAsDataURL(file);

      } catch (error) {
        console.error(
          "Image selection error:",
          error
        );

        setUploadingImage(
          false
        );
      }


      // Allow selecting the
      // same image again
      event.target.value = "";
    };


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmLogout) {
      return;
    }


    // Remove authentication data
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );


    // Remove other optional
    // authentication storage
    sessionStorage.removeItem(
      "token"
    );

    sessionStorage.removeItem(
      "user"
    );


    console.log(
      "User logged out"
    );


    navigate("/login", {
      replace: true
    });
  };


  // ========================================
  // SAVE PROFILE
  // ========================================

  const handleSaveProfile = async () => {
    const trimmedName = editName.trim();
    if (!trimmedName) {
      alert("Please enter your name.");
      return;
    }

    try {
      const response = await updateProfile({
        fullName: trimmedName,
        age: editAge ? Number(editAge) : undefined,
        gender: editGender,
        language: editLanguage,
        bio: editBio,
      });

      if (response?.success) {
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: { user: updatedUser, profileImage: updatedUser.profileImage },
          })
        );

        setShowEditProfile(false);
        alert("Profile details updated successfully!");
      }
    } catch (error) {
      console.error("Save profile error:", error);
      alert(error.response?.data?.message || "Failed to update profile settings.");
    }
  };

  // ========================================
  // SAVE NOTIFICATIONS
  // ========================================

  const handleSaveNotifications = async (event) => {
    event.preventDefault();
    try {
      const response = await updateProfile({
        notifications: {
          dailyReminder,
          weeklyReport,
          exerciseAlerts,
        },
      });

      if (response?.success) {
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: { user: updatedUser, profileImage: updatedUser.profileImage },
          })
        );

        setShowNotificationSettings(false);
        alert("Notification settings updated successfully!");
      }
    } catch (error) {
      console.error("Save notifications error:", error);
      alert("Failed to update notification settings.");
    }
  };

  // ========================================
  // SAVE PRIVACY
  // ========================================

  const handleSavePrivacy = async (event) => {
    event.preventDefault();
    try {
      const response = await updateProfile({
        privacy: {
          shareProgressReport,
          shareWithTherapist: shareProgressReport,
          publicProfile,
          anonymousData,
        },
      });

      if (response?.success) {
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: { user: updatedUser, profileImage: updatedUser.profileImage },
          })
        );

        setShowPrivacySettings(false);
        alert("Privacy settings updated successfully!");
      }
    } catch (error) {
      console.error("Save privacy error:", error);
      alert("Failed to update privacy settings.");
    }
  };

  // ========================================
  // UPDATE MEMBERSHIP
  // ========================================

  const handleUpdateMembership = async (newPlan) => {
    try {
      const response = await updateProfile({
        membership: newPlan,
      });

      if (response?.success) {
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: { user: updatedUser, profileImage: updatedUser.profileImage },
          })
        );

        setShowMembershipSettings(false);
        alert(`Membership successfully upgraded to ${newPlan}!`);
      }
    } catch (error) {
      console.error("Update membership error:", error);
      alert("Failed to update membership plan.");
    }
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <Layout>
        <main className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">

            <div className="text-5xl mb-4">
              🌿
            </div>

            <p className="text-violet-700 text-lg font-medium">
              Loading your profile...
            </p>

          </div>
        </main>
      </Layout>
    );
  }


  // ========================================
  // MAIN UI
  // ========================================

  return (
    <Layout>

      <div className="min-h-screen flex items-center justify-center">

        <main className="mx-auto max-w-7xl px-4 py-8 pb-32 md:px-10 ">


          {/* ================================= */}
          {/* PROFILE HEADER */}
          {/* ================================= */}

          <section className="mb-12 flex flex-col items-center gap-8 md:flex-row">

            {/* PROFILE IMAGE */}

            <div className="relative">

              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl md:h-40 md:w-40">

                <img
                  src={profileImage}
                  alt={
                    user?.fullName ||
                    "Profile"
                  }
                  className="h-full w-full object-cover"
                />

              </div>


              {/* EDIT IMAGE BUTTON */}

              <button
                type="button"
                onClick={
                  handleChooseImage
                }
                disabled={
                  uploadingImage
                }
                className="absolute bottom-1 right-1 rounded-full bg-[#674bb5] p-2 text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
                title="Change profile picture"
              >

                {uploadingImage
                  ? "..."
                  : "✎"}

              </button>


              {/* HIDDEN FILE INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleProfileImageChange
                }
                className="hidden"
              />

            </div>


            {/* USER DETAILS */}

            <div className="text-center md:text-left">

              <h2 className="mb-2 text-3xl font-bold">

                {user?.fullName ||
                  "User"}

              </h2>


              <p className="text-sm text-gray-500 mb-3">
                {user?.email || ""}
              </p>


              <div className="flex items-center justify-center gap-2 md:justify-start">

                <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                  user?.membership === "Premium"
                    ? "bg-[#fdd0ea] text-[#79576c]"
                    : "bg-gray-150 text-gray-600 dark:bg-[#27313f] dark:text-gray-300"
                }`}>
                  {user?.membership === "Premium" ? "Premium" : "Free"} Member
                </span>


                <span className="flex items-center gap-1 font-medium text-[#674bb5]">

                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{
                      fontVariationSettings:
                        "'FILL' 1",
                    }}
                  >
                    verified
                  </span>

                  Verified

                </span>

              </div>


              <p className="mt-3 max-w-md text-[#494552]">
                {user?.bio || "On a journey to find inner peace and mental clarity through guided tranquility."}
              </p>

            </div>

          </section>



          {/* ================================= */}
          {/* MAIN GRID */}
          {/* ================================= */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">


            {/* ================================= */}
            {/* SETTINGS */}
            {/* ================================= */}

            <div className="flex flex-col gap-4 md:col-span-8">

              <div
                className={`rounded-xl border p-4 shadow-sm backdrop-blur-xl md:p-6 ${
                  darkMode
                    ? "border-white/10 bg-[#27313f]/80 text-white"
                    : "border-white/30 bg-white/70"
                }`}
              >

                <h3 className="mb-4 px-4 text-xl font-semibold text-[#674bb5]">
                  {t("account_settings")}
                </h3>


                {/* EDIT PROFILE */}

                <button
                  type="button"
                  onClick={() => setShowEditProfile(true)}
                  className="group flex w-full items-center justify-between rounded-xl p-4 text-left transition hover:bg-[#a78bfa]/10"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

                      <span className="material-symbols-outlined">
                        person
                      </span>

                    </div>


                    <div>

                      <p className="font-medium">
                        {t("edit_profile")}
                      </p>

                      <p className="text-xs text-[#494552]">
                        Update your personal information
                      </p>

                    </div>

                  </div>


                  <span className="text-xl text-gray-400">
                    ›
                  </span>

                </button>



                {/* NOTIFICATIONS */}

                <button
                  type="button"
                  onClick={() => setShowNotificationSettings(true)}
                  className="group flex w-full items-center justify-between rounded-xl p-4 text-left transition hover:bg-[#a78bfa]/10"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

                      <span className="material-symbols-outlined">
                        notifications
                      </span>

                    </div>


                    <div>

                      <p className="font-medium">
                        {t("notifications")}
                      </p>

                      <p className="text-xs text-[#494552]">
                        Manage your alerts and reminders
                      </p>

                    </div>

                  </div>


                  <span className="text-xl text-gray-400">
                    ›
                  </span>

                </button>



                {/* PRIVACY */}

                <button
                  type="button"
                  onClick={() => setShowPrivacySettings(true)}
                  className="group flex w-full items-center justify-between rounded-xl p-4 text-left transition hover:bg-[#a78bfa]/10"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

                      <span className="material-symbols-outlined">
                        lock
                      </span>

                    </div>


                    <div>

                      <p className="font-medium">
                        {t("privacy")}
                      </p>

                      <p className="text-xs text-[#494552]">
                        Control your data and visibility
                      </p>

                    </div>

                  </div>


                  <span className="text-xl text-gray-400">
                    ›
                  </span>

                </button>



                {/* THEME */}

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl p-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

                      <span className="material-symbols-outlined">
                        palette
                      </span>

                    </div>


                    <div>

                      <p className="font-medium">
                        {t("theme")}
                      </p>

                      <p className="text-xs text-[#494552]">
                        Switch between Light and Dark mode
                      </p>

                    </div>

                  </div>


                  <div className="flex rounded-full bg-[#e6eeff] p-1">

                    <button
                      type="button"
                      onClick={() =>
                        setDarkMode(false)
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        !darkMode
                          ? "bg-[#674bb5] text-white"
                          : "text-gray-500"
                      }`}
                    >
                      Light
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        setDarkMode(true)
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        darkMode
                          ? "bg-[#674bb5] text-white"
                          : "text-gray-500"
                      }`}
                    >
                      Dark
                    </button>

                  </div>

                </div>



                {/* LANGUAGE */}

                <button
                  type="button"
                  onClick={() => setShowEditProfile(true)}
                  className="flex w-full items-center justify-between rounded-xl p-4 text-left hover:bg-[#a78bfa]/10"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

                      <span className="material-symbols-outlined">
                        language
                      </span>

                    </div>


                    <div>

                      <p className="font-medium">
                        {t("language")}
                      </p>

                      <p className="text-xs text-[#494552]">
                        {user?.language ||
                          "English"}
                      </p>

                    </div>

                  </div>


                  <span className="text-xl text-gray-400">
                    ›
                  </span>

                </button>



                {/* HELP */}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/contact")
                  }
                  className="flex w-full items-center justify-between rounded-xl p-4 text-left hover:bg-[#a78bfa]/10"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#674bb5]/10 text-[#674bb5]">

                      <span className="material-symbols-outlined">
                        help
                      </span>

                    </div>


                    <div>

                      <p className="font-medium">
                        {t("help")}
                      </p>

                      <p className="text-xs text-[#494552]">
                        FAQs, Contact us, and Feedback
                      </p>

                    </div>

                  </div>


                  <span className="material-symbols-outlined text-[20px] text-gray-400">
                    chevron_right
                  </span>

                </button>

              </div>



              {/* ================================= */}
              {/* LOGOUT */}
              {/* ================================= */}

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="flex w-fit items-center gap-2 rounded-full border border-red-300 px-8 py-3 font-medium text-red-600 transition hover:bg-red-50"
              >

                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>

                {t("logout")}

              </button>

            </div>



            {/* ================================= */}
            {/* RIGHT SIDE */}
            {/* ================================= */}

            <div className="flex flex-col gap-4 md:col-span-4">


              {/* ================================= */}
              {/* PROGRESS */}
              {/* ================================= */}

              <div
                className={`rounded-xl border p-6 shadow-sm ${
                  darkMode
                    ? "border-white/10 bg-[#27313f]/80 text-white"
                    : "border-white/30 bg-white/70"
                }`}
              >

                <h3 className="mb-5 text-xl font-semibold">
                  Your Progress
                </h3>


                {/* WELLNESS STREAK */}

                <div className="mb-6">

                  <div className="mb-2 flex justify-between">

                    <span className="text-sm text-gray-500">
                      Wellness Streak
                    </span>


                    <span className="text-sm font-bold text-[#674bb5]">
                      {currentStreak}{" "}
                      {currentStreak === 1
                        ? "Day"
                        : "Days"}
                    </span>

                  </div>


                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#dee9fc]">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#396477] to-[#674bb5] transition-all duration-700"
                      style={{
                        width: `${wellnessProgress}%`,
                      }}
                    />

                  </div>


                  <p className="mt-2 text-xs text-gray-400">
                    {wellnessProgress}% wellness goal
                  </p>

                </div>



                {/* SESSIONS + MINUTES */}

                <div className="grid grid-cols-2 gap-4">

                  <div className="rounded-xl border border-white/40 bg-white/50 p-3">

                    <p className="text-[10px] uppercase tracking-wider text-gray-500">
                      Sessions
                    </p>


                    <p className="text-xl font-bold">
                      {totalSessions}
                    </p>

                  </div>


                  <div className="rounded-xl border border-white/40 bg-white/50 p-3">

                    <p className="text-[10px] uppercase tracking-wider text-gray-500">
                      Minutes
                    </p>


                    <p className="text-xl font-bold">
                      {totalMinutes}
                    </p>

                  </div>

                </div>

              </div>



              {/* ================================= */}
              {/* MEMBERSHIP */}
              {/* ================================= */}

              <div
                className={`rounded-xl border p-6 shadow-sm ${
                  darkMode
                    ? "border-white/10 bg-[#27313f]/80 text-white"
                    : "border-white/30 bg-white/70"
                }`}
              >

                <h3 className="mb-2 text-xl font-semibold">
                  Membership
                </h3>


                <p className="mb-4 text-sm text-gray-500">
                  {user?.membership === "Premium" ? "Premium plan active" : "Standard free account"}
                </p>


                <button
                  type="button"
                  onClick={() => setShowMembershipSettings(true)}
                  className="w-full rounded-full bg-[#674bb5] py-2 font-medium text-white transition hover:shadow-lg"
                >
                  Manage Plan
                </button>

              </div>



              {/* ================================= */}
              {/* PEACEFUL IMAGE */}
              {/* ================================= */}

              <div className="aspect-video overflow-hidden rounded-xl shadow-lg">

                <img
                  src=" https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=pexels-pixabay-206359.jpg&fm=jpg "
                  alt="Peaceful lake"
                  className="h-full w-full object-cover"
                />

              </div>

            </div>

          </div>

        </main>

        {/* ==========================================
            EDIT PROFILE MODAL
        ========================================== */}
        {showEditProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm transition-opacity duration-300">
            <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all duration-300 transform scale-100 ${
              darkMode ? "bg-[#1e2530] text-white border border-gray-700" : "bg-white text-gray-800"
            }`}>
              <div className="flex items-center justify-between mb-6 border-b pb-3 border-gray-200/50">
                <h3 className="text-2xl font-bold text-[#674bb5]">Edit Profile</h3>
                <button onClick={() => setShowEditProfile(false)} className="text-2xl text-gray-400 hover:text-gray-600 transition">&times;</button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#674bb5] transition ${
                      darkMode ? "bg-[#27313f] border-gray-600 text-white" : "border-gray-300"
                    }`}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold">Age</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#674bb5] transition ${
                      darkMode ? "bg-[#27313f] border-gray-600 text-white" : "border-gray-300"
                    }`}
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold">Gender</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#674bb5] transition ${
                      darkMode ? "bg-[#27313f] border-gray-600 text-white" : "border-gray-300"
                    }`}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold">Language</label>
                  <select
                    value={editLanguage}
                    onChange={(e) => setEditLanguage(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#674bb5] transition ${
                      darkMode ? "bg-[#27313f] border-gray-600 text-white" : "border-gray-300"
                    }`}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className={`w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#674bb5] transition ${
                      darkMode ? "bg-[#27313f] border-gray-600 text-white" : "border-gray-300"
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className={`flex-1 rounded-full border py-3 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                    darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="flex-1 rounded-full bg-gradient-to-r from-[#674bb5] to-[#8b5cf6] py-3 font-semibold text-white shadow-lg shadow-violet-500/25 hover:opacity-90 active:scale-95 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            NOTIFICATION SETTINGS MODAL
        ========================================== */}
        {showNotificationSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
            <form onSubmit={handleSaveNotifications} className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
              darkMode ? "bg-[#1e2530] text-white border border-gray-700" : "bg-white text-gray-800"
            }`}>
              <div className="flex items-center justify-between mb-6 border-b pb-3 border-gray-200/50">
                <h3 className="text-2xl font-bold text-[#674bb5]">Notification Settings</h3>
                <button type="button" onClick={() => setShowNotificationSettings(false)} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-semibold block">Daily Reflections</label>
                    <span className="text-xs text-gray-400">Receive reminders to log your daily mood</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyReminder}
                    onChange={(e) => setDailyReminder(e.target.checked)}
                    className="w-5 h-5 accent-[#674bb5] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-semibold block">Weekly Reports</label>
                    <span className="text-xs text-gray-400">Receive weekly wellness progress summary</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyReport}
                    onChange={(e) => setWeeklyReport(e.target.checked)}
                    className="w-5 h-5 accent-[#674bb5] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-semibold block">Exercise Alerts</label>
                    <span className="text-xs text-gray-400">Get reminders for completed exercises & streaks</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={exerciseAlerts}
                    onChange={(e) => setExerciseAlerts(e.target.checked)}
                    className="w-5 h-5 accent-[#674bb5] cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNotificationSettings(false)}
                  className={`flex-1 rounded-full border py-3 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                    darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-gradient-to-r from-[#674bb5] to-[#8b5cf6] py-3 font-semibold text-white shadow-lg shadow-violet-500/25 hover:opacity-90 active:scale-95 transition"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            PRIVACY SETTINGS MODAL
        ========================================== */}
        {showPrivacySettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
            <form onSubmit={handleSavePrivacy} className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
              darkMode ? "bg-[#1e2530] text-white border border-gray-700" : "bg-white text-gray-800"
            }`}>
              <div className="flex items-center justify-between mb-6 border-b pb-3 border-gray-200/50">
                <h3 className="text-2xl font-bold text-[#674bb5]">Privacy Controls</h3>
                <button type="button" onClick={() => setShowPrivacySettings(false)} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-semibold block">Share Progress</label>
                    <span className="text-xs text-gray-400">Allow exporting mood charts and progress reports</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareProgressReport}
                    onChange={(e) => setShareProgressReport(e.target.checked)}
                    className="w-5 h-5 accent-[#674bb5] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-semibold block">Public Profile</label>
                    <span className="text-xs text-gray-400">Make your profile details visible to community</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicProfile}
                    onChange={(e) => setPublicProfile(e.target.checked)}
                    className="w-5 h-5 accent-[#674bb5] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-semibold block">Anonymous Analytics</label>
                    <span className="text-xs text-gray-400">Contribute anonymous wellness data for research</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={anonymousData}
                    onChange={(e) => setAnonymousData(e.target.checked)}
                    className="w-5 h-5 accent-[#674bb5] cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPrivacySettings(false)}
                  className={`flex-1 rounded-full border py-3 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                    darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-gradient-to-r from-[#674bb5] to-[#8b5cf6] py-3 font-semibold text-white shadow-lg shadow-violet-500/25 hover:opacity-90 active:scale-95 transition"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            MEMBERSHIP MODAL
        ========================================== */}
        {showMembershipSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
            <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl ${
              darkMode ? "bg-[#1e2530] text-white border border-gray-700" : "bg-white text-gray-800"
            }`}>
              <div className="flex items-center justify-between mb-6 border-b pb-3 border-gray-200/50">
                <h3 className="text-2xl font-bold text-[#674bb5]">Manage Membership</h3>
                <button onClick={() => setShowMembershipSettings(false)} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
              </div>

              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                You are currently on the <strong className="text-violet-600 dark:text-violet-400 uppercase">{user?.membership || "Free"}</strong> Plan. Upgrading unlocks deep AI insights, unlimited audio soundscapes, and comprehensive wellness analytics.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Free Plan */}
                <div className={`rounded-xl border p-4 flex flex-col justify-between transition ${
                  user?.membership !== "Premium" ? "border-violet-500 bg-violet-50/10 shadow-sm" : "border-gray-200 dark:border-gray-700"
                }`}>
                  <div>
                    <h4 className="font-bold text-lg">Free Plan</h4>
                    <p className="text-2xl font-extrabold mt-1">$0 <span className="text-sm font-normal text-gray-400">/ forever</span></p>
                    <ul className="text-xs text-gray-500 mt-4 space-y-1.5 list-disc pl-4">
                      <li>Log daily mood reflections</li>
                      <li>Basic meditation exercises</li>
                      <li>Local wellness tracking</li>
                    </ul>
                  </div>
                  {user?.membership !== "Premium" ? (
                    <span className="w-full text-center mt-6 text-xs text-green-600 font-semibold bg-green-50 dark:bg-green-950/20 py-2 rounded-full border border-green-200">Active Plan</span>
                  ) : (
                    <button
                      onClick={() => handleUpdateMembership("Free")}
                      className="w-full mt-6 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 transition"
                    >
                      Downgrade to Free
                    </button>
                  )}
                </div>

                {/* Premium Plan */}
                <div className={`rounded-xl border p-4 flex flex-col justify-between transition relative overflow-hidden ${
                  user?.membership === "Premium" ? "border-violet-500 bg-violet-50/10 shadow-sm" : "border-gray-200 dark:border-gray-700"
                }`}>
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[9px] uppercase tracking-wider font-bold py-1 px-3.5 rounded-bl-lg">Popular</div>
                  <div>
                    <h4 className="font-bold text-lg text-violet-600 dark:text-violet-400">Premium Plan</h4>
                    <p className="text-2xl font-extrabold mt-1">$9.99 <span className="text-sm font-normal text-gray-400">/ month</span></p>
                    <ul className="text-xs text-gray-500 mt-4 space-y-1.5 list-disc pl-4">
                      <li>Unlimited exercise & breathing logs</li>
                      <li>Weekly AI wellness reports</li>
                      <li>Full library of sleep & calm audio</li>
                      <li>Priority customer support</li>
                    </ul>
                  </div>
                  {user?.membership === "Premium" ? (
                    <span className="w-full text-center mt-6 text-xs text-green-600 font-semibold bg-green-50 dark:bg-green-950/20 py-2 rounded-full border border-green-200">Active Plan</span>
                  ) : (
                    <button
                      onClick={() => handleUpdateMembership("Premium")}
                      className="w-full mt-6 bg-gradient-to-r from-[#674bb5] to-[#8b5cf6] py-2 rounded-full text-xs font-semibold text-white shadow hover:opacity-95 transition"
                    >
                      Upgrade to Premium
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowMembershipSettings(false)}
                  className="px-6 py-2 border rounded-full text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </Layout>
  );
}