"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GuestNav from "../components/navigation/GuestNav";
import Image from "next/image";
import { motion } from "framer-motion";
import Modal from "@/app/components/Modal"; // Adjust the path as needed

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    conPassword: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, password, conPassword } = formData;

    if (password !== conPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (response.ok) {
        setErrorMessage("");
        setIsModalOpen(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      console.error("An error occurred:", error);
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    router.push("/sign-up/verify");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
            Sign Up for AnTCV
          </h1>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="w-full p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 focus:outline-none focus:border-blue-500 transition duration-300"
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 focus:outline-none focus:border-blue-500 transition duration-300"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 focus:outline-none focus:border-blue-500 transition duration-300"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
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
              placeholder="Confirm your password"
              value={formData.conPassword}
              onChange={handleChange}
            />
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
          </div>
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Sign Up
            </motion.button>
            <Link href="/sign-in">
              <span className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-300">
                Already have an account? Sign In
              </span>
            </Link>
          </div>
        </motion.form>
      </section>
      <footer className="mt-auto py-4 text-center text-blue-600 bg-white bg-opacity-90">
        © 2024 AnTCV. All rights reserved.
      </footer>
      <Modal
        isOpen={isModalOpen}
        message="Successfully registered! Do you want to verify your account now?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </main>
  );
}