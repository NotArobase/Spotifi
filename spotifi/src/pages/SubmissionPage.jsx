// spotifi/src/pages/SubmissionPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../assets/js/consts";

export default function SubmissionPage() {
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!name || !artist || !genre || !link) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to submit a song.");
        return;
      }

      const response = await fetch(`${SERVER_URL}/api/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          artist,
          genre,
          link,
        }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Failed to submit song");
      }

      const data = await response.json();
      setMessage("Song submitted successfully!");
      // Clear form
      setName("");
      setArtist("");
      setGenre("");
      setLink("");

      // Optionally, navigate to another page, or show success UI
      // navigate("/some-other-page");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Submit Your Song</h1>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow-md p-6 w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="songName">
            Song Name
          </label>
          <input
            id="songName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. My Awesome Track"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="artistName">
            Artist Name
          </label>
          <input
            id="artistName"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="genre">
            Genre
          </label>
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. Rock, Pop, Hip-hop..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="songLink">
            Song Link
          </label>
          <input
            id="songLink"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="URL to SoundCloud, YouTube, etc."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
