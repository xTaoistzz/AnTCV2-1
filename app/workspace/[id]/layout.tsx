"use client";
import { ReactNode } from "react";
import Sidebar from "@/app/components/navigation/Sidebar";
import Navbar from "@/app/components/navigation/Navbar";

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <Navbar />
      <div className="flex flex-1 mt-16">
        <Sidebar />
        <main className="flex-1 p-6 bg-white rounded-tl-3xl shadow-xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;