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

  const isValidURL = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)" + // Protocol
        "((([a-zA-Z0-9\\-]+)\\.)+[a-zA-Z]{2,})" + // Domain name
        "(\\/[a-zA-Z0-9\\-._~:?#@!$&'()*+,;=]*)?$",
      "i"
    );
    return pattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !artist || !genre || !link) {
      setError("All fields are required.");
      return;
    }

    if (!isValidURL(link)) {
      setError("Please enter a valid URL for your song link.");
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
        body: JSON.stringify({ name, artist, genre, link }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Failed to submit song.");
      }

      // Success response
      setMessage("Song submitted successfully!");
      setError("");
      setName("");
      setArtist("");
      setGenre("");
      setLink("");

      // Optionally redirect to another page (e.g., /thank-you)
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.message);
      setMessage("");
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
          <label
            htmlFor="songName"
            className="block text-gray-700 font-semibold mb-2"
          >
            Song Name
          </label>
          <input
            id="songName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="e.g., My Awesome Track"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="artistName"
            className="block text-gray-700 font-semibold mb-2"
          >
            Artist Name
          </label>
          <input
            id="artistName"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="e.g., John Doe"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="genre"
            className="block text-gray-700 font-semibold mb-2"
          >
            Genre
          </label>
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="e.g., Rock, Pop, Hip-Hop..."
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="songLink"
            className="block text-gray-700 font-semibold mb-2"
          >
            Song Link
          </label>
          <input
            id="songLink"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="e.g., https://soundcloud.com/my-awesome-track"
            required
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
