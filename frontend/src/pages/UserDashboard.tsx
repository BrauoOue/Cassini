import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { MapContainer, TileLayer, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const mockUserStats = {
  moodScore: 7.5,
  stressLevel: "Medium",
  favoriteCategory: "Nature",
  bloodType: "B+",
  completedForms: 3,
};

const mockVisitedSpots = [
  {
    id: 1,
    name: "Zen Garden",
    description: "This trip made me feel great even when i was at my lowest. It got me thinking how beautiful life is.",
    visitors: 120,
    position: [41.9981, 21.4254],
  },
  {
    id: 2,
    name: "Sky View Park",
    description: "A scenic view overlooking the city. Great for sunsets and reflection.",
    visitors: 89,
    position: [41.9955, 21.4322],
  },
];

interface UserStats {
  moodScore: number;
  stressLevel: string;
  favoriteCategory: string;
  bloodType: string,
  completedForms: number;
}

export default function Dashboard() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [visitedSpots, setVisitedSpots] = useState<typeof mockVisitedSpots>([]);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setUserStats(mockUserStats);
      setVisitedSpots(mockVisitedSpots);
    }, 300);
  }, []);

  const getColor = (visitors: number) => {
    if (visitors > 100) return "#ff0000"; // red
    if (visitors > 50) return "#ffff00"; // yellow
    return "#00ff00"; // green
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans px-6 py-10 mix-blend-difference text-black">
      <header className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-black">Your Personal Peace Dashboard</h1>
        <p className="mt-2 text-gray-600">Using Space to find self peace</p>
      </header>

      {userStats && (
        <section className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <CardContent>
              <p className="text-lg text-gray-500">Mood Score</p>
              <p className="text-2xl font-bold text-black">{userStats.moodScore}/10</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent>
              <p className="text-lg text-gray-500">Stress Level</p>
              <p className="text-2xl font-bold text-black">{userStats.stressLevel}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent>
              <p className="text-lg text-gray-500">Favorite Category</p>
              <p className="text-2xl font-bold text-black">{userStats.favoriteCategory}</p>
            </CardContent>
          </Card>
          <div></div>
          <Card className="shadow-md">
            <CardContent>
              <p className="text-lg text-gray-500">Blood Type</p>
              <p className="text-2xl font-bold text-black">{userStats.bloodType}</p>
            </CardContent>
          </Card>
          <div></div>
        </section>
      )}

      <section className="max-w-5xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold text-black mb-4">Visited Relaxation Spots</h2>
        <MapContainer
          center={[41.9981, 21.4254]}
          zoom={13}
          className="h-80 w-full rounded-xl border border-gray-200 shadow-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {visitedSpots.map((spot) => (
            <Circle
              key={spot.id}
              center={spot.position}
              radius={150}
              pathOptions={{ color: getColor(spot.visitors), fillColor: getColor(spot.visitors), fillOpacity: 0.5 }}
            >
              <Popup>
                <h3 className="font-semibold text-base">{spot.name}</h3>
                <p className="text-sm text-gray-700">{spot.description}</p>
                <p className="text-xs text-gray-500 mt-1">Visited by {spot.visitors} people</p>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </section>

      <section className="max-w-5xl mx-auto mt-12 space-y-6">
        {visitedSpots.map((spot) => (
          <Card key={spot.id} className="shadow-sm">
            <CardContent>
              <h3 className="text-xl font-semibold text-black">{spot.name}</h3>
              <p className="text-gray-700 mt-1">{spot.description}</p>
              <p className="text-gray-500 text-sm mt-2">
                {spot.visitors} people have visited this spot.
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}