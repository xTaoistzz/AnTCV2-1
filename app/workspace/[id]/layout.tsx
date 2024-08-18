"use client";
import { ReactNode } from "react";
import Sidebar from "@/app/components/navigation/Sidebar";
import Navbar from "@/app/components/navigation/Navbar";
import Tab from "@/app/components/navigation/Tab";

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <Navbar />
      <div className="flex flex-1 mt-16">
        <Sidebar />
        <main className="flex-1 p-6 bg-white rounded-tl-3xl shadow-xl">
          <Tab />
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;