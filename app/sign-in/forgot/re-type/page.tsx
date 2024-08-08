"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReTypePassword() {
  const [formData, setFormData] = useState({ password: "", conPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { password, conPassword } = formData;

    // if (password !== conPassword) {
    //   setErrorMessage("Passwords do not match.");
    //   return;
    // }

    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/newPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password, conPassword }),
      });

      if (response.ok) {
        setSuccessMessage("Your password has been reset successfully.");
        setErrorMessage(""); // Clear error message
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000); // Redirect after 2 seconds
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Failed to reset password. Please try again.");
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
        <h1 className="text-4xl font-bold mb-8 animate-pulse-glow">Reset Your Password</h1>
        <form className="bg-white bg-opacity-10 p-8 rounded-lg drop-shadow-2xl border border-gray-700 max-w-md w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-teal-300 text-sm font-bold mb-2" htmlFor="password">
              New Password
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-500"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your new password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-teal-300 text-sm font-bold mb-2" htmlFor="conPassword">
              Confirm Password
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-500"
              type="password"
              id="conPassword"
              name="conPassword"
              placeholder="Confirm your new password"
              value={formData.conPassword}
              onChange={handleChange}
            />
            {errorMessage && <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all">
              Reset Password
            </button>
          </div>
          {successMessage && <p className="text-teal-300 text-xs italic mt-4">{successMessage}</p>}
        </form>
      </section>
      <footer className="bg-gray-900 bg-opacity-50 py-4 w-full text-center text-gray-400 border-t border-gray-700">
        © 2024 AnTCV. All rights reserved.
      </footer>
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