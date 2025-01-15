import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../assets/js/consts';

const VotingPage = () => {
  const [songs, setSongs] = useState([]);
  const [votedSongs, setVotedSongs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const TIMEOUT_DURATION = 3000; // Timeout duration for the messages

  useEffect(() => {
    fetchAvailableSongs();
  }, []);

  const fetchAvailableSongs = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Update key to match localStorage
      if (!token) throw new Error('No token found in local storage');

      const response = await fetch(`${SERVER_URL}/api/voting/songs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch songs');

      const data = await response.json();
      console.log(data); // Ensure data is logged correctly
      setSongs(data);
      setLoading(false);
    } catch (err) {
      console.error('Error during fetch:', err.message);
      setError('Failed to load songs. Please try again later.');
      setLoading(false);
    }
  };

  const castVote = async (songId) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/voting/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ songId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      // Update voted songs list
      setVotedSongs([...votedSongs, songId]);

      // Remove voted song from available songs
      setSongs(songs.filter((song) => song._id !== songId));

      setMessage('Thank you for voting!');
      setTimeout(() => setMessage(''), TIMEOUT_DURATION);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), TIMEOUT_DURATION);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading songs...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Song Voting</h1>
      <p className="text-lg mb-8 text-center text-gray-600">
        Choose up to 20 songs from the list below. The most popular songs will be selected!
      </p>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-md mb-6 text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-md mb-6 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-all transform hover:scale-105"
            onClick={() => castVote(song._id)}
          >
            <img
              src={song.thumbnail}
              alt={`${song.name} thumbnail`}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800">{song.name}</h3>
              <p className="text-gray-600">{song.artist}</p>
              <p className="text-gray-500 text-sm">{song.genre}</p>
            </div>
          </div>
        ))}
      </div>

      {songs.length === 0 && (
        <div className="text-center text-gray-600 mt-8">No more songs available for voting.</div>
      )}
    </div>
  );
};

export default VotingPage;
