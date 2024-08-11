"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/forgetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (response.ok) {
        setMessage("A link to reset your password has been sent to your email. Please check your inbox.");
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
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
        <h1 className="text-4xl font-bold mb-8 animate-pulse-soft">Forgot Password</h1>
        <form className="bg-white p-8 rounded-lg shadow-lg border border-gray-300 max-w-md w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-blue-600 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-500"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all">
              Send Reset Link
            </button>
          </div>
          {message && <p className="text-blue-600 text-xs italic mt-4">{message}</p>}
        </form>
      </section>
      <footer className="bg-gray-100 py-4 w-full text-center text-gray-600 border-t border-gray-300">
        © 2024 AnTCV. All rights reserved.
      </footer>
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
