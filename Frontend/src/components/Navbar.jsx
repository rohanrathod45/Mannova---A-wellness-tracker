// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   useNavigate,
//   useLocation,
// } from "react-router-dom";

// import { getMyProfile } from "../api/profileApi";

// import defaultProfile from "../assets/default-profile.webp";


// export default function Navbar() {

//   const [user, setUser] = useState(() => {
//   const savedUser = localStorage.getItem("user");

//   return savedUser
//     ? JSON.parse(savedUser)
//     : null;
// });

//   const navigate = useNavigate();
//   const location = useLocation();

//   // ========================================
//   // PROFILE IMAGE
//   // ========================================

//   const [profileImage, setProfileImage] =
//     useState("");


//   // ========================================
//   // LOAD PROFILE IMAGE
//   // ========================================

//   useEffect(() => {

//     const loadProfile = async () => {

//       try {

//         // ------------------------------------
//         // STEP 1:
//         // Check localStorage first
//         // ------------------------------------

//         const storedUser =
//           JSON.parse(
//             localStorage.getItem("user")
//           );

//         if (storedUser?.profileImage) {

//           setProfileImage(
//             storedUser.profileImage
//           );

//         } else {

//           // No uploaded image
//           // Use default image
//           setProfileImage("");

//         }


//         // ------------------------------------
//         // STEP 2:
//         // Get latest profile from backend
//         // ------------------------------------

//         const token =
//           localStorage.getItem("token");

//         if (!token) {
//           return;
//         }


//         const response =
//           await getMyProfile();


//         const user =
//           response?.user || response;


//         if (user) {

//           // Update Navbar image
//           setProfileImage(
//             user.profileImage || ""
//           );


//           // Keep localStorage updated
//           localStorage.setItem(
//             "user",
//             JSON.stringify(user)
//           );

//         }

//       } catch (error) {

//         console.error(
//           "Navbar profile loading error:",
//           error
//         );

//         // If image/profile cannot be loaded,
//         // show default profile image
//         setProfileImage("");

//       }

//     };


//     loadProfile();

//   }, []);


//   // ========================================
//   // LISTEN FOR PROFILE IMAGE UPDATE
//   // ========================================

//   useEffect(() => {

//     const handleProfileUpdate =
//       (event) => {

//         const newImage =
//           event.detail?.profileImage;


//         if (newImage) {

//           setProfileImage(
//             newImage
//           );

//         } else {

//           // If image is removed/reset
//           setProfileImage("");

//         }

//       };


//     window.addEventListener(
//       "profileUpdated",
//       handleProfileUpdate
//     );


//     // Cleanup listener
//     return () => {

//       window.removeEventListener(
//         "profileUpdated",
//         handleProfileUpdate
//       );

//     };

//   }, []);


//   // ========================================
//   // PROFILE IMAGE ERROR
//   // ========================================

//   const handleImageError = (event) => {

//     event.currentTarget.src =
//       defaultProfile;

//   };


//   // ========================================
//   // NAVIGATION
//   // ========================================

//   return (

//     <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/30">

//       <div className="flex justify-between items-center px-4 md:px-10 h-16 max-w-7xl mx-auto">


//         {/* ==================================
//             LEFT SIDE
//         ================================== */}

//       <div
//   className="
//     w-12 h-12
//     rounded-full
//     border-2 border-purple-500
//     bg-white
//     flex items-center justify-center
//     overflow-hidden
//     cursor-pointer
//   ">
//   <img
//     src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWLI8zjqku6UhnI63o7ZsV7jJnZaws-KDBbC7I2ohqOhsAh02GLTwOeSrZO-_NtYK1br73qPzhhwynk5V4msRbvnP0OPkowa_mOVIat-14VHCymkulA74M44Wa7k_LJoj81caATmuPA0koyo0v5jVHgUvouxFiQvYBDj73ueCZpA7GpoR-Z8J460Mde6U0zfvmm3n9CC5m1D26NlSt3GvkkJf7Ga9-SIrYg4kvQGrVx6l0n9bAqD9NTVcfreb9CEGVC70"
//     alt="Mannova Logo"
//     className="w-full h-full object-contain p-1"
//   />

