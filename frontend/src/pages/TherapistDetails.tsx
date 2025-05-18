import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/NavBar";
import MenuAside from "../components/MenuAside";

const therapistDB = [
   {
    id: 1,
    name: "Dr. Lila Monroe",
    specialty: "Cognitive Behavioral Therapy",
    rating: 9.1,
    bio: "Healing, one thought at a time.",
    image: "https://images.squarespace-cdn.com/content/v1/6091c3e4f5f6071721c43f77/4a97d877-6367-48aa-9f29-9496416afe72/DSC01180.jpg",
    location: [41.9981, 21.4254],
    reviews: [
      "Helped me through a tough time.",
      "She’s thoughtful, and the sessions are powerful.",
      "Cognitive techniques that really worked for me.",
    ],
  },
  {
    id: 2,
    name: "Dr. Ron Patel",
    specialty: "Mindfulness & Meditation",
    rating: 8.5,
    bio: "Helping you stay present and find peace.",
    image: "https://img.freepik.com/premium-photo/portrait-male-therapist-doing-counseling-session-office-help-with-therapy-relationship-crisis-working-as-psychologist-give-assistance-mental-support-emotion-advisor_482257-52391.jpg",
    location: [41.9955, 21.4322],
    reviews: [
      "Guided me into a peaceful mindset.",
      "Helped me develop a daily mindfulness habit.",
      "Very calm and grounded energy.",
    ],
  },
  {
    id: 3,
    name: "Dr. Kosta Dinkoski",
    specialty: "Meditation",
    rating: 6.5,
    bio: "Finding your inner peace.",
    image: "https://onebright.blob.core.windows.net/uploads/2023/11/Mens-Mental-Health-The-Role-of-Male-Therapists.jpg",
    location: [41.9935, 21.4322],
    reviews: [
      "Good for beginners in meditation.",
      "Sessions helped me feel more relaxed.",
      "A bit slow-paced but effective.",
    ],
  },
];

export default function TherapistDetails() {
  const { id } = useParams<{ id: string }>();
  const [therapist, setTherapist] = useState<any>(null);

  useEffect(() => {
    const data = therapistDB.find((t) => t.id === Number(id));
    setTherapist(data);
  }, [id]);

  if (!therapist)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
      </div>
    );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStars = 10 - fullStars;

    for (let i = 0; i < fullStars; i++) stars.push("★");
    for (let i = 0; i < emptyStars; i++) stars.push("☆");

    return stars.join("");
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans px-6 py-10">
        <Navbar />
        <MenuAside/>
      <header className="max-w-4xl mx-auto text-center">
        <img
          src={therapist.image}
          alt={therapist.name}
          className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg object-cover"
        />
        <h1 className="text-3xl font-bold text-black">{therapist.name}</h1>
        <p className="text-gray-600 text-lg">{therapist.specialty}</p>
      </header>

      <main className="max-w-4xl mx-auto mt-10 space-y-8">
        <Card className="shadow-md">
          <CardContent>
            <h2 className="text-xl font-semibold text-black mb-2">About</h2>
            <p className="text-gray-700">{therapist.bio}</p>
            <div className="mt-4 text-yellow-500 text-lg">
              {renderStars(therapist.rating)}{" "}
              <span className="text-sm text-gray-600 ml-2">{therapist.rating.toFixed(1)}/10</span>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-center">Therapist Location</h2>
          <MapContainer
            center={therapist.location}
            zoom={15}
            className="h-64 w-full rounded-lg border-2 border-gray-300 mb-6 shadow"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={therapist.location}>
              <Popup>{therapist.name}</Popup>
            </Marker>
          </MapContainer>
        </div>

        <Card className="shadow-md">
          <CardContent>
            <h2 className="text-xl font-semibold text-black mb-2">Reviews</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {therapist.reviews.map((review, idx) => (
                <li key={idx} className="italic">"{review}"</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
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
