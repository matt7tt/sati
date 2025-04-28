import NavBar from "@/components/home/NavBar";
import VerticalLayout from "@/components/home/ThreeColumnLayout";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background opacity-50" />
      
      {/* Content */}
      <div className="relative z-10">
        <NavBar />
        <VerticalLayout />
      </div>
    </div>
  );
}

