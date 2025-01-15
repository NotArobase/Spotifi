import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../assets/js/consts';

const VotingPage = () => {
  const [songs, setSongs] = useState([]);
  const [votedSongs, setVotedSongs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableSongs();
  }, []);

  const fetchAvailableSongs = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/voting/songs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch songs');
      
      const data = await response.json();
      setSongs(data);
      setLoading(false);
    } catch (err) {
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ songId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      // Update voted songs list
      setVotedSongs([...votedSongs, songId]);
      
      // Remove voted song from available songs
      setSongs(songs.filter(song => song._id !== songId));
      
      setMessage('Thank you for voting!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Song Voting</h1>
      <p className="mb-4">Choose up to 20 songs from the list below. The most popular songs will be selected!</p>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <p className="text-gray-600">
          Votes cast: {votedSongs.length}/20
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((song) => (
          <div 
            key={song._id}
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => castVote(song._id)}
          >
            <h3 className="font-semibold">{song.name}</h3>
            <p className="text-gray-600">{song.artist}</p>
            <p className="text-gray-500">{song.genre}</p>
          </div>
        ))}
      </div>

      {songs.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No more songs available for voting.
        </div>
      )}
    </div>
  );
};

export default VotingPage;