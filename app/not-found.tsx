import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen flex flex-col items-center justify-center text-white">
      <div className="bg-white bg-opacity-10 p-8 rounded-lg drop-shadow-2xl border border-gray-700 text-center">
        <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
        <p className="text-lg mb-6">Could not find the requested resource.</p>
        <Link href="/">
          <div className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all">
            Return Home
          </div>
        </Link>
      </div>
      <footer className="bg-gray-900 bg-opacity-50 py-4 w-full text-center text-gray-400 border-t border-gray-700 mt-8 fixed bottom-0">
        © 2024 AnTCV. All rights reserved.
      </footer>
    </main>
  );
}