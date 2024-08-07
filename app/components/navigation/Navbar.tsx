"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

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
    <main>
      <nav className="bg-white bg-opacity-10 p-3 flex rounded-lg text-center items-center justify-between fixed top-4 left-0 right-0 mx-4 drop-shadow-2xl border border-gray-700 z-50">
        <div className="text-teal-300 font-bold text-2xl ml-10">AnTCV</div>
        <div className="space-x-3">
          <Link href="/workspace">
            <button className="text-white bg-teal-500 p-2 rounded-lg hover:bg-teal-700 transition-all">
              Workspace
            </button>
          </Link>
          <button
            onClick={openModal}
            className="text-white bg-teal-500 p-2 rounded-lg hover:bg-teal-700 transition-all"
          >
            Sign Out
          </button>
        </div>
      </nav>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg p-6 space-y-4 shadow-lg">
            <h2 className="text-xl font-semibold text-white">Confirm Sign Out</h2>
            <p className="text-gray-300">Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="text-white bg-gray-500 p-2 rounded-lg hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="text-white bg-teal-500 p-2 rounded-lg hover:bg-teal-700 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Navbar;