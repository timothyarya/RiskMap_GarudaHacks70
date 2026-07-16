'use client'
import dynamic from "next/dynamic"

const RiskMap = dynamic(() => import('../../components/layout/RiskMapReport'), {
    ssr: false,
    loading: () => <p>Loading map...</p>
})

export default function ReportMap() {
    return (
        <div
        className="flex flex-col gap-5 w-full"
        >
            <RiskMap />
        </div>   
    )
}