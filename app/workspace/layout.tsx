"use client"
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navigation/Navbar';

const fetchUsername = async () => {
  try {
    const response = await fetch(`${process.env.ORIGIN_URL}/returnUsername`, {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data.username;
    } else {
      throw new Error("Failed to fetch username");
    }
  } catch (error) {
    console.error("An error occurred while fetching the username:", error);
    throw error;
  }
};

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUsername();
      } catch (error) {
        router.push('/sign-in');
      }
    };
    checkAuth();
  }, [router]);

  return  (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow relative">
        {children}
      </main>
    </div>
  );
}