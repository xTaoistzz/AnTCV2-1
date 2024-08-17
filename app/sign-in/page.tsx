"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GuestNav from "../components/navigation/GuestNav";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SignIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${process.env.ORIGIN_URL}/returnUsername`,
          {
            credentials: "include",
          }
        );

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

      const data = await response.json();

      if (response) {
        if (response.ok) {
          setErrorMessage("");
          setIsModalVisible(true);
          setTimeout(() => {
            router.push("/workspace");
          }, 2000);
        } else {
          setErrorMessage(data.message || "Login failed");
        }
        if (data.type === "verify") {
          await fetch(`${process.env.ORIGIN_URL}/sendnewcode`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          router.push("/sign-up/verify");
        }
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
            Sign In to AnTCV
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
            <label
              className="block text-blue-700 text-sm font-semibold mb-2"
              htmlFor="username"
            >
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
          <div className="mb-6">
            <label
              className="block text-blue-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
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
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Sign In
            </motion.button>
            <Link href="/sign-in/forgot">
              <span className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-300">
                Forgot Password?
              </span>
            </Link>
          </div>
          <div className="text-center">
            <Link href="/sign-up">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 py-2 px-6 rounded-full font-semibold border-2 border-blue-600 hover:bg-blue-50 transition duration-300 shadow-md"
              >
                Don't have an account? Sign Up
              </motion.button>
            </Link>
          </div>
        </motion.form>
      </section>
      <footer className="mt-auto py-4 text-center text-blue-600 bg-white bg-opacity-90">
        © 2024 AnTCV. All rights reserved.
      </footer>
      {isModalVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Login Successful!
            </h2>
            <p className="text-blue-800">You will be redirected shortly...</p>
          </div>
        </motion.div>
      )}
    </main>
  );
}