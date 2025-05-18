import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import MenuAside from "../components/MenuAside";

interface Therapist {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  bio: string;
  image: string;
}

interface Peer {
  id: number;
  name: string;
  service: string;
  creditsRequired: number;
  description: string;
  image: string;
}

const mockTherapists: Therapist[] = [
  {
    id: 1,
    name: "Dr. Lila Monroe",
    specialty: "Cognitive Behavioral Therapy",
    rating: 9.1,
    bio: "Healing, one thought at a time.",
    image: "https://images.squarespace-cdn.com/content/v1/6091c3e4f5f6071721c43f77/4a97d877-6367-48aa-9f29-9496416afe72/DSC01180.jpg",
  },
  {
    id: 2,
    name: "Dr. Ron Patel",
    specialty: "Mindfulness & Meditation",
    rating: 8.5,
    bio: "Helping you stay present and find peace.",
    image: "https://img.freepik.com/premium-photo/portrait-male-therapist-doing-counseling-session-office-help-with-therapy-relationship-crisis-working-as-psychologist-give-assistance-mental-support-emotion-advisor_482257-52391.jpg",
  },
  {
    id: 3,
    name: "Dr. Kosta Dinkoski",
    specialty: "Meditation",
    rating: 6.5,
    bio: "Finding your inner peace.",
    image: "https://onebright.blob.core.windows.net/uploads/2023/11/Mens-Mental-Health-The-Role-of-Male-Therapists.jpg",
  },
];

const mockPeers: Peer[] = [
  {
    id: 1,
    name: "Alex J.",
    service: "Walk & Talk",
    creditsRequired: 20,
    description: "Stroll together while you share your thoughts.",
    image: "https://theboardr.blob.core.windows.net/headshots/36113_900.jpg",
  },
  {
    id: 2,
    name: "Jamie L.",
    service: "Listening Session",
    creditsRequired: 15,
    description: "I'm all ears, no judgment—just a friend.",
    image: "https://media.istockphoto.com/id/1147289240/photo/portrait-of-a-smiling-student-at-the-city-street.jpg?s=612x612&w=0&k=20&c=9-L5boel1w6eQZsZJDXjXpLMTkCopgSue6vycZzP3r4=",
  },
  {
    id: 32,
    name: "Nikola J.",
    service: "New friend",
    creditsRequired: 1,
    description: "You need new friends?",
    image: "https://parentingteensandtweens.com/wp-content/uploads/2022/11/9-things-teen-boys-need-1024x683.jpg",
  },
];

export default function TherapistPage() {
  const { id } = useParams<{ id: string }>();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [peers, setPeers] = useState<Peer[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setTherapists(mockTherapists);
      setPeers(mockPeers);
    }, 300);
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-900 px-4 py-10">
        <Navbar />
        <MenuAside/>
      <header className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-2">Find Support That Suits You</h1>
        <p className="text-lg text-gray-700">Choose from experienced therapists or friendly peers who are here to listen.</p>
      </header>

      {/* Therapists */}
      <section className="max-w-6xl mx-auto mt-16">
        <h2 className="text-3xl font-semibold text-black text-center mb-6">Licensed Therapists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {therapists.map((therapist) => (
            <Link to={`/therapist/${therapist.id}`} key={therapist.id} className="group">
              <Card className="h-full flex flex-col justify-between border border-gray-200 hover:shadow-xl transition-all duration-300">
                <CardContent>
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-full h-52 object-cover object-center rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="text-xl font-bold text-black group-hover:text-indigo-600">{therapist.name}</h3>
                  <p className="text-sm text-gray-600 italic">{therapist.specialty}</p>
                  <p className="text-gray-700 mt-3 text-sm">{therapist.bio}</p>
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
      <section className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-semibold text-black text-center mb-6">Available Peers (Use Credits)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {peers.map((peer) => (
            <Link to={`/peer/${peer.id}`} key={peer.id} className="group">
              <Card className="h-full flex flex-col justify-between border border-gray-200 hover:shadow-xl transition-all duration-300">
                <CardContent>
                  <img
                    src={peer.image}
                    alt={peer.name}
                    className="w-full h-48 object-cover object-center rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="text-xl font-bold text-black group-hover:text-indigo-600">{peer.name}</h3>
                  <p className="text-sm text-gray-600 italic">{peer.service}</p>
                  <p className="text-gray-700 mt-3 text-sm">{peer.description}</p>
                  <p className="text-sm mt-3 text-gray-500">
                    Credits Required: <span className="font-semibold text-black">{peer.creditsRequired}</span>
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