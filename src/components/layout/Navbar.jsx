'use client'
import Link from "next/link"
import { pagelist } from "@/constant/pagelist"
import { usePathname } from "next/navigation"

export default function Navbar() {
    const pathname = usePathname()

    return (
        <nav
        className="fixed w-full flex flex-row left-0 bottom-5 bg-transparent items-center justify-center z-99 font-bold font-sans text-lg"
        >
            <div
            className="flex flex-row rounded-full bg-neutral-900/50 gap-2 border border-white/20 p-2 backdrop-blur-xs"
            >
                {
                    pagelist.map((page) => {
                        let isActive = pathname === page.path
                        return (
                            <Link
                            key={page.path}
                            href={page.path}
                            className={`transition-all duration-500 ease-in-out rounded-full px-5 py-2 ${isActive ? "bg-white/15 border border-white/10" : "hover:bg-neutral-800"}`}
                            >
                                {page.name}
                            </Link>
                        )
                    })
                }
            </div>
        </nav>
    )
}