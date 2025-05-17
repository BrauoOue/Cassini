import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { MapContainer, TileLayer, Popup, Circle } from "react-leaflet";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
    rating: 8.8,
    position: [41.9981, 21.4254],
  },
  {
    id: 2,
    name: "Sky View Park",
    description: "Did not really feel great there. Maybe it was me, but the view was amazing.",
    rating: 4.5,
    position: [41.9955, 21.4322],
  },
];

const moodTrendData = [
  { day: "Mon", mood: 3.5 },
  { day: "Tue", mood: 4.0 },
  { day: "Wed", mood: 7.2 },
  { day: "Thu", mood: 5.8 },
  { day: "Fri", mood: 7.5 },
  { day: "Sat", mood: 8.0 },
  { day: "Sun", mood: 8.8 },
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

  const getColor = (rating: number) => {
    if (rating < 5.0) return "#ff0000"; // red
    if (rating < 7.5) return "#ffff00"; // yellow
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
          <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-4">Mood Trend Over Time</h2>
          <div className="w-full h-64 bg-white rounded-lg shadow border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodTrendData} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                <Line type="monotone" dataKey="mood" stroke="#1E3A8A" strokeWidth={2}/>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="day"/>
                <YAxis domain={[0, 10]}/>
                <Tooltip/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="max-w-5xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold text-black mb-4">Visited Relaxation Spots</h2>
          <MapContainer
              center={[41.9981, 21.4254]}
              zoom={15}
              className="h-80 w-full rounded-xl border border-gray-200 shadow-lg"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {visitedSpots.map((spot) => (
                <Circle
                    key={spot.id}
                    center={spot.position}
                    radius={100}
                    pathOptions={{color: getColor(spot.rating), fillColor: getColor(spot.rating), fillOpacity: 0.5}}
                >
                  <Popup>
                    <h3 className="font-semibold text-base">{spot.name}</h3>
                    <p className="text-sm text-gray-700">{spot.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Visited by {spot.rating} people</p>
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
                    rating: <span className="text-black text-lg">{spot.rating}</span>
                  </p>
                </CardContent>
              </Card>
          ))}
        </section>
      </div>
  );
}