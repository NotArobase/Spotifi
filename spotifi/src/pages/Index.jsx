import React, { useState, useEffect, useContext } from "react";
import Playlist from "../components/Playlist";
import PlaylistContext from "../contexts/PlaylistContext";
import Song from "../components/Song";
import SearchBar from "../components/SearchBar";

export default function Index() {
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
        console.error("Failed to fetch playlists:", error);
        setPlaylists([]);
      }
      try {
        const fetchedSongs = await api.fetchAllSongs();
        setSongs(Array.isArray(fetchedSongs) ? fetchedSongs : []);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
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

  const handleLocalFolder = async () => {
    if ("showDirectoryPicker" in window) {
      try {
        const folderHandle = await window.showDirectoryPicker();
        const files = [];

        for await (const entry of folderHandle.values()) {
          if (entry.kind === "file" && entry.name.endsWith(".mp3")) {
            const file = await entry.getFile();
            files.push(file);

            // Extract metadata and send to the server
            const songMetadata = {
              name: file.name,
              src: file.webkitRelativePath ? file.webkitRelativePath : file.name, // Handle relative path
            };

            try {
              await api.addNewSong(songMetadata); // Add song to the database
            } catch (error) {
              console.error("Failed to add song to database:", error);
            }
          }
        }

        setLocalSongs(files); // Update local songs in the UI
      } catch (err) {
        console.error("Error accessing the local folder:", err);
      }
    } else {
      alert("Your browser does not support this feature.");
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
          <h1>Mes chansons - Local</h1>
          <button id="access-local-folder" className="btn" onClick={handleLocalFolder}>
            Accéder au dossier local
          </button>
          <div id="local-songs-list">
            {localSongs.length > 0 ? (
              localSongs.map((song, index) => (
                <div key={index} className="song-item">
                  <p>{song.name}</p>
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
