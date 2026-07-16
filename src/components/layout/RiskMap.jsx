'use client'

import { useState, useEffect } from "react"
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
    const [allReports, setAllReports] = useState([])

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('/api/reports', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    setAllReports(result.data);
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        }

        fetchReports();
    }, [])

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

                {
                    allReports.map((report) => {
                        return (
                            <Circle 
                            key={report._id}
                            center={[report.latitude, report.longitude]} 
                            radius={report.radius} 
                            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }} 
                            />
                        )
                    })
                }
            </MapContainer>
        </div>
    )
}