'use client'
import { use, useEffect, useState } from "react"

export default function ToastContainer({ text, color }) {
    const [colorGroup, setColorGroup] = useState("")

    useEffect(() => {
        const setColor = () => {
            if (color === "red") setColorGroup("bg-red-700 text-white") 
            else if (color === "yellow") setColorGroup("bg-amber-300 text-neutral-300")
            else if (color === "green") setColorGroup("bg-green-500 text-neutral-300")
        }
        setColor()
    }, [color])
    
    return (
        <div
        className={`flex flex-row items-center justify-center ${colorGroup}`}
        >
            {text}
        </div>
    )
}