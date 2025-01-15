import React, { useState, useEffect, useContext } from "react";
import Playlist from "../components/Playlist";
import PlaylistContext from "../contexts/PlaylistContext";
import Song from "../components/Song";
import SearchBar from "../components/SearchBar";

  export default function Index() {

    const api = useContext(PlaylistContext).api;
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
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

  /**
   * TODO : implémenter la recherche et la mise à jour de l'interface
   * Effectue une recherche par mot clé sur le serveur.
   * Si exactMatch = true, la recherche est sensible à la case
   * @param {Event} event evenement de soumission à bloquer pour ne pas rafraichir la page
   * @param {string} query mot clé pour la recherche
   * @param {boolean} exactMatch si true, la recherche est sensible à la case
   */
  const handleSearch = async (event, query, exactMatch) => {
    event.preventDefault();
    // TODO : implémenter la recherche et la mise à jour de l'interface
    const searchResults = await api.search(query, exactMatch);
    setPlaylists(searchResults.playlists);
    setSongs(searchResults.songs);
  };

  return (
    <>
      <main id="main-area" className="flex-column">
        {/*TODO : ajouter la barre de recherche*/}
        <SearchBar handleSearch={handleSearch}/>
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
          {/*TODO : afficher les chansons dans la page*/}
          {songs.map((song) => (
            <Song key={song.id} song={song} />
          ))}
        </div>
      </main>
    </>
  );
}
