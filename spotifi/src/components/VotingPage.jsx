import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL, SONG_SERVER_URL } from '../assets/js/consts';
import '../assets/css/styles.css';
import '../assets/css/voting-output.css';

const VotingPage = () => {
  const [songs, setSongs] = useState([]);
  const [votedSongs, setVotedSongs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please log in to vote');
      setLoading(false);
      navigate('/login');
      return;
    }

    loadTailwind();
    fetchInitialData();
    fetchLeaderboard();
  }, []);

  const loadTailwind = async () => {
    try {
      await import('../assets/css/tailwind-voting.css');
      console.log('Tailwind CSS for Voting Page loaded');
    } catch (err) {
      console.error('Failed to load Tailwind CSS:', err);
    }
  };

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${SERVER_URL}/api/voting/songs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }

      const data = await response.json();
      setSongs(data);
      setVotedSongs(data.filter((song) => song.voted).map((song) => song._id));
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${SERVER_URL}/api/voting/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    }
  };

  const toggleVote = async (songId) => {
    // eslint-disable-next-line no-magic-numbers
    if (votedSongs.length >= 20 && !votedSongs.includes(songId)) {
      setError('You can only vote for up to 20 songs.');
      // eslint-disable-next-line no-magic-numbers
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${SERVER_URL}/api/voting/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ songId }),
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
      // eslint-disable-next-line no-magic-numbers
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Vote error:', err);
      setError(err.message);
      // eslint-disable-next-line no-magic-numbers
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

  // Find the maximum vote count to normalize the bar width
  const maxVotes = leaderboard.length > 0 ? Math.max(...leaderboard.map(song => song.voteCount)) : 1;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-row">
      {/* Vote Section (Left Side) */}
      <div className="flex-1 overflow-y-auto mr-6">
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
                  src={`${SONG_SERVER_URL}/${song.thumbnail}`}
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

      {/* Leaderboard Section (Right Side) */}
      <div className="w-2/5 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leaderboard</h2>
        <div>
          {leaderboard.map((song) => (
            <div key={song._id} className="mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{song.artist} - {song.name}</span>
                <span className="text-gray-600">{song.voteCount}</span>
              </div>
              <div className="bg-gray-300 h-4 rounded-full mt-2">
                <div
                  className="h-4 rounded-full bg-green-500"
                  style={{ width: `${(song.voteCount / maxVotes) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center text-gray-600 mt-8">No songs available for leaderboard.</div>
        )}
      </div>
    </div>
  );
};

export default VotingPage;
