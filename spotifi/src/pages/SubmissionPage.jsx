import React, { useState } from "react";
import { SERVER_URL } from "../assets/js/consts";

export default function SubmissionPage() {
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !artist || !genre || !link || !description) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Vous devez être connecté pour soumettre une chanson.");
        return;
      }
      console.log(JSON.stringify({
          name,
          artist,
          genre,
          link,
          description,
        }));
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
          description,
        }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Failed to submit song");
      }

      setMessage("Chanson soumise avec succès !");
      setName("");
      setArtist("");
      setGenre("");
      setLink("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-6">
      <div className="bg-white rounded shadow-md w-full max-w-lg h-[90vh] overflow-y-auto p-6">
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="songName">
              Chanson
            </label>
            <input
              id="songName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Par exemple, Mon morceau génial"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="artistName">
              Artiste
            </label>
            <input
              id="artistName"
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Par exemple, John Doe"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="genre">
              Genre
            </label>
            <input
              id="genre"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Par exemple, Rock, Pop, Hip-hop..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="songLink">
              Lien vers la chanson
            </label>
            <input
              id="songLink"
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="URL vers SoundCloud, YouTube, etc."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
            Parlez-nous de votre chanson !
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Décrivez votre chanson, votre projet..."
              rows= {4}
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
    </div>
  );
}
