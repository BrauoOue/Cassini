import { useMemo } from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "../components/ui/Card";
import { Container, Typography, Grid, Box } from "@mui/material";

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
  const getColor = (index: number) => {
    if (index > 8) return "#00ff00"; // green
    if (index > 6) return "#ffff00"; // yellow
    return "#ff0000"; // red
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 min-h-screen text-black font-sans px-6 py-10">
      <Container maxWidth="lg">
        <header className="text-center mb-10">
          <Typography variant="h3" fontWeight="bold" color="#1E3A8A">
            Explore Wellness Spots in Skopje
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            A live view of nearby locations ideal for your mental and physical well-being.
          </Typography>
        </header>

        <section className="mb-12">
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Heat Map Overview
          </Typography>
          <Box className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-300">
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
          </Box>
        </section>

        <Grid container spacing={3}>
          {spots.map((spot) => (
            <Grid item xs={12} md={4} key={spot.id}>
              <Card className="bg-white border border-gray-200">
                <CardContent>
                  <Typography className="text-xl font-semibold text-[#1E3A8A]">
                    {spot.name}
                  </Typography>
                  <Typography className="text-sm text-gray-700 mt-2">
                    <strong>Health index:</strong> {spot.healthIndex}
                  </Typography>
                  <Typography className="text-sm text-gray-700">
                    <strong>Distance:</strong> {spot.distance}
                  </Typography>
                  <Typography className="text-sm text-gray-700">
                    <strong>Rating:</strong> {spot.rating}/5
                  </Typography>
                  <Typography className="text-sm text-gray-700">
                    <strong>Suggested to others:</strong> {spot.recommended ? "Yes" : "No"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}