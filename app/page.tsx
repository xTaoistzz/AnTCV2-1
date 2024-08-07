"use client"

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen flex flex-col items-center justify-center text-white">
      <nav className="bg-white bg-opacity-10 p-3 flex rounded-lg text-center items-center justify-between fixed top-4 left-0 right-0 mx-4 drop-shadow-2xl border border-gray-700">
        <div className="text-teal-300 font-bold text-xl">AnTCV</div>
        <div>
          <Link href="/sign-in">
          <button className="text-white bg-teal-500 p-2 rounded-lg hover:bg-teal-700 transition-all">
            Sign-In
          </button>          
          </Link>

        </div>
      </nav>
      <section className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-5xl font-bold mb-4 animate-pulse-glow">Welcome To AnTCV</h1>
        <h2 className="text-3xl mb-8">The Image Online Annotation Tool for Computer Vision</h2>
        <p className="text-lg max-w-2xl text-center mb-8">
          Enhance your computer vision projects with precise image annotations. AnTCV offers
          state-of-the-art tools for bounding box detection, polygon segmentation, and more.
        </p>
        <div className="flex space-x-4">
          <button className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all">
            Get Started
          </button>
          <button className="bg-transparent border border-teal-500 text-teal-500 py-2 px-4 rounded-lg hover:bg-teal-700 hover:text-white transition-all">
            Learn More
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