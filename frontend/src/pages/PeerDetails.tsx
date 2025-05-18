import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/NavBar";
import MenuAside from "../components/MenuAside";

const peerDB = [
  {
    id: 1,
    name: "Alex J.",
    service: "Walk & Talk",
    creditsRequired: 20,
    description: "Stroll together while you share your thoughts.",
    image: "https://theboardr.blob.core.windows.net/headshots/36113_900.jpg",
    location: [41.9971, 21.4281],
    reviews: [
      "Felt like walking with a friend who really listens.",
      "Chill and comforting energy. I’d do it again.",
    ],
  },
  {
    id: 2,
    name: "Jamie L.",
    service: "Listening Session",
    creditsRequired: 15,
    description: "I'm all ears, no judgment—just a friend.",
    image:
      "https://media.istockphoto.com/id/1147289240/photo/portrait-of-a-smiling-student-at-the-city-street.jpg?s=612x612&w=0&k=20&c=9-L5boel1w6eQZsZJDXjXpLMTkCopgSue6vycZzP3r4=",
    location: [41.9945, 21.4312],
    reviews: [
      "Jamie made me feel completely heard.",
      "Great listener with really warm vibes.",
    ],
  },
  {
    id: 32,
    name: "Nikola J.",
    service: "New friend",
    creditsRequired: 1,
    description: "You need new friends?",
    image:
      "https://parentingteensandtweens.com/wp-content/uploads/2022/11/9-things-teen-boys-need-1024x683.jpg",
    location: [41.9922, 21.4278],
    reviews: [
      "Nikola’s energy is unmatched! Funny and easygoing.",
      "Felt like I made a genuine friend.",
    ],
  },
];

export default function PeerDetails() {
  const { id } = useParams<{ id: string }>();
  const [peer, setPeer] = useState<any>(null);

  useEffect(() => {
    const data = peerDB.find((p) => p.id === Number(id));
    setPeer(data);
  }, [id]);

  if (!peer) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans px-6 py-10">
        <Navbar />
        <MenuAside/>
      <header className="max-w-4xl mx-auto text-center">
        <img
          src={peer.image}
          alt={peer.name}
          className="mx-auto w-40 h-40 rounded-full object-cover mb-4 shadow-md"
        />
        <h1 className="text-3xl font-bold text-black">{peer.name}</h1>
        <p className="text-gray-600">{peer.service}</p>
      </header>

      <main className="max-w-4xl mx-auto mt-10 space-y-8">
        <Card className="shadow-md">
          <CardContent>
            <h2 className="text-xl font-semibold text-black mb-2">About</h2>
            <p className="text-gray-700">{peer.description}</p>
            <p className="mt-3 text-sm text-gray-500">
              Credits Required:{" "}
              <span className="font-semibold text-black">
                {peer.creditsRequired}
              </span>
            </p>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-2 text-center">
          Peer Location
        </h2>
        <MapContainer
          center={peer.location}
          zoom={15}
          className="h-64 w-full rounded-lg border-2 border-gray-300 mb-6 shadow"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={peer.location}>
            <Popup>{peer.name}</Popup>
          </Marker>
        </MapContainer>

        <Card className="shadow-md">
          <CardContent>
            <h2 className="text-xl font-semibold text-black mb-2">Reviews</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {peer.reviews.map((review, idx) => (
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
