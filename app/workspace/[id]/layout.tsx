"use client";
import { ReactNode } from "react";
import Sidebar from "@/app/components/navigation/Sidebar";
import Navbar from "@/app/components/navigation/Navbar";

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800">
      <Navbar />
      <div className="flex flex-1 mt-24">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-900">{children}</main>
      </div>
    </div>
  );
};

export default SidebarLayout;