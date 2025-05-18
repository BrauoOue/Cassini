import { useState } from "react";
import Navbar from "../components/NavBar";
import MenuAside from "../components/MenuAside";
import { UsersIcon, PlusIcon } from "lucide-react";

const mockSessions = [
  {
    id: 1,
    name: "Morning Motivation",
    motivation: "Start your day with energy",
    createdBy: "Ana",
    participants: 8,
  },
  {
    id: 2,
    name: "Stress Relief",
    motivation: "Let go of the day’s stress",
    createdBy: "Marko",
    participants: 12,
  },
  {
    id: 3,
    name: "Evening Reflection",
    motivation: "Reflect and unwind together",
    createdBy: "Jovana",
    participants: 6,
  },
];

export default function CirclePage() {
  const [sessions, setSessions] = useState(mockSessions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50">
      <Navbar />
      <MenuAside />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">Active Circle Sessions</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Join an active session or create your own circle of connection and growth.
          </p>
        </div>

        <div className="grid gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="relative border-l-4 border-purple-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl p-6 flex justify-between items-center"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-gray-900">{session.name}</h2>
                <p className="text-sm text-gray-600 italic">{session.motivation}</p>
                <p className="text-sm text-gray-500">Created by <span className="font-medium">{session.createdBy}</span></p>
                <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition w-fit">
                  Join
                </button>
              </div>
              <div className="flex items-center gap-2 text-purple-600 text-lg font-medium">
                <UsersIcon className="w-5 h-5" />
                {session.participants} joined
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <button className="flex items-center justify-center bg-purple-600 text-white rounded-full h-16 w-16 text-3xl hover:bg-purple-700 transition-shadow shadow-md hover:shadow-lg">
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </main>
    </div>
  );
}
