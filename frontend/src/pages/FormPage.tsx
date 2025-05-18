import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Typography,
    Card,
    Fade,
    CardContent,
    MenuItem,
    Select,
    Stack,
    FormControl,
    InputLabel,
    TextField,
    Button,
    Grid,
    Box,
    Divider,
} from '@mui/material';
import Navbar from "../components/NavBar";
import MenuAside from "../components/MenuAside";


const imageOptions = [
    "./public/mood1.jfif",
    "./public/mood2.jfif",
    "./public/mood3.jfif",
    "./public/mood4.jfif",
];

const ageGroups = ["<18", "18–25", "26–35", "36–50", "51+"];
const conditions = ["anxiety", "asthma", "diabetes", "hypertension"];
const weatherOptions = ["sunny", "cool", "rainy", "snowy"];
const contextOptions = ["home", "work", "travel", "outdoors"];

export default function FormPage() {
    const [formValues, setFormValues] = useState({
        mood_level: "",
        stress_level: "",
        anxiety_level: "",
        fatigue_level: "",
        sleep_quality: "",
        heart_rate: "",
        activity_level: "",
        focus_level: "",
        location_context: "",
        social_desire: "",
        age_group: "",
        chronic_conditions: [],
        weather_preference: "",
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleChange = (field: string) => (event: any) => {
        const value = event.target.value;
        setFormValues(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-gradient-to-br from-white to-white min-h-screen text-gray-900 font-sans px-6 py-10">
            {/* <Navbar />
        <MenuAside/> */}
            <header className="max-w-5xl mx-auto text-center">
                <Typography variant="h3" fontWeight="bold" color="black">
                    Your Self Reflection Form
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" mt={1}>
                    Using Space to find self peace
                </Typography>
            </header>

            <Container maxWidth="md" className="mt-10">
                <Stack spacing={4}>

                    <Fade in timeout={600}>
                        <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Stack spacing={3}>

                                    {/* 🧠 Mental */}
                                    <Typography variant="h6" color="black" fontWeight="bold">🧠 Mental</Typography>
                                    <TextField label="Mood Level (1–10)" type="number" fullWidth value={formValues.mood_level} onChange={handleChange("mood_level")} />
                                    <TextField label="Stress Level (1–10)" type="number" fullWidth value={formValues.stress_level} onChange={handleChange("stress_level")} />
                                    <TextField label="Anxiety Level (1–10)" type="number" fullWidth value={formValues.anxiety_level} onChange={handleChange("anxiety_level")} />

                                    {/* 😴 Physical */}
                                    <Typography variant="h6" color="black" fontWeight="bold">😴 Physical</Typography>
                                    <TextField label="Fatigue Level (1–10)" type="number" fullWidth value={formValues.fatigue_level} onChange={handleChange("fatigue_level")} />
                                    <TextField label="Sleep Quality (1–10)" type="number" fullWidth value={formValues.sleep_quality} onChange={handleChange("sleep_quality")} />

                                    {/* 💓 Physiological */}
                                    <Typography variant="h6" color="black" fontWeight="bold">💓 Physiological</Typography>
                                    <TextField label="Heart Rate (bpm)" type="number" fullWidth value={formValues.heart_rate} onChange={handleChange("heart_rate")} />

                                    {/* 🚶‍♂️ Activity */}
                                    <Typography variant="h6" color="black" fontWeight="bold">🚶‍♂️ Activity</Typography>
                                    <TextField label="Activity Level (1–10)" type="number" fullWidth value={formValues.activity_level} onChange={handleChange("activity_level")} />

                                    {/* 🧠 Cognitive */}
                                    <Typography variant="h6" color="black" fontWeight="bold">🧠 Cognitive</Typography>
                                    <TextField label="Focus Level (1–10)" type="number" fullWidth value={formValues.focus_level} onChange={handleChange("focus_level")} />

                                    {/* 🧍 Contextual */}
                                    <Typography variant="h6" color="black" fontWeight="bold">🧍 Contextual</Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Location Context</InputLabel>
                                        <Select value={formValues.location_context} onChange={handleChange("location_context")} label="Location Context">
                                            {contextOptions.map(ctx => (
                                                <MenuItem key={ctx} value={ctx}>{ctx}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {/* 👫 Social */}
                                    <Typography variant="h6" color="black" fontWeight="bold">👫 Social</Typography>
                                    <TextField label="Social Desire (1–10)" type="number" fullWidth value={formValues.social_desire} onChange={handleChange("social_desire")} />

                                    {/* 📅 Other */}
                                    <Typography variant="h6" color="black" fontWeight="bold">📅 Other</Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Age Group</InputLabel>
                                        <Select value={formValues.age_group} onChange={handleChange("age_group")} label="Age Group">
                                            {ageGroups.map(group => (
                                                <MenuItem key={group} value={group}>{group}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel>Chronic Conditions</InputLabel>
                                        <Select
                                            multiple
                                            value={formValues.chronic_conditions}
                                            onChange={handleChange("chronic_conditions")}
                                            label="Chronic Conditions"
                                        >
                                            {conditions.map(cond => (
                                                <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {/* ☀️ Optional */}
                                    <Typography variant="h6" color="black" fontWeight="bold">☀️ Optional</Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Weather Preference</InputLabel>
                                        <Select
                                            value={formValues.weather_preference}
                                            onChange={handleChange("weather_preference")}
                                            label="Weather Preference"
                                        >
                                            {weatherOptions.map(weather => (
                                                <MenuItem key={weather} value={weather}>{weather}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Fade>

                    {/* Mood Image Selection
                    <Card className="shadow-md">
                        <CardContent>
                            <Typography variant="h6" color="black" fontWeight="bold">
                                Pick an image that best represents your current mood
                            </Typography>
                            <Grid container spacing={3} mt={1}>
                                {imageOptions.map((src) => (
                                    <Grid item xs={6} sm={3} key={src}>
                                        <Box
                                            onClick={() => setSelectedImage(src)}
                                            border={selectedImage === src ? 3 : 1}
                                            borderColor={selectedImage === src ? 'primary.main' : 'grey.300'}
                                            borderRadius={2}
                                            overflow="hidden"
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={src}
                                                alt="Mood"
                                                style={{ width: '100%', height: 100, objectFit: 'cover' }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card> */}

                    {/* Submit Button */}
                    <Fade in timeout={1100}>
                        <Box textAlign="center" mt={4}>
                            <Divider sx={{ mb: 4 }} />
                            <Link
                                to="/map"
                                className="border-2 border-black text-black px-6 py-2 rounded-xl font-medium hover:bg-black hover:text-white transition"
                            >
                                Submit
                            </Link>
                        </Box>
                    </Fade>
                </Stack>
            </Container>
        </div>
    );
}
