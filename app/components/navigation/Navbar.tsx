"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(`${process.env.ORIGIN_URL}/returnUsername`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
        } else {
          throw new Error("Failed to fetch username");
        }
      } catch (error) {
        console.error("An error occurred while fetching the username:", error);
        router.push('/sign-in');
      }
    };
    fetchUsername();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/sign-in");
      } else {
        console.error("Failed to sign out");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <nav className="bg-white bg-opacity-90 shadow-md py-4 px-6 top-0 left-0 right-0 z-50 drop-shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/LOGO.png"
                alt="AnTCV Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-bold text-2xl text-blue-700">AnTCV</span>
            </motion.div>
          </Link>
          <div className="flex items-center space-x-4">
            {username && <span className="text-blue-600">Welcome, {username}</span>}
            <Link href="/workspace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-semibold px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
              >
                Workspace
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
              className="font-semibold px-6 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-colors shadow-md"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md mx-4"
            >
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Confirm Sign Out</h2>
              <p className="text-blue-600 mb-6">Are you sure you want to sign out?</p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="font-semibold px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="font-semibold px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Sign Out
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;