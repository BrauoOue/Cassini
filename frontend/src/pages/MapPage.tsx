import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import chroma from "chroma-js";
import Navbar from "../components/NavBar";
import MenuAside from "../components/MenuAside";

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
  {
    id: 4,
    name: "Gazi Baba Park",
    healthIndex: 5.3,
    distance: "2.9 km",
    rating: 3.9,
    recommended: false,
    position: [42.0026, 21.4635],
  },
  {
    id: 5,
    name: "Aerodrom Center",
    healthIndex: 3.4,
    distance: "4.1 km",
    rating: 3.2,
    recommended: false,
    position: [41.9837, 21.4696],
  },
  {
    id: 6,
    name: "Karpoš Promenade",
    healthIndex: 7.5,
    distance: "2.0 km",
    rating: 4.5,
    recommended: true,
    position: [42.0038, 21.3911],
  },
  {
    id: 7,
    name: "Centar Bus Station",
    healthIndex: 1.2,
    distance: "1.7 km",
    rating: 2.8,
    recommended: false,
    position: [41.9955, 21.4351],
  },
    {
    id: 8,
    name: "Debar Maalo Gardens",
    healthIndex: 7.9,
    distance: "1.1 km",
    rating: 4.6,
    recommended: true,
    position: [41.9968, 21.4192],
  },
  {
    id: 9,
    name: "Zelenikovo Trail",
    healthIndex: 6.2,
    distance: "5.5 km",
    rating: 3.8,
    recommended: false,
    position: [41.9367, 21.5661],
  },
  {
    id: 10,
    name: "Taftalidze Sports Zone",
    healthIndex: 7.2,
    distance: "3.3 km",
    rating: 4.2,
    recommended: true,
    position: [42.0015, 21.3830],
  },
  {
    id: 11,
    name: "Butel Eco Park",
    healthIndex: 4.5,
    distance: "3.9 km",
    rating: 3.5,
    recommended: false,
    position: [42.0234, 21.4552],
  },
  {
    id: 12,
    name: "Drachevo Forest Walk",
    healthIndex: 8.7,
    distance: "6.7 km",
    rating: 4.8,
    recommended: true,
    position: [41.9333, 21.5130],
  },
  {
    id: 13,
    name: "Lisiche Wellness Zone",
    healthIndex: 5.1,
    distance: "4.4 km",
    rating: 3.6,
    recommended: false,
    position: [41.9721, 21.4748],
  },
  {
    id: 14,
    name: "Čair Park",
    healthIndex: 6.8,
    distance: "2.2 km",
    rating: 4.0,
    recommended: true,
    position: [42.0072, 21.4421],
  },
  {
    id: 15,
    name: "Bardovci Lakeside",
    healthIndex: 7.0,
    distance: "4.8 km",
    rating: 4.3,
    recommended: true,
    position: [42.0195, 21.3814],
  },
  {
    id: 16,
    name: "Taftalidze Park",
    healthIndex: 6.4,
    distance: "3.0 km",
    rating: 4.0,
    recommended: false,
    position: [41.9983, 21.3991],
  },
  {
    id: 17,
    name: "Skopje City Mall Garden",
    healthIndex: 6.0,
    distance: "2.7 km",
    rating: 3.9,
    recommended: false,
    position: [41.9917, 21.3938],
  },
  {
    id: 18,
    name: "Zhelezara Green Field",
    healthIndex: 4.2,
    distance: "5.1 km",
    rating: 3.3,
    recommended: false,
    position: [42.0105, 21.4673],
  },
  {
    id: 19,
    name: "Novo Lisiche Walkway",
    healthIndex: 5.7,
    distance: "4.0 km",
    rating: 3.7,
    recommended: false,
    position: [41.9752, 21.4690],
  },
  {
    id: 20,
    name: "Zelenikovo Hilltop",
    healthIndex: 8.1,
    distance: "6.3 km",
    rating: 4.5,
    recommended: true,
    position: [41.9372, 21.5521],
  },
  {
    id: 21,
    name: "Skopje Zoo Surroundings",
    healthIndex: 6.8,
    distance: "1.4 km",
    rating: 4.2,
    recommended: true,
    position: [41.9988, 21.4185],
  },
  {
    id: 22,
    name: "Museum District Gardens",
    healthIndex: 6.1,
    distance: "1.6 km",
    rating: 3.8,
    recommended: false,
    position: [41.9935, 21.4377],
  },
  {
    id: 23,
    name: "River Vardar Riverside Walk",
    healthIndex: 7.3,
    distance: "1.9 km",
    rating: 4.4,
    recommended: true,
    position: [41.9949, 21.4269],
  },
  {
    id: 24,
    name: "Mavrovka Courtyard",
    healthIndex: 5.5,
    distance: "2.1 km",
    rating: 3.6,
    recommended: false,
    position: [42.0021, 21.4342],
  },
];

const userIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [25, 25],
});

function UserLocationMarker({
  location,
}: {
  location: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(location, 13);
    }
  }, [location, map]);

  return location ? (
    <Marker position={location} icon={userIcon}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  //   const getColor = (index: number) => {
  //   // Normalize index between 0 and 1
  //   const t = Math.max(0, Math.min(index / 10, 1));

  //   // Interpolate from red to green
  //   const r = Math.round(255 * (1 - t));
  //   const g = Math.round(255 * t);
  //   const b = 0;

  //   return `rgb(${r},${g},${b})`;
  // };

  const scale = chroma.scale(["red", "yellow", "green"]).domain([0, 10]);

  const getColor = (index: number) => scale(index).hex();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
      },
      (err) => {
        console.warn(`Geolocation error: ${err.message}`);
      }
    );
  }, []);

  const riskLevel = 0.79;

  return (
    <div className="bg-gradient-to-br bg-white from-white min-h-screen text-black font-sans px-6 py-10 relative">
        <Navbar />
        <MenuAside/>
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-4xl font-extrabold text-black mb-2">
            Explore Wellness Spots in Skopje
          </h1>
          <p className="text-black mt-2">
            A live view of nearby locations ideal for your mental and physical
            well-being.
          </p>
        </header>

        <section className="mb-12 relative">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Health Spots Map
          </h2>
          <div className="h-[600px] w-full rounded-xl overflow-hidden border border-gray-300 relative">
            {/* Floating Risk Modal */}
            <div className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl p-4 w-72">
              <h3 className="text-lg font-bold text-[#1E3A8A] mb-1">
                📊 Personal Risk Level
              </h3>
              <p className="text-gray-800 text-sm">
                Based on your current location and environmental conditions,
                your health risk is estimated at:
              </p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {Math.round(riskLevel * 100)}%
              </p>
              <p className="text-sm text-gray-600 mt-2">
                This area may pose challenges due to current temperature and air
                quality, especially for older adults. It's recommended to stay
                hydrated and avoid prolonged outdoor activity.
              </p>
            </div>

            <MapContainer
              center={[41.9981, 21.4254]}
              zoom={13}
              scrollWheelZoom={true}
              className="h-full w-full rounded-xl z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <UserLocationMarker location={userLocation} />

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
                >
                  <Popup>
                    <div className="max-w-xs space-y-2">
                      <h3 className="text-lg font-bold text-[#1E3A8A]">
                        {spot.name}
                      </h3>
                      <p className="text-sm text-gray-700">
                        <strong>Health index:</strong> {spot.healthIndex}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Distance:</strong> {spot.distance}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Rating:</strong> {spot.rating}/5
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Recommended:</strong>{" "}
                        {spot.recommended ? "Yes" : "No"}
                      </p>

                      <div className="pt-2 flex flex-col space-y-2 text-white">
                        {/* Google Maps Directions */}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${
                            spot.position[0]
                          },${spot.position[1]}${
                            userLocation
                              ? `&origin=${userLocation[0]},${userLocation[1]}`
                              : ""
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 !text-neutral-100 visited:text-white no-underline text-sm rounded-md px-3 py-1 text-center hover:bg-blue-700"
                        >
                          🧭 Go Alone
                        </a>

                        <a
                          href={`/circle/${spot.id}`}
                          className="bg-purple-600 !text-neutral-100 visited:text-white no-underline text-sm rounded-md px-3 py-1 text-center hover:bg-purple-700"
                        >
                          👥 Circle Session
                        </a>

                        <a
                          href={`/map/threapist/${spot.id}`}
                          className="bg-green-600 !text-neutral-100 visited:text-white no-underline text-sm rounded-md px-3 py-1 text-center hover:bg-green-700"
                        >
                          📅 Book a Session
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
