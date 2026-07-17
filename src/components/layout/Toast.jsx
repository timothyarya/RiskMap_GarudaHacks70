'use client'
import ToastContainer from "../ui/ToastContainer"

export default function Toast({ color, toastType, text }) {
    return (
        <div
        fixed z-9999 top-5 left-0 w-full flex flex-row items-center justify-center
        >
            {
                (toastType === "info") && (
                    <ToastContainer />
                )
            }
            {
                (toastType === "warning") && (
                    <ToastContainer 
                    text={text}
                    color={color}
                    />
                )
            }
        </div>
    )
}