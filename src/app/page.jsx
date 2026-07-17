'use client'
import Link from "next/link";

export default function Home() {
  return (
    <div
    className="flex flex-col items-center justify-center text-center gap-10"
    >
      <div
      className="flex flex-col items-center justify-center text-center gap-2"
      >
        <h1
        className="text-7xl font-bold"
        >
          Risk Map
        </h1>
        <h3
        className="text-3xl"
        >
          Stay alert
        </h3>
      </div>
      <Link
      href="/map"
      className="bg-neutral-50 px-5 py-2 text-neutral-900 font-bold text-xl rounded-full hover:bg-neutral-300 transition-all duration-300 ease-in-out"
      >
        Open Map ➜
      </Link>
    </div> 
  );
}
