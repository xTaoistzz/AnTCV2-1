import Link from "next/link";

export default function GuestNav() {
  return (
    <main>
      <nav className="top-0 w-full flex items-center border-b shadow-md justify-between bg-gray-100 py-2 px-4 text-[16px]">
        <Link href={"/"}>
        <div className="font-bold text-xl text-blue-700">AnTCV</div>
        </Link>
        
        <div className="space-x-3">
          <Link href={"/sign-in"}>
            <button className="font-light border p-0.5 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors w-20">
              Sign-In
            </button>
          </Link>
          <Link href={"/sign-up"}>
            <button className="font-light border p-0.5 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors w-20">
              Sign-Up
            </button>
          </Link>
        </div>
      </nav>
    </main>
  );
}
