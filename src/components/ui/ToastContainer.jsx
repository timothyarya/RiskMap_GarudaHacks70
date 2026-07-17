'use client'
import { use, useEffect, useState } from "react"

export default function ToastContainer({ message, color }) {
    const [colorGroup, setColorGroup] = useState("")

    useEffect(() => {
        const setColor = () => {
            if (color === "red") setColorGroup("bg-red-700 text-white") 
            else if (color === "yellow") setColorGroup("bg-amber-300 text-neutral-300")
            else if (color === "green") setColorGroup("bg-green-800 text-neutral-300")
        }
        setColor()
    }, [color])
    
    return (
        <div
        className={`flex flex-row items-center justify-center ${colorGroup} px-5 py-3 rounded-full text-lg font-bold backdrop-blur-lg`}
        >
            {message}
        </div>
    )
}