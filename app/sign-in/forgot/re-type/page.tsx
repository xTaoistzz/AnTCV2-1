"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import GuestNav from "../../../components/navigation/GuestNav";
import Image from "next/image";
import { motion } from "framer-motion";

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
        setErrorMessage("");
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
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
    <main className="flex flex-col bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen">
      <GuestNav />
      <section className="flex flex-col pt-32 items-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Image
            src="/LOGO.png"
            alt="AnTCV Logo"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-blue-800">
            Reset Your Password
          </h1>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="password">
              New Password
            </label>
            <input
              className="w-full p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 focus:outline-none focus:border-blue-500 transition duration-300"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your new password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="conPassword">
              Confirm Password
            </label>
            <input
              className="w-full p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 focus:outline-none focus:border-blue-500 transition duration-300"
              type="password"
              id="conPassword"
              name="conPassword"
              placeholder="Confirm your new password"
              value={formData.conPassword}
              onChange={handleChange}
            />
          </div>
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mb-4"
              aria-live="polite"
            >
              {errorMessage}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Reset Password
          </motion.button>
          {successMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 text-sm mt-4 text-center"
              aria-live="polite"
            >
              {successMessage}
            </motion.p>
          )}
        </motion.form>
      </section>
      <footer className="mt-auto py-4 text-center text-blue-600 bg-white bg-opacity-90">
        © 2024 AnTCV. All rights reserved.
      </footer>
    </main>
  );
}