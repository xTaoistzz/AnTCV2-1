import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-2xl border border-blue-300 text-center">
        <h2 className="text-4xl font-bold mb-4 text-blue-800">404 - Not Found</h2>
        <p className="text-lg mb-6 text-blue-600">Could not find the requested resource.</p>
        <Link href="/">
          <div className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg text-lg font-semibold">
            Return Home
          </div>
        </Link>
      </div>
      <footer className="bg-white bg-opacity-90 py-4 w-full text-center text-blue-600 border-t border-blue-200 mt-8 fixed bottom-0 shadow-md">
        © 2024 AnTCV. All rights reserved.
      </footer>
    </main>
  );
}