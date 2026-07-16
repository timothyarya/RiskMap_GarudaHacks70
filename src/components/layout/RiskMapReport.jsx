'use client'

import { useState } from "react"
import { MapContainer, Circle, TileLayer, useMapEvents } from "react-leaflet"
import ReportPanel from "./ReportPanel"
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
                <ReportPanel
                    value={radius}
                    setValue={(rad) => setRadius(rad)}
                />
                <MapContainer 
                    center={[-6.200000, 106.816666]}
                    zoom={13} 
                    className="h-screen z-0 rounded-2xl"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    
                    <LocationSelector setHazardCenter={setRiskPoint} />

                    {riskPoint && (
                    <Circle 
                        center={riskPoint} 
                        radius={radius} 
                        pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }} 
                    />
                    )}
                </MapContainer>
        </div>
    )
}