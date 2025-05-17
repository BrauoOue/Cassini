import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { Link } from "react-router-dom";

interface Therapist {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  bio: string;
}

interface Peer {
  id: number;
  name: string;
  service: string;
  creditsRequired: number;
  description: string;
}

const mockTherapists: Therapist[] = [
  {
    id: 1,
    name: "Dr. Lila Monroe",
    specialty: "Cognitive Behavioral Therapy",
    rating: 9.1,
    bio: "Empowering minds one thought at a time.",
  },
  {
    id: 2,
    name: "Dr. Ron Patel",
    specialty: "Mindfulness & Meditation",
    rating: 8.5,
    bio: "Helping you stay present and find peace.",
  },
  {
    id: 3,
    name: "Dr. Kosta Dinkoski",
    specialty: "Meditation",
    rating: 6.5,
    bio: "Finding your inner peace.",
  },
];

const mockPeers: Peer[] = [
  {
    id: 1,
    name: "Alex J.",
    service: "Walk & Talk",
    creditsRequired: 20,
    description: "Stroll together while you share your thoughts.",
  },
  {
    id: 2,
    name: "Jamie L.",
    service: "Listening Session",
    creditsRequired: 15,
    description: "I'm all ears, no judgment—just a friend.",
  },
  {
    id: 32,
    name: "Nikola J.",
    service: "New friend",
    creditsRequired: 1,
    description: "You need new friends?",
  },
];

export default function TherapistPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [peers, setPeers] = useState<Peer[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setTherapists(mockTherapists);
      setPeers(mockPeers);
    }, 300);
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans px-6 py-10">
      <header className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-black">Find Support That Suits You</h1>
        <p className="mt-2 text-gray-600">Choose from therapists or friendly peers to guide you.</p>
      </header>

      {/* Therapists */}
      <section className="max-w-5xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold text-black text-center mb-4">Licensed Therapists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <Link to={`/therapist/${therapist.id}`} key={therapist.id}>
              <Card className="shadow-md border border-gray-200 hover:shadow-lg transition">
                <CardContent>
                  <h3 className="text-xl font-bold text-black">{therapist.name}</h3>
                  <p className="text-gray-600">{therapist.specialty}</p>
                  <p className="text-gray-700 mt-2">{therapist.bio}</p>
                  <p className="text-sm mt-3 text-gray-500">
                    Rating: <span className="font-semibold text-black">{therapist.rating}</span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Peers */}
      <section className="max-w-5xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold text-black text-center mb-4">Available Peers (Use Credits)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {peers.map((peer) => (
            <Link to={`/peer/${peer.id}`} key={peer.id}>
              <Card className="shadow-md border border-gray-200 hover:shadow-lg transition">
                <CardContent>
                  <h3 className="text-xl font-bold text-black">{peer.name}</h3>
                  <p className="text-gray-600">{peer.service}</p>
                  <p className="text-gray-700 mt-2">{peer.description}</p>
                  <p className="text-sm mt-3 text-gray-500">
                    Credits Required:{" "}
                    <span className="font-semibold text-black">{peer.creditsRequired}</span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
