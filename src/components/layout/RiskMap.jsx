'use client'

import { useState, useEffect, useCallback, use } from "react"
import { MapContainer, Circle, TileLayer, useMapEvents, Popup, useMap, CircleMarker, Pane } from "react-leaflet"
// import Toast from "./Toast"
import { useToast } from "@/store/useToastStore"
// import 'leaflet/dist/leaflet.css'

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
    // const [myLocationToastPriority, setMyLocationToastPriority] = useState(null)
    const showToast = useToast((state) => state.showToast)
    
    const handleMyLocation = (fetchedReports = null) => {
        setIsLocating(true)

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            setIsLocating(false)
            return;
        }

        const reportsToUse = Array.isArray(fetchedReports) ? fetchedReports : allReports;

        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude
            const lng = pos.coords.longitude
            setUserLocation([lat, lng])

            let inDangerZones = []
            let highestReportPriority = null
            
            reportsToUse.forEach(report => {
                const dist = calculateDistance(lat, lng, report.latitude, report.longitude)
                if (dist <= report.radius) {
                    inDangerZones.push(report.category)
                    const priority = getRiskPriority(report.lastUpvotedAt)
                    if (highestReportPriority == null) {
                        highestReportPriority = priority.color
                    } else if (highestReportPriority == "green") {
                        highestReportPriority = priority.color
                    } else if (highestReportPriority == "orange") {
                        highestReportPriority = priority.color
                    }
                }
            })

            if (inDangerZones.length > 0) {
                // showToast("Anda berada di zona bahaya", "warning", "red")
                // showToast("tes toast", "warning", "red")
                if (highestReportPriority === "red") {
                    showToast("Anda berada di Zona Bahaya Tingkat Tinggi", "warning", "red")
                } else if (highestReportPriority === "orange") {
                    showToast("Anda berada di Zona Bahaya Tingkat Sedang", "warning", "yellow")
                } else if (highestReportPriority === "green") {
                    showToast("Anda berada di Zona Bahaya Tingkat Rendah", "warning", "green")
                }
            } else {
                showToast("Anda berada di zona aman", "warning", "green")
            }
            
            setIsLocating(false)
            
        },
        (error) => {
            alert(`Error: ${error.message}`);
            setIsLocating(false)
        },
        { enableHighAccuracy: true }
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
                showToast("Upvote berhasil ditambahkan.", "info", "blue")
                setTimeout(() => {
                    window.location.reload()
                }, 500);
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
                    handleMyLocation(result.data)
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
                className="rounded-2xl h-screen"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {userLocation && <MapFlyTo coords={userLocation} />}

                <Pane name="user-location-pane" style={{ zIndex: 2000, pointerEvents: 'none' }}>
                    {userLocation && (
                        <Circle 
                            center={userLocation} 
                            radius={2000}
                            pathOptions={{ 
                                color: 'blue', 
                                fillColor: 'blue', 
                                fillOpacity: 0.1,
                                weight: 1,
                                interactive: false
                            }} 
                            
                        >
                            <CircleMarker 
                            center={userLocation} 
                            radius={8} 
                            pathOptions={{ 
                                color: 'blue', 
                                fillColor: 'cyan', 
                                fillOpacity: 1,
                                weight: 5,
                                interactive: false
                            }} 
                            />   
                        </Circle>
                    )}
                </Pane>

                <Pane name="reports-pane" style={{ zIndex: 2001 }}>
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
                                <Popup pane="popupPane">
                                    <h1 className="font-bold text-lg">{report.category}</h1>
                                    <h2 className="">{report.location}</h2>
                                    <p>{`"${report.description}"`}</p>
                                    <div
                                    className="flex flex-row gap-2 items-center justify-center"
                                    >
                                        <button
                                        onClick={() => handleUpvote(report._id)}   
                                        className="bg-neutral-200 px-2 pl-3 py-1 rounded-full" 
                                        >
                                            Upvote <span className="bg-neutral-700 px-2 rounded-full text-neutral-50">{report.upvotes}</span>
                                        </button>
                                    </div>
                                </Popup>
                            </Circle>
                        )
                    })}
                </Pane>
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