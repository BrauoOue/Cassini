import { useState } from "react";
import { Card, CardContent } from "../components/ui/Card.tsx";
import Navbar from "../components/NavBar";
import MenuAside from "../components/MenuAside";
import "leaflet/dist/leaflet.css";

const mockData = [
  
  {
    id: 3,
    location: {
      coordinates: [41.1217, 20.8016],
      city: "Ohrid",
      country: "North Macedonia",
    },
    inputs: {
      mood_level: 8,
      stress_level: 2,
      anxiety_level: 1,
      fatigue_level: 3,
      sleep_quality: 9,
      heart_rate: 65,
      activity_level: 8,
      focus_level: 9,
      location_context: "nature",
      social_desire: 4,
      age_group: "36-45",
      chronic_conditions: [],
      weather_preference: "sunny",
    },
    outputs: {
      temperature_c: 23.0,
      humidity_percent: 45,
      air_quality_index: 10,
      ndvi: 0.8,
      noise_level_db: 25,
      pressure_hpa: 1013,
      proximity_to_water_m: 50,
      altitude_m: 700,
      sunlight_level: "full",
      urban_density: 200,
    },
  },
  {
    id: 4,
    location: {
      coordinates: [42.0000, 21.4333],
      city: "Kumanovo",
      country: "North Macedonia",
    },
    inputs: {
      mood_level: 5,
      stress_level: 6,
      anxiety_level: 5,
      fatigue_level: 6,
      sleep_quality: 5,
      heart_rate: 80,
      activity_level: 4,
      focus_level: 5,
      location_context: "work",
      social_desire: 5,
      age_group: "46-60",
      chronic_conditions: ["hypertension"],
      weather_preference: "cool",
    },
    outputs: {
      temperature_c: 18.5,
      humidity_percent: 65,
      air_quality_index: 20,
      ndvi: 0.4,
      noise_level_db: 45,
      pressure_hpa: 1008,
      proximity_to_water_m: 400,
      altitude_m: 350,
      sunlight_level: "partial",
      urban_density: 500,
    },
  },
  {
    id: 5,
    location: {
      coordinates: [41.8667, 22.9000],
      city: "Strumica",
      country: "North Macedonia",
    },
    inputs: {
      mood_level: 6,
      stress_level: 4,
      anxiety_level: 2,
      fatigue_level: 4,
      sleep_quality: 7,
      heart_rate: 72,
      activity_level: 6,
      focus_level: 7,
      location_context: "home",
      social_desire: 5,
      age_group: "18-25",
      chronic_conditions: [],
      weather_preference: "mild",
    },
    outputs: {
      temperature_c: 22.0,
      humidity_percent: 50,
      air_quality_index: 13,
      ndvi: 0.65,
      noise_level_db: 32,
      pressure_hpa: 1011,
      proximity_to_water_m: 150,
      altitude_m: 200,
      sunlight_level: "full",
      urban_density: 350,
    },
  },

  // Bulgaria
  {
    id: 6,
    location: {
      coordinates: [42.6977, 23.3219],
      city: "Sofia",
      country: "Bulgaria",
    },
    inputs: {
      mood_level: 6,
      stress_level: 5,
      anxiety_level: 4,
      fatigue_level: 6,
      sleep_quality: 7,
      heart_rate: 75,
      activity_level: 5,
      focus_level: 6,
      location_context: "work",
      social_desire: 7,
      age_group: "26-35",
      chronic_conditions: [],
      weather_preference: "cool",
    },
    outputs: {
      temperature_c: 19.0,
      humidity_percent: 60,
      air_quality_index: 18,
      ndvi: 0.5,
      noise_level_db: 40,
      pressure_hpa: 1015,
      proximity_to_water_m: 100,
      altitude_m: 500,
      sunlight_level: "full",
      urban_density: 600,
    },
  },
  
  {
    id: 9,
    location: {
      coordinates: [43.1368, 24.7136],
      city: "Pleven",
      country: "Bulgaria",
    },
    inputs: {
      mood_level: 5,
      stress_level: 6,
      anxiety_level: 5,
      fatigue_level: 7,
      sleep_quality: 6,
      heart_rate: 78,
      activity_level: 4,
      focus_level: 5,
      location_context: "work",
      social_desire: 6,
      age_group: "46-60",
      chronic_conditions: ["hypertension"],
      weather_preference: "cool",
    },
    outputs: {
      temperature_c: 17.5,
      humidity_percent: 65,
      air_quality_index: 20,
      ndvi: 0.45,
      noise_level_db: 45,
      pressure_hpa: 1007,
      proximity_to_water_m: 300,
      altitude_m: 210,
      sunlight_level: "partial",
      urban_density: 550,
    },
  },
  {
    id: 10,
    location: {
      coordinates: [42.5006, 27.4626],
      city: "Burgas",
      country: "Bulgaria",
    },
    inputs: {
      mood_level: 7,
      stress_level: 4,
      anxiety_level: 3,
      fatigue_level: 4,
      sleep_quality: 8,
      heart_rate: 70,
      activity_level: 6,
      focus_level: 7,
      location_context: "home",
      social_desire: 5,
      age_group: "26-35",
      chronic_conditions: [],
      weather_preference: "mild",
    },
    outputs: {
      temperature_c: 22.5,
      humidity_percent: 50,
      air_quality_index: 14,
      ndvi: 0.6,
      noise_level_db: 35,
      pressure_hpa: 1010,
      proximity_to_water_m: 80,
      altitude_m: 60,
      sunlight_level: "full",
      urban_density: 350,
    },
  },

{
  id: 14,
  location: {
    coordinates: [44.0128, 20.9111],
    city: "Kragujevac",
    country: "Serbia",
  },
  inputs: {
    mood_level: 5,
    stress_level: 6,
    anxiety_level: 5,
    fatigue_level: 6,
    sleep_quality: 5,
    heart_rate: 77,
    activity_level: 4,
    focus_level: 5,
    location_context: "work",
    social_desire: 6,
    age_group: "46-60",
    chronic_conditions: ["hypertension"],
    weather_preference: "cool",
  },
  outputs: {
    temperature_c: 17.0,
    humidity_percent: 60,
    air_quality_index: 20,
    ndvi: 0.5,
    noise_level_db: 42,
    pressure_hpa: 1009,
    proximity_to_water_m: 250,
    altitude_m: 185,
    sunlight_level: "cloudy",
    urban_density: 550,
  },
},
{
  id: 15,
  location: {
    coordinates: [43.7232, 20.6870],
    city: "Čačak",
    country: "Serbia",
  },
  inputs: {
    mood_level: 7,
    stress_level: 3,
    anxiety_level: 2,
    fatigue_level: 3,
    sleep_quality: 8,
    heart_rate: 68,
    activity_level: 7,
    focus_level: 8,
    location_context: "nature",
    social_desire: 4,
    age_group: "26-35",
    chronic_conditions: [],
    weather_preference: "sunny",
  },
  outputs: {
    temperature_c: 23.0,
    humidity_percent: 47,
    air_quality_index: 11,
    ndvi: 0.75,
    noise_level_db: 28,
    pressure_hpa: 1014,
    proximity_to_water_m: 70,
    altitude_m: 225,
    sunlight_level: "full",
    urban_density: 300,
  },
},

// Greece
{
  id: 16,
  location: {
    coordinates: [37.9838, 23.7275],
    city: "Athens",
    country: "Greece",
  },
  inputs: {
    mood_level: 6,
    stress_level: 5,
    anxiety_level: 4,
    fatigue_level: 5,
    sleep_quality: 6,
    heart_rate: 72,
    activity_level: 5,
    focus_level: 6,
    location_context: "urban",
    social_desire: 6,
    age_group: "26-35",
    chronic_conditions: [],
    weather_preference: "sunny",
  },
  outputs: {
    temperature_c: 25.5,
    humidity_percent: 48,
    air_quality_index: 18,
    ndvi: 0.4,
    noise_level_db: 45,
    pressure_hpa: 1010,
    proximity_to_water_m: 200,
    altitude_m: 70,
    sunlight_level: "full",
    urban_density: 850,
  },
},
{
  id: 17,
  location: {
    coordinates: [40.6401, 22.9444],
    city: "Thessaloniki",
    country: "Greece",
  },
  inputs: {
    mood_level: 7,
    stress_level: 4,
    anxiety_level: 3,
    fatigue_level: 4,
    sleep_quality: 7,
    heart_rate: 70,
    activity_level: 6,
    focus_level: 7,
    location_context: "work",
    social_desire: 5,
    age_group: "36-45",
    chronic_conditions: [],
    weather_preference: "mild",
  },
  outputs: {
    temperature_c: 22.0,
    humidity_percent: 52,
    air_quality_index: 16,
    ndvi: 0.6,
    noise_level_db: 38,
    pressure_hpa: 1012,
    proximity_to_water_m: 150,
    altitude_m: 50,
    sunlight_level: "full",
    urban_density: 700,
  },
},

];

