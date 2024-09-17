"use client";

import React, { useState, ChangeEvent, FormEvent, FocusEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GuestNav from "../components/navigation/GuestNav";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/app/components/Modal";

interface FormData {
  username: string;
  email: string;
  password: string;
  conPassword: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    conPassword: ""
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<keyof FormData | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocusedField(e.target.name as keyof FormData);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const getRequirement = (field: keyof FormData): string => {
    switch (field) {
      case 'username':
        return "Username must contain only a-z, A-Z, 0-9, _ and be at least 8 characters long.";
      case 'email':
        return "Email should be in the format: example@email.com";
      case 'password':
        return "Password must be at least 8 characters long.";
      default:
        return "";
    }
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
          {(Object.keys(formData) as Array<keyof FormData>).map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor={field}>
                {field === 'conPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                className="w-full p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 focus:outline-none focus:border-blue-500 transition duration-300"
                type={field === 'email' ? 'email' : field === 'password' || field === 'conPassword' ? 'password' : 'text'}
                id={field}
                name={field}
                placeholder={`Enter your ${field === 'conPassword' ? 'password again' : field}`}
                value={formData[field]}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <AnimatePresence>
                {focusedField === field && field !== 'conPassword' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-blue-600 mt-1"
                  >
                    {getRequirement(field)}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
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
};

export default SignUp;