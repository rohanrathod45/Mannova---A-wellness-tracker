import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-20">
        {children}
      </main>

      <BottomNav />
    </>
  );
}