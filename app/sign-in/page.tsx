"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GuestNav from "../components/navigation/GuestNav";
import Image from "next/image";
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
          setErrorMessage(""); // Clear the error message on successful login
          setIsModalVisible(true);
          setTimeout(() => {
            router.push("/workspace");
          }, 2000); // Redirect after 2 seconds
        } else {
          setErrorMessage(data.message || "Login failed");
        }
        if (data.type === "verify") {
          // Send a request to `/sendnewcode` before redirecting
          await fetch(`${process.env.ORIGIN_URL}/sendnewcode`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          // Redirect to the verification page after sending the new code
          router.push("/sign-up/verify");
        }
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      console.error("An error occurred:", error);
    }
  };

  return (
    <main className="flex flex-col bg-gradient-to-t from-teal-300 via-blue-300 to-blue-600 min-h-screen">
      <GuestNav />
      <section className="flex flex-col pt-20  items-center font-light"> 
        <h1 className="text-2xl font-bold mb-4 animate-pulse-soft text-white drop-shadow-lg">
          <div className="flex justify-center mb-4 drop-shadow-lg">
            <Image
              src="/LOGO.png"
              alt="AnTCV Logo"
              width={100} // Adjust the width as needed
              height={100} // Adjust the height as needed
              className=""
            />
          </div>
          Sign In to AnTCV
        </h1>
        <form
          className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full bg-opacity-30"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-blue-600 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="bg-opacity-70 w-full p-1 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-500"
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
              className="block text-blue-600 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="bg-opacity-70 w-full p-1 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-500"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errorMessage && (
              <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 text-white p-2 px-4 rounded-lg hover:bg-blue-700 transition-all">
              Sign In
            </button>
            <Link href="/sign-in/forgot">
              <div className="text-blue-600 hover:text-blue-800 text-sm">
                Forgot Password?
              </div>
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
      <footer className="bottom-0 fixed w-full py-2 text-center border-t font-light bg-white">
        © 2024 AnTCV. All rights reserved.
      </footer>
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 space-y-4 shadow-lg text-center">
            <h2 className="text-xl font-semibold text-blue-600">
              Login Successful!
            </h2>
            <p className="text-gray-700">You will be redirected shortly...</p>
          </div>
        </div>
      )}
    </main>
  );
}
