"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-gradient-to-r from-blue-50 via-gray-100 to-gray-50 min-h-screen flex flex-col items-center justify-center text-gray-900">
      <nav className="bg-white p-3 flex rounded-lg text-center items-center justify-between fixed top-4 left-0 right-0 mx-4 shadow-lg border border-gray-300">
        <div className="text-blue-600 font-bold text-xl">AnTCV</div>
        <div>
          <Link href="/sign-in">
            <button className="text-white bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-all">
              Sign-In
            </button>
          </Link>
        </div>
      </nav>
      <section className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-bold mb-4 animate-pulse-soft">Welcome To AnTCV</h1>
        <h2 className="text-2xl mb-6">The Image Online Annotation Tool for Computer Vision</h2>
        <p className="text-lg max-w-2xl text-center mb-8">
          Enhance your computer vision projects with precise image annotations. AnTCV offers
          state-of-the-art tools for bounding box detection, polygon segmentation, and more.
        </p>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all">
            Get Started
          </button>
          <button className="bg-transparent border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
            Learn More
          </button>
        </div>
      </section>
      <footer className="bg-gray-100 py-4 w-full text-center text-gray-600 border-t border-gray-300">
        © 2024 AnTCV. All rights reserved.
      </footer>
      <style jsx>{`
        @keyframes pulseSoft {
          0%, 100% {
            text-shadow: 0 0 5px rgba(0, 119, 182, 0.5);
          }
          50% {
            text-shadow: 0 0 10px rgba(0, 119, 182, 0.7);
          }
        }

        .animate-pulse-soft {
          animation: pulseSoft 3s infinite;
        }
      `}</style>
    </main>
  );
}