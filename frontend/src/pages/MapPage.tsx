import {useState} from "react";
import {MapContainer, TileLayer, Circle} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Card, CardContent} from "../components/ui/Card";
import {Link} from "react-router-dom";

const spots = [
    {
        id: 1,
        name: "City Park",
        healthIndex: 8.4,
        distance: "1.2 km",
        rating: 4.7,
        recommended: true,
        position: [41.9981, 21.4254],
    },
    {
        id: 2,
        name: "Kale Fortress",
        healthIndex: 6.9,
        distance: "2.5 km",
        rating: 4.1,
        recommended: false,
        position: [42.0007, 21.4331],
    },
    {
        id: 3,
        name: "Vodno Mountain",
        healthIndex: 9.2,
        distance: "3.8 km",
        rating: 4.9,
        recommended: true,
        position: [41.9623, 21.4095],
    },
];

export default function MapPage() {
    const [openPopup, setOpenPopup] = useState<number | null>(null);

    const getColor = (index: number) => {
        if (index > 8) return "#00ff00"; // green
        if (index > 6) return "#ffff00"; // yellow
        return "#ff0000"; // red
    };

    return (
        <div className="bg-gradient-to-br from-white min-h-screen text-black font-sans px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-[#1E3A8A]">Explore Wellness Spots in Skopje</h1>
                    <p className="text-gray-600 mt-2">
                        A live view of nearby locations ideal for your mental and physical well-being.
                    </p>
                </header>

                <section className="mb-12">
                    <h2 className="text-lg font-semibold mb-2">Heat Map Overview</h2>
                    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-300">
                        <MapContainer
                            center={[41.9981, 21.4254]}
                            zoom={13}
                            scrollWheelZoom={false}
                            className="h-full w-full rounded-xl z-0"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {spots.map((spot) => (
                                <Circle
                                    key={spot.id}
                                    center={spot.position as [number, number]}
                                    radius={300}
                                    pathOptions={{
                                        color: getColor(spot.healthIndex),
                                        fillColor: getColor(spot.healthIndex),
                                        fillOpacity: 0.5,
                                    }}
                                />
                            ))}
                        </MapContainer>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {spots.map((spot) => (
                        <Card key={spot.id}
                              className="bg-white border border-gray-200 cursor-pointer hover:shadow-md transition"
                              onClick={() => setOpenPopup(spot.id)}>
                            <CardContent>
                                <h3 className="text-xl font-semibold text-[#1E3A8A]">{spot.name}</h3>
                                <p className="text-sm text-gray-700 mt-2"><strong>Health
                                    index:</strong> {spot.healthIndex}</p>
                                <p className="text-sm text-gray-700"><strong>Distance:</strong> {spot.distance}</p>
                                <p className="text-sm text-gray-700"><strong>Rating:</strong> {spot.rating}/5</p>
                                <p className="text-sm text-gray-700"><strong>Suggested to
                                    others:</strong> {spot.recommended ? "Yes" : "No"}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Popup Overlay */}
                {openPopup !== null && (
                    <div
                        className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-6 max-w-3xl w-full space-y-6 shadow-xl">
                            <h2 className="text-2xl font-bold text-center text-[#1E3A8A]">Peace Options</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="border">
                                    <CardContent className="space-y-2 text-center">
                                        <h3 className="text-lg font-semibold">Alone</h3>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${spots.find(s => s.id === openPopup)?.position.join(",")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            Open in Google Maps
                                        </a>
                                    </CardContent>
                                </Card>

                                <Card className="border">
                                    <CardContent className="space-y-2 text-center">
                                        <h3 className="text-lg font-semibold">Peace Circle</h3>
                                        <img
                                            src="/../../public/mood2.jfif"
                                            alt="Peace Circle"
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <p className="text-sm text-gray-700">12 people plan to attend</p>
                                    </CardContent>
                                </Card>

                                <Card className="border cursor-pointer hover:shadow"
                                      onClick={() => (window.location.href = "/map/therapist")}>
                                    <CardContent className="space-y-2 text-center">
                                        <h3 className="text-lg font-semibold">Walk with a Therapist</h3>
                                        <img
                                            src="../../public/mood1.jfif"
                                            alt="Walk with therapist"
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <p className="text-sm text-gray-700">Book your walk session now</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="text-center mt-4">
                                <Link
                                    to="/map/threapist"
                                    className="border-2 border-black text-black px-6 py-2 rounded-xl font-medium hover:bg-black hover:text-white transition"
                                >
                                    Close
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}