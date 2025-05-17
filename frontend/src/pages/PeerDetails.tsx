import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Card, CardContent} from "../components/ui/Card";

const peerDB = [
    {
        id: 1,
        name: "Alex J.",
        service: "Walk & Talk",
        creditsRequired: 20,
        description: "Stroll together while you share your thoughts.",
        reviews: ["Felt like talking to a friend", "Very supportive"],
    },
    {
        id: 2,
        name: "Jamie L.",
        service: "Listening Session",
        creditsRequired: 15,
        description: "I'm all ears, no judgment—just a friend.",
        reviews: ["Truly listened to me", "Better than some therapy sessions I've had"],
    },
    {
        id: 3,
        name: "Nikola J.",
        service: "New friend",
        creditsRequired: 1,
        description: "You need new friends?",
        reviews: ["Truly listened to me", "Better than some friends."],
    },
];

export default function PeerDetails() {
    const {id} = useParams<{ id: string }>();
    const [peer, setPeer] = useState<any>(null);

    useEffect(() => {
        const data = peerDB.find((p) => p.id === Number(id));
        setPeer(data);
    }, [id]);

    if (!peer) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="bg-white min-h-screen text-gray-900 font-sans px-6 py-10">
            <header className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-black">{peer.name}</h1>
                <p className="text-gray-600">{peer.service}</p>
            </header>

            <main className="max-w-4xl mx-auto mt-10 space-y-8">
                <Card className="shadow-md ">
                    <CardContent>
                        <h2 className="text-xl font-semibold text-black mb-2">About</h2>
                        <p className="text-gray-700">{peer.description}</p>
                        <p className="mt-3 text-sm text-gray-500">
                            Credits Required: <span className="font-semibold text-black">{peer.creditsRequired}</span>
                        </p>
                    </CardContent>
                </Card>

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
