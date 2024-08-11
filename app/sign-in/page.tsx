"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${process.env.ORIGIN_URL}/returnUsername`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.username) {
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
    <main className="bg-gradient-to-r from-blue-50 via-gray-100 to-gray-50 min-h-screen flex flex-col items-center justify-center text-gray-900">
      <nav className="bg-white p-3 flex rounded-lg text-center items-center justify-between fixed top-4 left-0 right-0 mx-4 shadow-lg border border-gray-300">
        <div className="text-blue-600 font-bold text-xl">AnTCV</div>
        <div>
          <Link href="/">
            <button className="text-white bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-all">
              Home
            </button>
          </Link>
        </div>
      </nav>
      <section className="flex flex-col items-center justify-center flex-grow w-full px-4">
        <h1 className="text-4xl font-bold mb-8 animate-pulse-soft">Sign In to AnTCV</h1>
        <form className="bg-white p-8 rounded-lg shadow-lg border border-gray-300 max-w-md w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-blue-600 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-500"
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-blue-600 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-500"
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
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all">
              Sign In
            </button>
            <Link href="/sign-in/forgot">
              <div className="text-blue-600 hover:text-blue-800 text-sm">Forgot Password?</div>
            </Link>
          </div>
          <div className="flex items-center justify-center mt-4">
            <Link href="/sign-up">
              <button className="bg-transparent border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                Don't have an account? Sign Up
              </button>
            </Link>
          </div>
        </form>
      </section>
      <footer className="bg-gray-100 py-4 w-full text-center text-gray-600 border-t border-gray-300">
        © 2024 AnTCV. All rights reserved.
      </footer>
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 space-y-4 shadow-lg text-center">
            <h2 className="text-xl font-semibold text-blue-600">Login Successful!</h2>
            <p className="text-gray-700">You will be redirected shortly...</p>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes pulseSoft {
          0%, 100% {
            text-shadow: 0 0 5px rgba(0, 119, 182, 0.5);
          }
          50% {
            text-shadow: 0 0 10px rgba(0, 119, 182, 0.7);
          }
        }

        .animate-pulse-soft {
          animation: pulseSoft 3s infinite;
        }
      `}</style>
    </main>
  );
}