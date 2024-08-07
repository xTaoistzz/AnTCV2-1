"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  // Check if the user is already authenticated when the component mounts
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${process.env.ORIGIN_URL}/returnUsername`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.username) {
            // If username is returned, user is authenticated
            router.push("/workspace");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Handle successful login (e.g., show success modal)
        setErrorMessage(""); // Clear the error message on successful login
        setIsModalVisible(true);
        setTimeout(() => {
          router.push("/workspace");
        }, 2000); // Redirect after 2 seconds
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      console.error("An error occurred:", error);
    }
  };

  return (
    <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen flex flex-col items-center justify-center text-white">
      <nav className="bg-white bg-opacity-10 p-3 flex rounded-lg text-center items-center justify-between fixed top-4 left-0 right-0 mx-4 drop-shadow-2xl border border-gray-700">
        <div className="text-teal-300 font-bold text-xl">AnTCV</div>
        <div>
          <Link href="/">
            <button className="text-white bg-teal-500 p-2 rounded-lg hover:bg-teal-700 transition-all">
              Home
            </button>
          </Link>
        </div>
      </nav>
      <section className="flex flex-col items-center justify-center flex-grow w-full px-4">
        <h1 className="text-4xl font-bold mb-8 animate-pulse-glow">Sign In to AnTCV</h1>
        <form className="bg-white bg-opacity-10 p-8 rounded-lg drop-shadow-2xl border border-gray-700 max-w-md w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-teal-300 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-500"
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-teal-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-500"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errorMessage && <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all">
              Sign In
            </button>
            <Link href="/forgot-password">
              <div className="text-teal-300 hover:text-teal-500 text-sm">Forgot Password?</div>
            </Link>
          </div>
          <div className="flex items-center justify-center mt-4">
            <Link href="/sign-up">
              <button className="bg-transparent border border-teal-500 text-teal-500 py-2 px-4 rounded-lg hover:bg-teal-700 hover:text-white transition-all">
                Don't have an account? Sign Up
              </button>
            </Link>
          </div>
        </form>
      </section>
      <footer className="bg-gray-900 bg-opacity-50 py-4 w-full text-center text-gray-400 border-t border-gray-700">
        © 2024 AnTCV. All rights reserved.
      </footer>
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 space-y-4 shadow-lg text-center">
            <h2 className="text-xl font-semibold text-teal-300">Login Successful!</h2>
            <p className="text-gray-300">You will be redirected shortly...</p>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% {
            text-shadow: 0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #00ffcc, 0 0 40px #00ffcc, 0 0 50px #00ffcc, 0 0 60px #00ffcc, 0 0 70px #00ffcc;
          }
          50% {
            text-shadow: 0 0 20px #00ffcc, 0 0 30px #00ffcc, 0 0 40px #00ffcc, 0 0 50px #00ffcc, 0 0 60px #00ffcc, 0 0 70px #00ffcc, 0 0 80px #00ffcc;
          }
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s infinite;
        }
      `}</style>
    </main>
  );
}