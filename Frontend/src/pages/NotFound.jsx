import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <span className="text-7xl sm:text-9xl font-black text-violet-300 dark:text-violet-900/60 mb-4 select-none">
          404
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
          The page you are looking for might have been moved or doesn't exist in our sanctuary.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-lg hover:scale-105 transition cursor-pointer"
        >
          Return Home
        </button>
      </div>
    </Layout>
  );
}