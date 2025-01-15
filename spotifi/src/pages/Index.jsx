import React, { useState, useEffect, useContext } from "react";
import Playlist from "../components/Playlist";
import PlaylistContext from "../contexts/PlaylistContext";
import Song from "../components/Song";
import SearchBar from "../components/SearchBar";

export default function Index() {// Nouvel état pour les chansons locales

    const api = useContext(PlaylistContext).api;
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [localSongs, setLocalSongs] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const fetchedPlaylists = await api.fetchAllPlaylists();
          setPlaylists(Array.isArray(fetchedPlaylists) ? fetchedPlaylists : []);
        } catch (error) {
          console.error('Failed to fetch playlists:', error);
          setPlaylists([]);
        }
        try {
          const fetchedSongs = await api.fetchAllSongs();
          setSongs(Array.isArray(fetchedSongs) ? fetchedSongs : []);
        } catch (error) {
          console.error('Failed to fetch songs:', error);
          setSongs([]);
        }
      };
      fetchData();
    }, [api]);

  const handleSearch = async (event, query, exactMatch) => {
    event.preventDefault();
    const searchResults = await api.search(query, exactMatch);
    setPlaylists(searchResults.playlists);
    setSongs(searchResults.songs);
  };

  // Fonction pour gérer la sélection du dossier local
  const handleLocalFolder = async () => {
    if ('showDirectoryPicker' in window) {
      try {
        const folderHandle = await window.showDirectoryPicker();
        const files = [];

        for await (const entry of folderHandle.values()) {
          if (entry.kind === 'file' && entry.name.endsWith('.mp3')) {
            const file = await entry.getFile();
            files.push(file);
          }
        }

        setLocalSongs(files); // Mettre à jour les chansons locales
      } catch (err) {
        console.error("Erreur lors de l'accès au dossier local : ", err);
      }
    } else {
      alert("Votre navigateur ne supporte pas cette fonctionnalité.");
    }
  };

  // Fonction pour jouer une chanson
  const playSong = (file) => {
    const audio = new Audio(URL.createObjectURL(file));
    audio.play();
  };

  return (
    <>
      <main id="main-area" className="flex-column">
        <SearchBar handleSearch={handleSearch} />
        <div id="playlist-list">
          <h1>Mes Playlists</h1>
          <section id="playlist-container" className="playlist-container">
            {playlists.map((playlist) => (
              <Playlist key={playlist.id} playlist={playlist} />
            ))}
          </section>
        </div>

        <div id="songs-list">
          <h1>Mes Chansons</h1>
          {songs.map((song) => (
            <Song key={song.id} song={song} />
          ))}
        </div>

        {/* Section "Mes chansons - Local" */}
        <div id="local-songs-section" className="section">
          <h2>Mes chansons - Local</h2>
          <button id="access-local-folder" className="btn" onClick={handleLocalFolder}>
            Accéder au dossier local
          </button>
          <div id="local-songs-list">
            {localSongs.length > 0 ? (
              localSongs.map((song, index) => (
                <div key={index} className="song-item">
                  <p>{song.name}</p>
                  <button onClick={() => playSong(song)}>Jouer</button>
                </div>
              ))
            ) : (
              <p>Aucune chanson locale disponible</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