// </div>


//         {/* ==================================
//             DESKTOP NAVIGATION
//         ================================== */}

//         <nav className="hidden md:flex gap-8 items-center">


//           {/* HOME */}

//           <button
//             onClick={() => navigate("/")}
//             className={`
//               px-5 py-2 rounded-full
//               transition-all duration-300 ease-in-out
//               hover:bg-violet-100
//               hover:text-violet-700
//               hover:scale-105
//               active:scale-95
//               hover:shadow-md
//               ${
//                 location.pathname === "/"
//                   ? "bg-violet-100 text-violet-700 shadow-md font-semibold"
//                   : "text-gray-600"
//               }
//             `}
//           >
//             Home
//           </button>


//           {/* MOOD */}

//           <button
//             onClick={() => navigate("/mood")}
//             className={`
//               px-5 py-2 rounded-full
//               transition-all duration-300 ease-in-out
//               hover:bg-violet-100
//               hover:text-violet-700
//               hover:scale-105
//               active:scale-95
//               hover:shadow-md
//               ${
//                 location.pathname === "/mood"
//                   ? "bg-violet-100 text-violet-700 shadow-md font-semibold"
//                   : "text-gray-600"
//               }
//             `}
//           >
//             Mood
//           </button>


//           {/* EXERCISES */}

//           <button
//             onClick={() => navigate("/exercises")}
//             className={`
//               px-5 py-2 rounded-full
//               transition-all duration-300 ease-in-out
//               hover:bg-violet-100
//               hover:text-violet-700
//               hover:scale-105
//               active:scale-95
//               hover:shadow-md
//               ${
//                 location.pathname === "/exercises"
//                   ? "bg-violet-100 text-violet-700 shadow-md font-semibold"
//                   : "text-gray-600"
//               }
//             `}
//           >
//             Exercises
//           </button>


//           {/* SUPPORT */}

//           <button
//             onClick={() => navigate("/chat")}
//             className={`
//               px-5 py-2 rounded-full
//               transition-all duration-300 ease-in-out
//               hover:bg-violet-100
//               hover:text-violet-700
//               hover:scale-105
//               active:scale-95
//               hover:shadow-md
//               ${
//                 location.pathname === "/chat"
//                   ? "bg-violet-100 text-violet-700 shadow-md font-semibold"
//                   : "text-gray-600"
//               }
//             `}
//           >
//             Support
//           </button>


//           {/* PROGRESS */}

//           <button
//             onClick={() => navigate("/progress")}
//             className={`
//               px-5 py-2 rounded-full
//               transition-all duration-300 ease-in-out
//               hover:bg-violet-100
//               hover:text-violet-700
//               hover:scale-105
//               active:scale-95
//               hover:shadow-md
//               ${
//                 location.pathname === "/progress"
//                   ? "bg-violet-100 text-violet-700 shadow-md font-semibold"
//                   : "text-gray-600"
//               }
//             `}
//           >
//             Progress
//           </button>

//         </nav>


//         {/* ==================================
//             PROFILE IMAGE
//         ================================== */}

//         <button
//           onClick={() => navigate("/profile")}
//           className="rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform"
//           aria-label="Open profile"
//         >
// <div className="flex items-center gap-2">
//   <img
//     src={profileImage || defaultProfile}
//     alt="Profile"
//     onError={handleImageError}
//     className="w-10 h-10 rounded-full border-2 border-purple-500 shadow-sm object-cover cursor-pointer"
//     onClick={() => navigate("/profile")}
//   />

//   <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
//     {user?.fullName || "User"}
//   </span>
// </div>

//         </button>


//       </div>

//     </header>

//   );
// }
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { getMyProfile } from "../api/profileApi";
import defaultProfile from "../assets/default-profile.webp";
import mannovaLogo from "../assets/logo_emblem_transparent.png";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";


