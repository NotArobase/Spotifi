import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlaylistContext from "../contexts/PlaylistContext";
import { AuthContext } from '../contexts/AuthContext';

export default function CreatePlaylist() {
  const api = useContext(PlaylistContext).api;
  const { currentUser } = useContext(AuthContext);
  const currentUserName = currentUser.username;
  const params = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [addedSongs, setAddedSongs] = useState([""]);
  const MAX_PLAYLISTS = 10;
  const [data, setData] = useState({
    name: "",
    description: "",
    songs: [],
    owner: currentUserName,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    console.log(currentUser);
    api.getAllSongs().then((songs) => {
      // Filter songs for "all" or owned by the current user
      const filteredSongs = songs.filter(
        (song) => song.owner === "all" || song.owner === currentUser.username
      );
      setSongs(filteredSongs);

      if (params.id) {
        api.getPlaylistById(params.id).then((playlist) => {
          const songsInPlaylist = playlist.songs.map((song) =>
            getNameFromId(song.id, filteredSongs)
          );
          setAddedSongs(songsInPlaylist);
          setData(playlist);
        });
      }
    });
  };

  const handleIncrement = async () => {
    try {
      const response = await fetch(`http://localhost:5020/api/users/${currentUser.username}/increment_playlist`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });
      const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to increment N_playlist.');
        }
      alert('N_playlist incremented successfully.');
    } catch (err) {
      alert(`Error: ${err.message}`);
      }
    };

  const handleDecrement = async () => {
    try {
      const response = await fetch(`http://localhost:5020/api/users/${currentUser.username}/decrement_playlist`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });
      const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to decrement N_playlist.');
        }
      alert('N_playlist decremented successfully.');
    } catch (err) {
      alert(`Error: ${err.message}`);
      }
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!data.name || !data.description) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const userId = currentUser?.username; // Use user ID from AuthContext
      if (params.id) {
        if (data.owner !== userId) { // Ensure owner is the current user
          alert("Utilisateur non connecté.");
          return;
        }
        console.log(data);
        await api.updatePlaylist(data); // Update the existing playlist
        alert("Playlist mise à jour avec succès !");
      } else {
          setData({ ...data, owner: userId }); // Ensure owner is set when creating a new playlist
          n_playlist = currentUser.N_playlist;
          if (n_playlist < MAX_PLAYLISTS) {
            await api.addNewPlaylist(data); // Add a new playlist
            await handleIncrement(); // Call handleIncrement
            alert(`IL ${n_playlist}`);
            alert("Playlist créée avec succès !");
          } else {
            alert("Vous ne pouvez pas créer plus de 10 playlists.");
          }
        }
      navigate("/index");
    } catch (error) {
      alert("Une erreur est survenue lors de la soumission de la playlist.");
    }
  };

  const addItemSelect = (event) => {
    event.preventDefault();
    setAddedSongs([...addedSongs, ""]);
  };

  const removeItemSelect = (event, index) => {
    event.preventDefault();
    const newArr = [...addedSongs];
    newArr.splice(index, 1);
    setAddedSongs(newArr);
    const allSongs = newArr.map((song) => {
      const id = getIdFromName(song);
      if (id !== -1) return { id };
    });
    setData({ ...data, songs: allSongs });
  };

  const getIdFromName = (elementName) => {
    const element = songs.find((element) => element.name === elementName);
    const id = element ? element._id : -1;
    return id;
  };

  const getNameFromId = (elementId, songs) => {
    const song = songs.find((song) => song._id === elementId);
    const name = song ? song.name : "";
    return name;
  };

  const handleNameChange = (event) => {
    setData({ ...data, name: event.target.value });
  };

  const handleChangeInput = (event, index) => {
    const newSongChoises = addedSongs;
    newSongChoises[index] = event.target.value;
    setAddedSongs(newSongChoises);
    const allSongs = addedSongs
      .map((song) => {
        const id = getIdFromName(song);
        if (id !== -1) return { id };
      })
      .filter((x) => x !== undefined);
    setData({ ...data, songs: allSongs });
  };

  const handleDescriptionChange = (event) => {
    setData({ ...data, description: event.target.value });
  };

  const deletePlaylist = async (id) => {
    api.deletePlaylist(id);
    await handleDecrement();
    navigate("/index");
  };

  return (
    <main id="main-area" className="flex-row">
      <form className="form-group" id="playlist-form">
        <div id="general-info" className="flex-row">
          <fieldset className="form-control">
            <legend>Informations générales</legend>
            <div className="form-control flex-row">
              <label htmlFor="name"> Nom: </label>
              <input
                type="text"
                id="name"
                placeholder="Playlist#1"
                value={data.name}
                required
                onChange={handleNameChange}
              />
            </div>
            <div className="form-control flex-row">
              <label htmlFor="description">Description: </label>
              <input
                type="text"
                id="description"
                placeholder="Nouvelle playlist"
                value={data.description}
                required
                onChange={handleDescriptionChange}
              />
            </div>
          </fieldset>
        </div>
        <fieldset className="form-control">
          <legend>Chansons</legend>
          <datalist id="song-dataList">
            {songs.map((song) => (
              <option key={song._id} value={song.name} />
            ))}
          </datalist>
          <button id="add-song-btn" className="fa fa-plus" onClick={addItemSelect}></button>
          <div id="song-list">
            {addedSongs.map((x, index) => (
              <div key={index}>
                <label htmlFor={`song-${index + 1}`}>#{index + 1}</label>
                <input
                  className="song-input"
                  id={`song-${index + 1}`}
                  type="select"
                  list="song-dataList"
                  value={x}
                  onChange={(e) => handleChangeInput(e, index)}
                  required
                />
                {index ? <button className="fa fa-minus" onClick={(e) => removeItemSelect(e, index)}></button> : <></>}
              </div>
            ))}
          </div>
        </fieldset>
        {params.id ? (
          <input type="submit" value={"Modifier la playlist"} onClick={handleSubmit} id="playlist-submit" />
        ) : (
          <input type="submit" value={"Ajouter la playlist"} onClick={handleSubmit} id="playlist-submit" />
        )}
      </form>
      {params.id ? (
        <button
          className="fa fa-trash"
          id="playlist-delete"
          onClick={() => {
            deletePlaylist(params.id);
          }}
        ></button>
      ) : (
        <></>
      )}
    </main>
  );
}
