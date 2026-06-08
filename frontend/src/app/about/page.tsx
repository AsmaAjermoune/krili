import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "À propos — Kreli",
  description:
    "Kreli connecte les professionnels marocains avec le matériel dont ils ont besoin, sans friction.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AboutClient />
      <Footer />
    </div>
  );
}
