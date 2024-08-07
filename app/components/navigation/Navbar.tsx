"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white bg-opacity-10 p-3 flex rounded-lg text-center items-center justify-between fixed top-4 left-0 right-0 mx-4 drop-shadow-2xl border border-gray-700 z-50">
      <div className="text-teal-300 font-bold text-2xl ml-10">AnTCV</div>
      <div className="space-x-3">
        <Link href="/workspace">
          <button className="text-white bg-teal-500 p-2 rounded-lg hover:bg-teal-700 transition-all">
            Workspace
          </button>
        </Link>
        <Link href="/sign-in">
          <button className="text-white bg-teal-500 p-2 rounded-lg hover:bg-teal-700 transition-all">
            Sign Out
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