export default function Dashboard() {
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const filteredData = filterCountry
    ? mockData.filter((d) => d.location.country === filterCountry)
    : mockData;

  const countries = Array.from(
    new Set(mockData.map((d) => d.location.country))
  );


  const average = (key: InputKeys) => {
    const values = filteredData.map((d) => d.inputs[key]);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* <Navbar /> */}
      {/* <MenuAside/> */}
      <div className="px-6 py-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          Environmental & Psychological Dashboard
        </h1>

        <div className="mb-6 text-center">
          <label className="mr-2 font-semibold text-lg">Filter by Country:</label>
          <select
            className="border border-gray-300 px-4 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            onChange={(e) =>
              setFilterCountry(e.target.value === "" ? null : e.target.value)
            }
          >
            <option value="">All</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
  <table className="min-w-full text-sm bg-white divide-y divide-gray-200">
    <thead>
      <tr className="bg-blue-50 text-gray-700 text-left">
        <th className="px-4 py-3">City</th>
        <th className="px-4 py-3">Country</th>
        <th className="px-4 py-3">Mood</th>
        <th className="px-4 py-3">Stress</th>
        <th className="px-4 py-3">Fatigue</th>
        <th className="px-4 py-3">Sleep</th>
        <th className="px-4 py-3">Heart Rate</th>
        <th className="px-4 py-3">Focus</th>
        <th className="px-4 py-3">Temp (°C)</th>
        <th className="px-4 py-3">Humidity (%)</th>
        <th className="px-4 py-3">Air Quality</th>
        <th className="px-4 py-3">NDVI</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {filteredData.map((entry) => (
        <tr
          key={entry.id}
          className="hover:bg-gray-50 transition duration-150"
        >
          <td className="px-4 py-3">{entry.location.city}</td>
          <td className="px-4 py-3">{entry.location.country}</td>
          <td className="px-4 py-3">{entry.inputs.mood_level}</td>
          <td className="px-4 py-3">{entry.inputs.stress_level}</td>
          <td className="px-4 py-3">{entry.inputs.fatigue_level}</td>
          <td className="px-4 py-3">{entry.inputs.sleep_quality}</td>
          <td className="px-4 py-3">{entry.inputs.heart_rate}</td>
          <td className="px-4 py-3">{entry.inputs.focus_level}</td>
          <td className="px-4 py-3">{entry.outputs.temperature_c}</td>
          <td className="px-4 py-3">{entry.outputs.humidity_percent}</td>
          <td className="px-4 py-3">{entry.outputs.air_quality_index}</td>
          <td className="px-4 py-3">{entry.outputs.ndvi}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
  <Card className="shadow-lg border-none bg-white rounded-2xl">
    <CardContent className="p-6">
      <p className="text-lg font-semibold mb-2 text-gray-700">
        Average Stress Level
      </p>
      <p className="text-4xl font-bold text-blue-400">
        {average("stress_level")}
      </p>
    </CardContent>
  </Card>
  <Card className="shadow-lg border-none bg-white rounded-2xl">
    <CardContent className="p-6">
      <p className="text-lg font-semibold mb-2 text-gray-700">
        Average Sleep Quality
      </p>
      <p className="text-4xl font-bold text-blue-400">
        {average("sleep_quality")}
      </p>
    </CardContent>
  </Card>
  <Card className="shadow-lg border-none bg-white rounded-2xl">
    <CardContent className="p-6">
      <p className="text-lg font-semibold mb-2 text-gray-700">
        Average Mood Level
      </p>
      <p className="text-4xl font-bold text-blue-400">
        {average("mood_level")}
      </p>
    </CardContent>
  </Card>
</div>
      </div>
    </div>
  );
}
