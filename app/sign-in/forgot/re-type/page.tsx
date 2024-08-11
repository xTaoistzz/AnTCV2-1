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

    if (password !== conPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

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
        <h1 className="text-4xl font-bold mb-8 animate-pulse-soft">Reset Your Password</h1>
        <form className="bg-white bg-opacity-70 p-8 rounded-lg shadow-lg border border-gray-300 max-w-md w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-blue-600 text-sm font-bold mb-2" htmlFor="password">
              New Password
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your new password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-600 text-sm font-bold mb-2" htmlFor="conPassword">
              Confirm Password
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500"
              type="password"
              id="conPassword"
              name="conPassword"
              placeholder="Confirm your new password"
              value={formData.conPassword}
              onChange={handleChange}
            />
            {errorMessage && (
              <p className="text-red-500 text-xs italic mt-2" aria-live="polite">
                {errorMessage}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all">
              Reset Password
            </button>
          </div>
          {successMessage && (
            <p className="text-blue-600 text-xs italic mt-4" aria-live="polite">
              {successMessage}
            </p>
          )}
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