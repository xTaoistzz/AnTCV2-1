"use client"
export default function Loading() {
    return (
      <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen flex flex-col items-center justify-center text-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-teal-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-xl font-bold animate-pulse">Loading...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </main>
    );
  }