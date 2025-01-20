import React, { useState, useEffect, useContext } from "react";
import Playlist from "../components/Playlist";
import { ACTIONS } from "../reducers/reducer";
import PlaylistContext from "../contexts/PlaylistContext";
import Song from "../components/Song";
import SearchBar from "../components/SearchBar";
import { AuthContext } from '../contexts/AuthContext';

export default function Index() {
  const api = useContext(PlaylistContext).api;
  const { currentUser } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const { dispatch } = useContext(PlaylistContext); // Destructure dispatch here

  const playSong = () => {
      dispatch({ type: ACTIONS.PLAY, payload: { index: (index - 1) } });
    };

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

        // Check if fetchedSongs is different from current state
        if (fetchedSongs.length > 0 && JSON.stringify(fetchedSongs) !== JSON.stringify(songs)) {
          setSongs(fetchedSongs); // Set songs locally
          dispatch({ type: ACTIONS.LOAD, payload: { songs: fetchedSongs } }); // Dispatch only if songs are new
        }
      } catch (error) {
        console.error("Failed to fetch songs:", error);
        setSongs([]); // Set songs to an empty array on error
      }
    };

    fetchData();
  }, [api, dispatch, songs]); // Dependency on songs, to check if it's different

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

            const songMetadata = {
              name: file.name,
              isLocal: true,
              liked: false,
              genre: "unknown",
              artist: "unknown",
              src: file.name,
              owner: currentUser?.username || "unknown", // Use currentUser for owner info
            };

            try {
              await api.addNewSong(songMetadata);
            } catch (error) {
              console.error("Failed to add song to database:", error);
            }
          }
        }

        setLocalSongs(files);
      } catch (err) {
        console.error("Error accessing the local folder:", err);
      }
    } else {
      alert("Your browser does not support this feature.");
    }
  };

  return (
    <>
      <main id="main-area" className="flex-column">
        <SearchBar handleSearch={handleSearch} />
        <div id="playlist-list">
          <h1>Mes Playlists</h1>
          <section id="playlist-container" className="playlist-container">
            {playlists.map((playlist) => (
              <Playlist key={playlist._id} playlist={playlist} />
            ))}
          </section>
        </div>

        {/* Section Recommendations */}
        <div id="songs-list">
          <h1>Recommendations</h1>
          {songs
            .filter((song) => !song.isLocal) // Exclude local songs
            .map((song, idx) => (
              <Song key={song._id} song={song} index={idx + 1} onClick={() => playSong(idx + 1)} />
            ))}
        </div>

        {/* Section "Mes chansons - Local" */}
        <div id="local-songs-section" className="section">
          <h1>Mes chansons - Local</h1>
          <button id="access-local-folder" className="btn" onClick={handleLocalFolder}>
            Accéder au dossier local
          </button>
          <div id="local-songs-list">
            {songs.filter(song => song.isLocal && song.owner === currentUser.username).length > 0 ? (
              songs
                .filter(song => song.isLocal && song.owner === currentUser.username)
                .map((song, idx) => (
                  <Song
                    key={song._id}
                    song={song}
                    index={idx + 1 + songs.filter(song => !song.isLocal).length} // Adjust index for local songs
                    onClick={() => playSong(idx + 1 + songs.filter(song => !song.isLocal).length)}
                  />
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
