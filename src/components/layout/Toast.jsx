'use client'
import ToastContainer from "../ui/ToastContainer"
import { useToast } from "@/store/useToastStore"

export default function Toast() {
    const { message, toastType, color, isOpen } = useToast()

    return (
        <div
        className={`fixed z-9999 top-5 left-0 w-full flex-row items-center justify-center ${isOpen ? "flex" : "hidden"}`}
        >
            {
                (toastType === "info") && (
                    <ToastContainer />
                )
            }
            {
                (toastType === "warning") && (
                    <ToastContainer 
                    message={message}
                    color={color}
                    />
                )
            }
        </div>
    )
}