export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();

  // ========================================
  // USER DATA
  // ========================================

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();


  // ========================================
  // PROFILE IMAGE
  // ========================================

  const [profileImage, setProfileImage] = useState("");


  // ========================================
  // LOAD PROFILE
  // ========================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        // ------------------------------------
        // STEP 1:
        // Check localStorage first
        // ------------------------------------

        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (storedUser) {

          setUser(storedUser);

          if (storedUser.profileImage) {

            setProfileImage(
              storedUser.profileImage
            );

          } else {

            setProfileImage("");

          }

        }


        // ------------------------------------
        // STEP 2:
        // Get latest profile from backend
        // ------------------------------------

        const token =
          localStorage.getItem("token");

        if (!token) {
          return;
        }


        const response =
          await getMyProfile();


        const latestUser =
          response?.user || response;


        if (latestUser) {

          // Update user information
          setUser(latestUser);


          // Update Navbar image
          setProfileImage(
            latestUser.profileImage || ""
          );


          // Keep localStorage updated
          localStorage.setItem(
            "user",
            JSON.stringify(latestUser)
          );

        }

      } catch (error) {

        console.error(
          "Navbar profile loading error:",
          error
        );

        // If profile cannot be loaded,
        // show default profile image
        setProfileImage("");

      }

    };


    loadProfile();

  }, []);


  // ========================================
  // LISTEN FOR PROFILE UPDATE
  // ========================================

  useEffect(() => {

    const handleProfileUpdate = (event) => {

      const updatedUser =
        event.detail?.user;

      const newImage =
        event.detail?.profileImage;


      // ------------------------------------
      // Update complete user information
      // ------------------------------------

      if (updatedUser) {

        setUser(updatedUser);

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

      }


      // ------------------------------------
      // Update profile image
      // ------------------------------------

      if (newImage) {

        setProfileImage(newImage);

      } else {

        // If image is removed/reset
        setProfileImage("");

      }

    };


    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate
    );


    // Cleanup
    return () => {

      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );

    };

  }, []);


  // ========================================
  // PROFILE IMAGE ERROR
  // ========================================

  const handleImageError = (event) => {

    event.currentTarget.src =
      defaultProfile;

  };


  // ========================================
  // NAVIGATION
  // ========================================

  return (

    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/30">

      <div
        className="
          flex
          justify-between
          items-center
          px-4
          md:px-10
          h-16
          max-w-7xl
          mx-auto
        "
      >

        {/* ==================================
            LOGO
            Desktop → LEFT
            Mobile → RIGHT
        ================================== */}

        <div
          className="
            order-2
            md:order-none

            w-11
            h-11
            sm:w-12
            sm:h-12

            rounded-full
            border-2
            border-purple-500
            dark:border-purple-400

            bg-white
            dark:bg-slate-900

            flex
            items-center
            justify-center

            overflow-hidden
            cursor-pointer
            shadow-sm
            hover:shadow-md
            hover:scale-105
            active:scale-95
            transition-all
            duration-300

            flex-shrink-0
          "
          onClick={() => navigate("/")}
          title="Mannova Home"
        >

          <img
            src={mannovaLogo}
            alt="Mannova Logo"
            className="w-full h-full object-contain p-0.5 select-none drop-shadow-sm"
          />

        </div>


        {/* ==================================
            DESKTOP & TABLET NAVIGATION
        ================================== */}

        <nav className="hidden md:flex gap-1.5 lg:gap-4 xl:gap-6 items-center">


          {/* HOME */}

          <button
            onClick={() => navigate("/")}
            className={`
              px-3.5
              lg:px-5
              py-2
              text-xs
              lg:text-sm
              rounded-full
              transition-all
              duration-300
              ease-in-out

              hover:bg-violet-100
              hover:text-violet-700
              hover:scale-105
              active:scale-95
              hover:shadow-md

              ${
                location.pathname === "/"
                  ? "bg-violet-100 text-violet-700 shadow-md font-semibold"
                  : "text-gray-600"
              }
            `}
          >
            {t("home")}
          </button>


          {/* MOOD */}

          <button
            onClick={() => navigate("/mood")}
            className={`
              px-3.5
              lg:px-5
              py-2
              text-xs
              lg:text-sm
              rounded-full
              transition-all
              duration-300
              ease-in-out

              hover:bg-violet-100
              hover:text-violet-700
              hover:scale-105
              active:scale-95
              hover:shadow-md

              ${
                location.pathname === "/mood"
                  ? "bg-violet-100 text-violet-700 shadow-md font-semibold"
                  : "text-gray-600"
              }
            `}
          >
            {t("mood")}
          </button>


          {/* EXERCISES */}

          <button
            onClick={() => navigate("/exercises")}
            className={`
              px-3.5
              lg:px-5
              py-2
              text-xs
              lg:text-sm
              rounded-full
              transition-all
              duration-300
              ease-in-out

              hover:bg-violet-100
              hover:text-violet-700
              hover:scale-105
              active:scale-95
              hover:shadow-md

              ${
                location.pathname === "/exercises"
                  ? "bg-violet-100 text-violet-700 shadow-md font-semibold"
                  : "text-gray-600"
              }
            `}
          >
            {t("exercises")}
          </button>


          {/* SUPPORT */}

          <button
            onClick={() => navigate("/chat")}
            className={`
              px-3.5
              lg:px-5
              py-2
              text-xs
              lg:text-sm
              rounded-full
              transition-all
              duration-300
              ease-in-out

              hover:bg-violet-100
              hover:text-violet-700
              hover:scale-105
              active:scale-95
              hover:shadow-md

              ${
                location.pathname === "/chat"
                  ? "bg-violet-100 text-violet-700 shadow-md font-semibold"
                  : "text-gray-600"
              }
            `}
          >
            {t("support")}
          </button>


          {/* PROGRESS */}

          <button
            onClick={() => navigate("/progress")}
            className={`
              px-3.5
              lg:px-5
              py-2
              text-xs
              lg:text-sm
              rounded-full
              transition-all
              duration-300
              ease-in-out

              hover:bg-violet-100
              hover:text-violet-700
              hover:scale-105
              active:scale-95
              hover:shadow-md

              ${
                location.pathname === "/progress"
                  ? "bg-violet-100 text-violet-700 shadow-md font-semibold"
                  : "text-gray-600"
              }
            `}
          >
            {t("progress")}
          </button>

        </nav>


        {/* ==================================
            PROFILE & THEME TOGGLE
            Desktop → RIGHT
            Mobile → LEFT
        ================================== */}

        <div className="order-1 md:order-none flex items-center gap-2 sm:gap-3">

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleDarkMode}
            type="button"
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className={`
              w-9 h-9 sm:w-10 sm:h-10
              rounded-full
              flex items-center justify-center
              cursor-pointer
              transition-all duration-300
              hover:scale-105 active:scale-95
              ${
                darkMode
                  ? "bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700/80 shadow-md shadow-amber-500/10"
                  : "bg-violet-100/70 text-violet-700 border border-violet-200/60 hover:bg-violet-100 shadow-sm"
              }
            `}
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* PROFILE */}
          <button
            onClick={() => navigate("/profile")}
            className="
              rounded-full
              cursor-pointer
              hover:scale-105
              active:scale-95
              transition-transform
              flex-shrink-0
            "
            aria-label="Open profile"
          >
            <div className="flex items-center gap-2">
              <img
                src={
                  profileImage ||
                  defaultProfile
                }
                alt="Profile"
                onError={handleImageError}
                className="
                  w-9 h-9 sm:w-10 sm:h-10
                  rounded-full
                  border-2
                  border-purple-500
                  shadow-sm
                  object-cover
                "
              />
              <span
                className="
                  hidden xl:inline
                  text-sm
                  font-semibold
                  text-gray-700
                  dark:text-gray-200
                  whitespace-nowrap
                  max-w-[120px]
                  truncate
                "
              >
                {user?.fullName || ""}
              </span>
            </div>
          </button>

        </div>

      </div>

    </header>

  );

}