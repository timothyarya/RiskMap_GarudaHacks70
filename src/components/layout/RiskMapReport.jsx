'use client'

import { useEffect, useState, useCallback } from "react"
import { MapContainer, Circle, TileLayer, useMapEvents, useMap, Popup, CircleMarker } from "react-leaflet"
import ReportPanel from "./ReportPanel"
import FormReportModal from "./FormReportModal"
// import Toast from "./Toast"
import { useToast } from "@/store/useToastStore"
// import 'leaflet/dist/leaflet.css'

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

function LocationSelector({ setRiskCenter }) {
    useMapEvents({
        click(e) {
            setRiskCenter(e.latlng)
        },
    })
    return null;
}

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [locationName, setLocationName] = useState('');   
    const [description, setDescription] = useState('');
    const [reporting, setReporting] = useState(false);
    
    const [allReports, setAllReports] = useState([])
    const [userLocation, setUserLocation] = useState(null)
    const [isLocating, setIsLocating] = useState(false)
    const showToast = useToast((state) => state.showToast)

    const handleSetRiskPoint = (point) => {
        if (!userLocation) {
            showToast("Harap tunggu hingga lokasi Anda ditemukan.", "warning", "orange");
            return;
        }

        const userLat = userLocation[0];
        const userLng = userLocation[1];

        const distance = calculateDistance(point.lat, point.lng, userLat, userLng)

        if (distance > 2000) {
            showToast("Jarak titik melebih 2000m dari lokasi anda.", "warning", "red")
        } else {
            setRiskPoint(point)
        }
    }
    
    const handleMyLocation = (fetchedReports = null) => {
        setIsLocating(true)

        if (!navigator.geolocation) {
            showToast("Geolocation is not supported by this browser.", "info", "yellow")
            // alert('Geolocation is not supported by this browser.');
            setIsLocating(false)
            return;
        }

        const reportsToUse = Array.isArray(fetchedReports) ? fetchedReports : allReports;

        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude
            const lng = pos.coords.longitude
            setUserLocation([lat, lng])

            let inDangerZones = []
            
            reportsToUse.forEach(report => {
                const dist = calculateDistance(lat, lng, report.latitude, report.longitude)
                if (dist <= report.radius) {
                    inDangerZones.push(report.category)
                }
            })

            if (inDangerZones.length > 0) {
                showToast("Anda berada di zona bahaya", "warning", "red")
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

    const fetchLocationName = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
            const data = await response.json();

            if (data && data.display_name) {

                const address = data.address
                const shortName = `${address.village || address.suburb || address.town || ''}, ${address.city || address.county || ''}`.replace(/^, /, '');
                setLocationName(shortName || data.display_name);
            } else {
                setLocationName('Unknown Location');
            }
        } catch (error) {
            console.log('Error fetching location name:', error);
            setLocationName('Failed to get location');
        }
    }

    const handleSubmit = async (e) => {
        const formData = new FormData(e.target)
        const category = formData.get('category')

        const finalData = {
            category: category,
            location: locationName,
            description: description,
            latitude: riskPoint.lat,
            longitude: riskPoint.lng,
            radius: radius
        }

        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            })

            if (response.ok) {
                showToast("Report Submitted!", "info", "blue")
                // alert('Report submitted successfully to MongoDB');
                setRiskPoint(null)
                setIsModalOpen(false)
                setDescription('')
            } else {
                showToast("Failed to submit report.", "info", "red")
                // alert('Failed to submit report to MongoDB');
            }
        } catch (error) {
            console.error("Error submitting report:", error);
        } finally {
            setReporting(false)
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
                {
                    isModalOpen && 
                    <FormReportModal
                        closeModal={() => {
                            setIsModalOpen(false)
                            setRiskPoint(null)
                            setDescription('')
                        }}
                        riskPoint={riskPoint} 
                        locationName={locationName} 
                        description={description} 
                        setDescription={(desc) => {
                            setDescription(desc)
                        }}
                        reporting={reporting}
                        setReporting={setReporting}
                        submitHandler={(e) => handleSubmit(e)}
                    />
                }
                <ReportPanel
                    value={radius}
                    setValue={(rad) => setRadius(rad)}
                    riskPointAvail={riskPoint}
                    openModal={() => {
                        setIsModalOpen(true)
                        fetchLocationName(riskPoint.lat, riskPoint.lng)
                    }}
                />
                <MapContainer 
                    center={[-6.200000, 106.816666]}
                    zoom={13} 
                    className="h-screen rounded-2xl"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    
                    <LocationSelector setRiskCenter={(point) => handleSetRiskPoint(point)} />

                    {userLocation && <MapFlyTo coords={userLocation} />}

                    {
                        riskPoint && (
                        <Circle 
                            center={riskPoint} 
                            radius={radius} 
                            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }} 
                        />
                        )
                    }

                    {
                        allReports.map((report) => {
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
                                />
                            )
                        })}

                        {userLocation && (
                            <Circle 
                                center={userLocation} 
                                radius={2000}
                                pathOptions={{ 
                                    color: 'blue', 
                                    fillColor: 'blue', 
                                    fillOpacity: 0.1,
                                    weight: 1 
                                }} 
                                
                            >
                                <CircleMarker 
                                center={userLocation} 
                                radius={8} // Radius dalam hitungan pixel, bukan meter
                                pathOptions={{ 
                                    color: 'blue', 
                                    fillColor: 'cyan', 
                                    fillOpacity: 1,
                                    weight: 5
                                }} 
                                />   
                            </Circle>
                        )}
                </MapContainer>

                <button 
                onClick={handleMyLocation}
                disabled={isLocating}
                className="fixed bottom-50 lg:bottom-10 right-6 lg:right-10 z-10000 bg-neutral-900/50 text-neutral-300 font-bold py-4 px-7 rounded-full border hover:bg-neutral-800/60 transition-all flex items-center justify-center text-2xl cursor-pointer"
            >
                𖡡
            </button>
        </div>
    )
}   