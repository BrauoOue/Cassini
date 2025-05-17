import {useState} from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Typography,
    Card, Fade,
    CardContent,
    MenuItem,
    Select, Stack,
    FormControl,
    InputLabel,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Grid,
    Box, Divider,
} from '@mui/material';

const imageOptions = [
    "./public/mood1.jfif",
    "./public/mood2.jfif",
    "./public/mood3.jfif",
    "./public/mood4.jfif",
];

export default function FormPage() {
    const [mentalState, setMentalState] = useState("");
    const [aboutText, setAboutText] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="bg-gradient-to-br from-white to-white min-h-screen text-gray-900 font-sans px-6 py-10">
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
                    {/* Mental State */}
                    <Fade in timeout={600}>
                        <Card elevation={4} sx={{borderRadius: 3}}>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Typography variant="h6" color="black" fontWeight="bold">
                                        How are you feeling right now?
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Momentary Mental State</InputLabel>
                                        <Select
                                            label="Momentary Mental State"
                                            value={mentalState}
                                            onChange={(e) => setMentalState(e.target.value)}
                                        >
                                            <MenuItem value="happy">Happy</MenuItem>
                                            <MenuItem value="neutral">Neutral</MenuItem>
                                            <MenuItem value="sad">Sad</MenuItem>
                                            <MenuItem value="idk">I don't know</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {mentalState === "idk" && (
                                        <TextField
                                            label="Tell me about yourself"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            value={aboutText}
                                            onChange={(e) => setAboutText(e.target.value)}
                                        />
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Fade>

                    {/* Blood Type */}
                    <Fade in timeout={700}>
                        <Card elevation={3} sx={{borderRadius: 3}}>
                            <CardContent>
                                <Typography variant="h6" color="black" fontWeight="bold" mb={1}>
                                    What's your blood type?
                                </Typography>
                                <FormControl fullWidth>
                                    <InputLabel>Blood Type</InputLabel>
                                    <Select label="Blood Type">
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Fade>

                    {/* Character Type */}
                    <Fade in timeout={800}>
                        <Card elevation={3} sx={{borderRadius: 3}}>
                            <CardContent>
                                <Typography variant="h6" color="black" fontWeight="bold" mb={2}>
                                    Are you more of an introvert or extrovert?
                                </Typography>
                                <RadioGroup row>
                                    <FormControlLabel value="introvert" control={<Radio/>} label="Introvert"/>
                                    <FormControlLabel value="extrovert" control={<Radio/>} label="Extrovert"/>
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </Fade>

                    {/* Activity */}
                    <Fade in timeout={900}>
                        <Card elevation={3} sx={{borderRadius: 3}}>
                            <CardContent>
                                <Typography variant="h6" color="black" fontWeight="bold" mb={1}>
                                    What activity do you feel like doing?
                                </Typography>
                                <FormControl fullWidth>
                                    <InputLabel>Preferred Activity</InputLabel>
                                    <Select label="Preferred Activity">
                                        {["Social", "Walk", "Run", "Sport", "Read", "Cook", "Other"].map((activity) => (
                                            <MenuItem key={activity} value={activity}>{activity}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Fade>

                    {/* Image Selection */}
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
                                            sx={{cursor: 'pointer'}}
                                        >
                                            <img
                                                src={src}
                                                alt="Mood"
                                                style={{width: '100%', height: 100, objectFit: 'cover'}}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <Fade in timeout={1100}>
                        <Box textAlign="center" mt={4}>
                            <Divider sx={{mb: 4}}/>
                            <Link
                                to="/map"
                                className="border-2 border-black text-black px-6 py-2 rounded-xl font-medium hover:bg-black hover:text-white transition"
                            >
                                Workout
                            </Link>
                        </Box>
                    </Fade>
                </Stack>
            </Container>
        </div>
    );
}