import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../assets/js/consts';

const VotingPage = () => {
  const [songs, setSongs] = useState([]);
  const [votedSongs, setVotedSongs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const TIMEOUT_DURATION = 3000;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No token found in local storage');
        }

        const songsResponse = await fetch(`${SERVER_URL}/api/voting/songs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!songsResponse.ok) throw new Error('Failed to fetch songs');

        const songsData = await songsResponse.json();
        setSongs(songsData);
        // Extract IDs of voted songs from the songs data
        setVotedSongs(songsData.filter(song => song.voted).map(song => song._id));
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const toggleVote = async (songId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found in local storage');
      }

      const response = await fetch(`${SERVER_URL}/api/voting/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ songId })
      });

      if (!response.ok) {
        const errorData = await response.text();
        try {
          const jsonError = JSON.parse(errorData);
          throw new Error(jsonError.error || 'Failed to process vote');
        } catch (e) {
          throw new Error(`Failed to process vote: ${errorData}`);
        }
      }

      const result = await response.json();
      
      // Update local state based on the action returned from the server
      if (result.message === 'Vote removed!') {
        setVotedSongs(votedSongs.filter(id => id !== songId));
        // Update the voted status in songs array
        setSongs(songs.map(song => 
          song._id === songId ? { ...song, voted: false } : song
        ));
      } else {
        setVotedSongs([...votedSongs, songId]);
        // Update the voted status in songs array
        setSongs(songs.map(song => 
          song._id === songId ? { ...song, voted: true } : song
        ));
      }

      setMessage(result.message);
      setTimeout(() => setMessage(''), TIMEOUT_DURATION);
    } catch (err) {
      console.error('Vote error:', err);
      setError(err.message);
      setTimeout(() => setError(''), TIMEOUT_DURATION);
    }
  };

  // Check for token before rendering
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please log in to vote');
      setLoading(false);
    }
  }, []);

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
            onClick={() => toggleVote(song._id)}
            className={`${
              song.voted ? 'bg-green-300' : 'bg-white'
            } p-4 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-all transform hover:scale-105`}
          >
            <div className="playlist-preview relative">
              <img
                alt={`${song.name} thumbnail`}
                src={`${SERVER_URL}/${song.thumbnail}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            </div>
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
