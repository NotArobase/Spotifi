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
        await api.addNewPlaylist(data); // Add a new playlist
        alert("Playlist créée avec succès !");
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
    api.deletePlaylist(data.id);
    navigate("/index");
  };

  return (
    <main id="main-area" className="flex justify-center p-8 bg-gray-100">
      <form className="form-group w-full max-w-3xl bg-white p-6 shadow-md rounded-lg">
        <div id="general-info" className="flex flex-col mb-6">
          <fieldset className="form-control mb-6">
            <legend className="text-lg font-semibold text-gray-700">Informations générales</legend>
            <div className="form-control flex flex-col mb-4">
              <label htmlFor="name" className="text-gray-600">Nom:</label>
              <input
                type="text"
                id="name"
                placeholder="Playlist#1"
                value={data.name}
                required
                onChange={handleNameChange}
                className="px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="form-control flex flex-col mb-4">
              <label htmlFor="description" className="text-gray-600">Description:</label>
              <input
                type="text"
                id="description"
                placeholder="Nouvelle playlist"
                value={data.description}
                required
                onChange={handleDescriptionChange}
                className="px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </fieldset>
        </div>

        <fieldset className="form-control mb-6">
          <legend className="text-lg font-semibold text-gray-700">Chansons</legend>
          <datalist id="song-dataList">
            {songs.map((song) => (
              <option key={song._id} value={song.name} />
            ))}
          </datalist>
          <button
            id="add-song-btn"
            className="fa fa-plus text-green-500 text-xl mb-4"
            onClick={addItemSelect}
          ></button>
          <div id="song-list">
            {addedSongs.map((x, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <label htmlFor={`song-${index + 1}`} className="text-gray-600">#{index + 1}</label>
                <input
                  className="song-input px-4 py-2 border border-gray-300 rounded-md w-full"
                  id={`song-${index + 1}`}
                  type="select"
                  list="song-dataList"
                  value={x}
                  onChange={(e) => handleChangeInput(e, index)}
                  required
                />
                {index ? (
                  <button
                    className="fa fa-minus text-red-500 text-xl"
                    onClick={(e) => removeItemSelect(e, index)}
                  ></button>
                ) : null}
              </div>
            ))}
          </div>
        </fieldset>

        {params.id ? (
          <input
            type="submit"
            value={"Modifier la playlist"}
            onClick={handleSubmit}
            id="playlist-submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          />
        ) : (
          <input
            type="submit"
            value={"Ajouter la playlist"}
            onClick={handleSubmit}
            id="playlist-submit"
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
          />
        )}
      </form>

      {params.id && (
        <button
          className="fa fa-trash text-red-500 text-xl mt-6"
          id="playlist-delete"
          onClick={() => {
            deletePlaylist(params.id);
          }}
        ></button>
      )}
    </main>
  );
}
