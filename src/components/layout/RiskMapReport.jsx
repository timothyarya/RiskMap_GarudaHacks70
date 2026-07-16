'use client'

import { useEffect, useState } from "react"
import { MapContainer, Circle, TileLayer, useMapEvents } from "react-leaflet"
import ReportPanel from "./ReportPanel"
import FormReportModal from "./FormReportModal"
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [locationName, setLocationName] = useState('');   
    const [description, setDescription] = useState('');
    const [reporting, setReporting] = useState(false);
    
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
        // e.preventDefault()
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

        // console.log(finalData)
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            })

            if (response.ok) {
                alert('Report submitted successfully to MongoDB');
                setRiskPoint(null)
                setIsModalOpen(false)
                setDescription('')
            } else {
                alert('Failed to submit report to MongoDB');
            }
        } catch (error) {
            console.error("Error submitting report:", error);
        } finally {
            setReporting(false)
        }
    }

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
                    className="h-screen z-0 rounded-2xl"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    
                    <LocationSelector setHazardCenter={setRiskPoint} />

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