"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
        // Handle successful verification
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
        <h1 className="text-4xl font-bold mb-8 animate-pulse-glow">Verify Your Account</h1>
        <p className="text-center mb-8">A verification code has been sent to your email. Please check your inbox.</p>
        <form
          className="bg-white bg-opacity-10 p-8 rounded-lg drop-shadow-2xl border border-gray-700 max-w-md w-full"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-teal-300 text-sm font-bold mb-2" htmlFor="code">
              Verification Code
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-500"
              type="text"
              id="code"
              name="code"
              placeholder="Enter your verification code"
              value={code}
              onChange={handleChange}
            />
            {errorMessage && <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-xs italic mt-2">{successMessage}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all">
              Verify
            </button>
          </div>
        </form>
        <div className="mt-4">
          <button
            onClick={handleSendCode}
            disabled={isCooldown}
            className={`bg-teal-500 text-white py-2 px-4 rounded-lg ${isCooldown ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'} transition-all`}
          >
            {isCooldown ? `Send Again (${cooldownTime}s)` : 'Send Again'}
          </button>
        </div>
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
