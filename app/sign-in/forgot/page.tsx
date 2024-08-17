"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import GuestNav from "../../components/navigation/GuestNav";
import Image from "next/image";
import { motion } from "framer-motion";

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
            Forgot Password
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
            <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 focus:outline-none focus:border-blue-500 transition duration-300"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Send Reset Link
            </motion.button>
            <Link href="/sign-in">
              <span className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-300">
                Back to Sign In
              </span>
            </Link>
          </div>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-blue-600 text-sm mt-4 text-center"
            >
              {message}
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