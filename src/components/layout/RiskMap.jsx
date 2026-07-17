'use client'

import { useState, useEffect, useCallback } from "react"
import { MapContainer, Circle, TileLayer, useMapEvents, Popup, useMap } from "react-leaflet"
import Toast from "./Toast"
import 'leaflet/dist/leaflet.css'

// Fungsi untuk menghitung jarak (dalam meter) antara dua titik koordinat
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius bumi dalam meter
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Hasil dalam meter
};

function MapFlyTo({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 16); // Angka 16 adalah level zoom yang cukup dekat
        }
    }, [coords, map]);
    return null;
}

function LocationSelector({ setHazardCenter }) {
    useMapEvents({
        click(e) {
            setHazardCenter(e.latlng)
        },
    })
    return null;
}

// atur tingkat bahaya berdasarkan waktu terakhir di upvote
const getRiskPriority = (lastUpvotedAt) => {
    const timeDiffMilisecond = Date.now() - new Date(lastUpvotedAt).getTime()
    const timeDiffMinutes = Math.floor(timeDiffMilisecond / (60 * 1000))
    console.log(timeDiffMinutes)

    if (timeDiffMinutes < 30) return { color: "red", label: "Bahaya Tinggi" }
    else if (timeDiffMinutes < 60) return { color: "orange", label: "Bahaya Sedang" }
    else return { color: "green", label: "Bahaya Rendah" }
}


export default function RiskMap() {
    const [riskPoint, setRiskPoint] = useState(null)
    const [radius, setRadius] = useState(500)
    const [allReports, setAllReports] = useState([])
    const [userLocation, setUserLocation] = useState(null)
    const [isLocating, setIsLocating] = useState(false)
    
    
    const handleMyLocation = () => {
        setIsLocating(true)

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            setIsLocating(false)
            return;
        }

        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude
            const lng = pos.coords.longitude
            setUserLocation([lat, lng])

            let inDangerZones = []
            
            allReports.forEach(report => {
                const dist = calculateDistance(lat, lng, report.latitude, report.longitude)
                if (dist <= report.radius) {
                    inDangerZones.push(report.category)
                }
            })

            if (inDangerZones.length > 0) {
                // alert(`You are in danger zones: ${inDangerZones.join(', ')}`)
            } else {
                // alert('You are not in any danger zones.')
            }
            
            setIsLocating(false)
            
        },
        (error) => {
            alert(`Error: ${error.message}`);
            setIsLocating(false)
        },
        { enableHignAccuracy: true }
        )
    }

    const handleUpvote = async (reportId) => {
        try {
            const response = await fetch('/api/reports', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ reportId: reportId })
            })

            if (response.ok) {
                alert("Upvote Berhasil. Status area bahaya diupdate")
                window.location.reload()
            }
        } catch (error) {
            console.error(error)
        }
    }
    
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
        handleMyLocation()
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

                {userLocation && <MapFlyTo coords={userLocation} />}

                {allReports.map((report) => {
                    const priority = getRiskPriority(report.lastUpvotedAt)

                    return (
                        <Circle 
                        key={report._id}
                        center={[report.latitude, report.longitude]} 
                        radius={report.radius} 
                        pathOptions={{ 
                            color: priority.color, 
                            fillColor: priority.color, 
                            fillOpacity: 0.4,
                            weight: report.upvotes > 30 ? 5 : report.upvotes * 0.15
                        }} 
                        >
                            <Popup>
                                <h1 className="font-bold text-lg">{report.category}</h1>
                                <h2>{report.location}</h2>
                                <p>{`"${report.description}"`}</p>
                                <div
                                className="flex flex-row gap-2 items-center justify-center"
                                >
                                    <button
                                    onClick={() => handleUpvote(report._id)}   
                                    className="bg-neutral-400 px-3 py-1 rounded-full" 
                                    >
                                        {`Upvote (${report.upvotes})`}
                                    </button>
                                </div>
                            </Popup>
                        </Circle>
                    )
                })}

                {userLocation && (
                    <Circle 
                        center={userLocation} 
                        radius={30}
                        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.8 }} 
                    >
                        <Popup>Lokasi Anda Saat Ini</Popup>
                    </Circle>
                )}
            </MapContainer>

            <button 
                onClick={handleMyLocation}
                disabled={isLocating}
                className="fixed bottom-25 lg:bottom-10 right-6 lg:right-10 z-1000 bg-neutral-900/50 text-neutral-300 font-bold py-4 px-7 rounded-full border hover:bg-neutral-800/60 transition-all flex items-center justify-center text-2xl"
            >
                𖡡
            </button>
        </div>
    )
}