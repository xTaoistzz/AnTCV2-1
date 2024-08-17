"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import GuestNav from "../../components/navigation/GuestNav";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Verify() {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(60);
  const router = useRouter();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isCooldown) {
      interval = setInterval(() => {
        setCooldownTime((prevTime) => {
          if (prevTime <= 1) {
            setIsCooldown(false);
            clearInterval(interval);
            return 60;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCooldown]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        credentials: 'include'
      });

      if (response.ok) {
        setSuccessMessage("Verification successful! Redirecting to login page...");
        setErrorMessage("");
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Verification failed");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      setSuccessMessage("");
      console.error("An error occurred:", error);
    }
  };

  const handleSendCode = async () => {
    if (isCooldown) return;

    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/sendnewcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });

      if (response.ok) {
        setSuccessMessage("Verification code sent to your email. Please check your inbox.");
        setErrorMessage("");
        setIsCooldown(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Failed to send code");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      setSuccessMessage("");
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
            Verify Your Account
          </h1>
          <p className="text-blue-600 mt-2">
            A verification code has been sent to your email. Please check your inbox.
          </p>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="code">
              Verification Code
            </label>
            <input
              className="w-full p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 focus:outline-none focus:border-blue-500 transition duration-300"
              type="text"
              id="code"
              name="code"
              placeholder="Enter your verification code"
              value={code}
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
          {successMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 text-sm mb-4"
              aria-live="polite"
            >
              {successMessage}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md mb-4"
          >
            Verify
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendCode}
            disabled={isCooldown}
            className={`w-full bg-white text-blue-600 py-3 rounded-full font-semibold border-2 border-blue-600 hover:bg-blue-50 transition duration-300 shadow-md ${isCooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCooldown ? `Send Again (${cooldownTime}s)` : 'Send New Code'}
          </motion.button>
        </motion.form>
      </section>
      <footer className="mt-auto py-4 text-center text-blue-600 bg-white bg-opacity-90">
        © 2024 AnTCV. All rights reserved.
      </footer>
    </main>
  );
}