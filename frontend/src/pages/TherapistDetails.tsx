import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Card, CardContent} from "../components/ui/Card";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const therapistDB = [
    {
        id: 1,
        name: "Dr. Lila Monroe",
        specialty: "Cognitive Behavioral Therapy",
        rating: 9.1,
        bio: "Empowering minds one thought at a time.",
        location: [41.9981, 21.4254],
        reviews: ["Helped me through a tough time", "Very empathetic and professional."],
    },
    {
        id: 2,
        name: "Dr. Ron Patel",
        specialty: "Mindfulness & Meditation",
        rating: 8.5,
        bio: "Helping you stay present and find peace.",
        location: [41.9955, 21.4322],
        reviews: ["Excellent techniques!", "Very calming presence."],
    },
    {
        id: 3,
        name: "Dr. Kosta Dinkoski",
        specialty: "Meditation",
        rating: 6.5,
        bio: "Finding your inner peace.",
        location: [41.9935, 21.4322],
        reviews: ["Excellent techniques!", "Very calming presence."],
    },
];

export default function TherapistDetails() {
    const {id} = useParams<{ id: string }>();
    const [therapist, setTherapist] = useState<any>(null);

    useEffect(() => {
        const data = therapistDB.find((t) => t.id === Number(id));
        setTherapist(data);
    }, [id]);

    if (!therapist) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="bg-white min-h-screen text-gray-900 font-sans px-6 py-10">
            <header className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-black">{therapist.name}</h1>
                <p className="text-gray-600">{therapist.specialty}</p>
            </header>

            <main className="max-w-4xl mx-auto mt-10 space-y-8">
                <Card className="shadow-md">
                    <CardContent>
                        <h2 className="text-xl font-semibold text-black mb-2">About</h2>
                        <p className="text-gray-700">{therapist.bio}</p>
                        <p className="mt-3 text-sm text-gray-500">
                            Rating: <span className="font-semibold text-black">{therapist.rating}</span>
                        </p>
                    </CardContent>
                </Card>

                <h2 className="text-xl font-semibold mb-2 text-center">Therapist Location</h2>
                <MapContainer
                    center={therapist.location}
                    zoom={15}
                    className="h-64 w-full rounded-lg border-2 border-mb-6"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <Marker position={therapist.location}>
                        <Popup>{therapist.name}</Popup>
                    </Marker>
                </MapContainer>

                <Card className="shadow-md">
                <CardContent>
                        <h2 className="text-xl font-semibold text-black mb-2">Reviews</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            {therapist.reviews.map((review, idx) => (
                                <li key={idx}>"{review}"</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Link
                        to="/"
                        className="border-2 border-black text-black px-6 py-2 rounded-xl font-medium hover:bg-black hover:text-white transition"
                    >
                        Reserve Session
                    </Link>
                </div>
            </main>
        </div>
    );
}
