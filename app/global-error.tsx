'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="bg-gray-900 text-white flex items-center justify-center min-h-screen">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-semibold mb-4">Something went wrong!</h2>
          <p className="mb-6">An error occurred. Please try again.</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}