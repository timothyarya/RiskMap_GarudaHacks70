'use client'

import { useState } from "react"
import { MapContainer, Circle, TileLayer, useMapEvents } from "react-leaflet"
import 'leaflet/dist/leaflet.css'

function LocationSelector({ setHazardCenter }) {
    useMapEvents({
        click(e) {
            setHazardCenter(e.latlng)
        },
    })
    return null;
}

export default function RiskMap() {
    const [riskPoint, setRiskPoint] = useState(null)
    const [radius, setRadius] = useState(500)

    return (
        <div
        className="flex flex-col gap-5 w-full"
        >
            <MapContainer 
                center={[-6.200000, 106.816666]} // Default ke Jakarta
                zoom={13} 
                className="rounded-2xl h-screen z-0"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
            </MapContainer>
        </div>
    )
}